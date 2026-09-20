export const INITIAL_BLOCKS = [100, 500, 200, 300, 600]
export const MEMORY_PROCESSES = [
  { id: 'P1', size: 212 },
  { id: 'P2', size: 417 },
  { id: 'P3', size: 112 },
  { id: 'P4', size: 426 },
]

const STRATEGY_LABEL = { first: 'First Fit', best: 'Best Fit', worst: 'Worst Fit' }

function pickBlock(freeSizes, size, strategy) {
  const candidates = freeSizes.map((f, i) => ({ i, f })).filter((c) => c.f >= size)
  if (candidates.length === 0) return -1
  if (strategy === 'first') return candidates[0].i
  if (strategy === 'best') return candidates.reduce((a, b) => (b.f < a.f ? b : a)).i
  return candidates.reduce((a, b) => (b.f > a.f ? b : a)).i
}

export function buildMemoryAllocationSteps(strategy) {
  const steps = []
  let free = [...INITIAL_BLOCKS]
  const assigned = Array(INITIAL_BLOCKS.length).fill(null)

  steps.push({
    title: `${STRATEGY_LABEL[strategy]} — initial memory blocks: ${INITIAL_BLOCKS.join(', ')} KB`,
    explanation: `We have 5 free memory blocks of sizes ${INITIAL_BLOCKS.join(', ')} KB. Four processes need to be allocated space: ${MEMORY_PROCESSES.map((p) => `${p.id} (${p.size} KB)`).join(', ')}. ${strategyExplain(strategy)}`,
    state: { free: [...free], assigned: [...assigned], currentProcess: null, chosenIndex: -1, failed: null },
  })

  for (const p of MEMORY_PROCESSES) {
    const idx = pickBlock(free, p.size, strategy)
    if (idx === -1) {
      steps.push({
        title: `${p.id} (${p.size} KB) — allocation FAILS`,
        explanation: `No single free block is large enough to hold ${p.size} KB, even though the total free memory across all blocks may be more than enough. This is external fragmentation: free space exists, but it's scattered into pieces too small individually to satisfy the request.`,
        state: { free: [...free], assigned: [...assigned], currentProcess: p.id, chosenIndex: -1, failed: p.id },
      })
      continue
    }
    const before = free[idx]
    free[idx] = free[idx] - p.size
    assigned[idx] = p.id
    steps.push({
      title: `${p.id} (${p.size} KB) → Block ${idx} (was ${before} KB)`,
      explanation: `${STRATEGY_LABEL[strategy]} selects Block ${idx} (${before} KB free) for ${p.id}. ${p.size} KB is allocated, leaving ${free[idx]} KB free in that block as a fragment.`,
      state: { free: [...free], assigned: [...assigned], currentProcess: p.id, chosenIndex: idx, failed: null },
    })
  }

  const totalFree = free.reduce((a, b) => a + b, 0)
  const failedCount = assigned.filter((a) => a === null).length
  steps.push({
    title: 'Allocation complete',
    explanation: `${strategyExplain(strategy)} Final result: ${MEMORY_PROCESSES.length - MEMORY_PROCESSES.filter((p) => !assigned.includes(p.id)).length}/${MEMORY_PROCESSES.length} processes allocated, ${totalFree} KB free but split across ${free.filter((f) => f > 0).length} fragmented blocks.`,
    state: { free: [...free], assigned: [...assigned], currentProcess: null, chosenIndex: -1, failed: null, done: true },
  })

  return steps
}

function strategyExplain(strategy) {
  if (strategy === 'first') return 'First Fit scans blocks in order and allocates the first one big enough — fast, but can waste large blocks on small requests early on.'
  if (strategy === 'best') return 'Best Fit scans all blocks and picks the smallest one that still fits — minimizing wasted space per allocation, at the cost of a full scan every time.'
  return 'Worst Fit scans all blocks and picks the largest one available — the idea is to leave a large, more useful leftover fragment, though it doesn\'t always work out that way.'
}

export const memoryAllocationNotes = {
  what: 'Memory allocation strategies decide which free block of memory to give a process when it requests space, when multiple free blocks are large enough.',
  why: 'Over time, as processes allocate and free memory, available space becomes fragmented into scattered blocks of different sizes. Which block gets chosen for a new request significantly affects how much usable free space remains later.',
  how: 'First Fit takes the first block encountered that\'s big enough. Best Fit scans everything and picks the smallest sufficient block (minimizing leftover waste). Worst Fit scans everything and picks the largest block (trying to leave a more useful-sized remainder).',
  observe: 'Switch between the three strategies on the identical block/process setup and watch how differently they behave — notably, whether P4 (426 KB) can be allocated at all depends entirely on which strategy was used earlier.',
  outcome: 'Best Fit successfully allocates all 4 processes on this specific example, while First Fit and Worst Fit both leave P4 unable to find a large-enough block — a direct, concrete illustration of how allocation strategy affects real outcomes.',
  points: [
    'No single strategy is universally best — Best Fit\'s full-block scan is slower, and can create many small, useless leftover fragments over time (despite the name).',
    'This scenario is a "worst case" specifically chosen to show fragmentation — real workloads vary widely in how each strategy performs.',
    'Compaction (shifting allocated memory together to merge free space into one large block) is one way operating systems combat fragmentation, at the cost of the time it takes to move things.',
  ],
  complexity: 'First Fit averages O(n) per allocation (early exit possible). Best Fit and Worst Fit are O(n) per allocation too, but always scan every block since they need the true minimum/maximum.',
  realWorld: 'These exact strategies (and their tradeoffs) apply directly to how `malloc` implementations, memory pool allocators, and even disk space allocators decide where to place new data.',
}
