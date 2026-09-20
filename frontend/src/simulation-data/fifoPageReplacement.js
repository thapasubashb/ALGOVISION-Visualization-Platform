export const REFERENCE_STRING = [7, 0, 1, 2, 0, 3, 0, 4]
export const FRAME_COUNT = 3

export function buildFifoSteps() {
  const steps = []
  let frames = []
  const queue = [] // FIFO order of insertion
  let faults = 0
  let hits = 0

  steps.push({
    title: `Reference string: ${REFERENCE_STRING.join(', ')} — ${FRAME_COUNT} frames`,
    explanation: `FIFO (First-In, First-Out) page replacement evicts whichever page has been in memory the longest, regardless of how recently it was actually used. We have ${FRAME_COUNT} physical frames to work with.`,
    state: { frames: [], faults: 0, hits: 0, current: null, isFault: null, evicted: null, refIndex: -1 },
  })

  REFERENCE_STRING.forEach((page, i) => {
    if (frames.includes(page)) {
      hits += 1
      steps.push({
        title: `Reference ${page} — HIT`,
        explanation: `Page ${page} is already in memory: [${frames.join(', ')}]. No fault, no eviction needed — this access is fast.`,
        state: { frames: [...frames], faults, hits, current: page, isFault: false, evicted: null, refIndex: i },
      })
      return
    }

    faults += 1
    let evicted = null
    if (frames.length < FRAME_COUNT) {
      frames.push(page)
      queue.push(page)
    } else {
      evicted = queue.shift()
      frames = frames.filter((f) => f !== evicted)
      frames.push(page)
      queue.push(page)
    }

    steps.push({
      title: `Reference ${page} — PAGE FAULT${evicted !== null ? ` (evict ${evicted})` : ''}`,
      explanation: evicted !== null
        ? `Page ${page} is not in memory, and all ${FRAME_COUNT} frames are full. FIFO evicts page ${evicted} — the one that has been resident the longest, having entered memory before any of the others still present — to make room.`
        : `Page ${page} is not in memory, but there's still a free frame, so it's simply loaded in without evicting anything.`,
      state: { frames: [...frames], faults, hits, current: page, isFault: true, evicted, refIndex: i },
    })
  })

  steps.push({
    title: 'Reference string complete',
    explanation: `Out of ${REFERENCE_STRING.length} references, FIFO produced ${faults} page faults and ${hits} hits. Notice FIFO doesn't consider how recently a page was actually used — only how long it's been resident — which is exactly its weakness (see the LRU topic for the improvement).`,
    state: { frames: [...frames], faults, hits, current: null, isFault: null, evicted: null, refIndex: -1, done: true },
  })

  return steps
}

export const fifoPageReplacementNotes = {
  what: 'FIFO (First-In, First-Out) page replacement evicts the page that has been in physical memory the longest, when a new page needs to be loaded and no free frame is available.',
  why: 'Physical memory (RAM) is limited, but programs can reference far more virtual pages than fit at once. When a needed page isn\'t resident (a "page fault"), the OS must choose an existing page to evict — FIFO is the simplest possible policy for that choice.',
  how: 'The OS maintains a queue of pages in the order they were loaded. On a page fault with no free frames, the page at the front of the queue (the oldest resident page) is evicted, and the new page is loaded and pushed to the back of the queue.',
  observe: 'Watch that eviction is based purely on load order — a page that was just used a moment ago can still be evicted if it happened to load in early, which is exactly what happens to page 0 partway through this trace.',
  outcome: `${REFERENCE_STRING.length} references produce several page faults under FIFO — notice this count so you can compare it directly against LRU\'s result on the identical reference string.`,
  points: [
    'FIFO can suffer from Bélády\'s anomaly — a strange case where adding MORE frames actually increases the number of page faults, which shouldn\'t happen intuitively.',
    'FIFO is simple and cheap to implement (just a queue) but ignores actual usage patterns, which usually makes it perform worse than LRU in practice.',
    'The very first accesses to any page are always faults, regardless of algorithm — those are called "compulsory misses."',
  ],
  complexity: 'Each page reference is handled in O(1) — checking frame membership and updating the queue are both constant-time operations (with appropriate data structures).',
  realWorld: 'Real operating systems rarely use pure FIFO because of its poor real-world performance and Bélády\'s anomaly — but it remains an essential teaching baseline for understanding paging.',
}
