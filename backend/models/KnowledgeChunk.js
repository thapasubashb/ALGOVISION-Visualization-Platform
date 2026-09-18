import mongoose from 'mongoose'

const knowledgeChunkSchema = new mongoose.Schema({
  sourceFile: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
}, { timestamps: true })

export default mongoose.model('KnowledgeChunk', knowledgeChunkSchema)