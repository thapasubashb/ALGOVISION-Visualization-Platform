import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Groq from 'groq-sdk'
import authRoutes from './routes/auth.js'
import progressRoutes from './routes/progress.js'
import KnowledgeChunk from './models/KnowledgeChunk.js'
import { embedText } from './utils/embeddings.js'

dotenv.config()
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b'

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message))

app.get('/', (req, res) => {
  res.json({ status: 'AlgoVision backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/progress', progressRoutes)

// Looks up the most relevant chunks of real algorithm source code for a given
// question. If anything goes wrong here, we return an empty string instead of
// throwing — a broken retrieval step should never take down the whole chatbot.
async function retrieveRelevantContext(message) {
  try {
    const queryEmbedding = await embedText(message)

    const results = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 20,
          limit: 2,
        },
      },
      {
        $project: {
          sourceFile: 1,
          content: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ])

    if (!results.length) return ''

    return results
      .map((r) => `--- Source: ${r.sourceFile} ---\n${r.content}`)
      .join('\n\n')
  } catch (err) {
    console.error('Retrieval error (continuing without extra context):', err.message)
    return ''
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'A message is required' })
    }

    let systemPrompt = `You are a friendly, patient CS tutor built into AlgoVision, which visualizes algorithms step by step. Keep answers short — 2 to 4 sentences, beginner-friendly, encouraging.`

    if (context?.algorithmName) {
      systemPrompt += ` The user is currently viewing: ${context.algorithmName}.`
    }
    if (context?.stepDescription) {
      systemPrompt += ` Current step: "${context.stepDescription}".`
    }

    const relevantContext = await retrieveRelevantContext(message)
    if (relevantContext) {
      systemPrompt += `\n\nHere is the real source code for the algorithm(s) most relevant to the user's question. Use it to answer accurately based on this exact implementation, not just general knowledge:\n\n${relevantContext}`
    }

    const groqModel = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL

    const completion = await groq.chat.completions.create({
      model: groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    })

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate an answer."
    res.json({ reply })
  } catch (err) {
    console.error('Chat error details:', err)
    res.status(502).json({
      error: 'The AI provider rejected the request. Check your Groq API key and model access.',
      details: err?.message || 'Unknown error',
    })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})