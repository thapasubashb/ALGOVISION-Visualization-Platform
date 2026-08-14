import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.get('/', (req, res) => {
  res.json({ status: 'AlgoVision backend is running' })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'A message is required' })
    }

    let systemPrompt = `You are a friendly, patient CS tutor built into a platform called AlgoVision, which visualizes algorithms step by step. Keep answers short — 2 to 4 sentences, beginner-friendly, encouraging. Avoid heavy jargon unless the user clearly wants depth.`

    if (context?.algorithmName) {
      systemPrompt += ` The user is currently viewing a visualization of: ${context.algorithmName}.`
    }
    if (context?.stepDescription) {
      systemPrompt += ` The exact step on screen right now is: "${context.stepDescription}". Answer with this specific moment in mind when relevant.`
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    })

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't come up with an answer just now."
    res.json({ reply })

  } catch (err) {
    console.error('Chat endpoint error:', err.message)
    res.status(500).json({ error: 'Something went wrong talking to the AI. Please try again.' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})