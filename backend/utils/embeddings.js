import { pipeline } from '@huggingface/transformers'

let extractorPromise = null

// Loads the embedding model once and reuses it for every call after that.
// The first call takes a few seconds (loading the model); every call after is fast.
function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractorPromise
}

// Turns a piece of text into a 384-number vector representing its meaning.
export async function embedText(text) {
  const extractor = await getExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}