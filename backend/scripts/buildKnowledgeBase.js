import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import KnowledgeChunk from '../models/KnowledgeChunk.js'
import { embedText } from '../utils/embeddings.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge')

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.js'))
  console.log(`Found ${files.length} source files to embed.`)

  // Clear out any previous run so re-running this script doesn't create duplicates
  await KnowledgeChunk.deleteMany({})

  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    console.log(`Embedding ${file}...`)
    const embedding = await embedText(content)

    await KnowledgeChunk.create({ sourceFile: file, content, embedding })
  }

  console.log(`Done. ${files.length} chunks stored in the knowledgechunks collection.`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Failed to build knowledge base:', err)
  process.exit(1)
})