export const LRU_REFERENCE_STRING = [7, 0, 1, 2, 0, 3, 0, 4]
export const LRU_FRAME_COUNT = 3

export function buildLruSteps() {
  const steps = []
  let recency = [] // index 0 = least recently used, last = most recently used
  let faults = 0
  let hits = 0

  steps.push({
    title: `Reference string: ${LRU_REFERENCE_STRING.join(', ')} — ${LRU_FRAME_COUNT} frames`,
    explanation: `LRU (Least Recently Used) tracks how recently each resident page was actually accessed, and evicts whichever one hasn't been touched in the longest time — a much better proxy for "will this be needed again soon" than FIFO's load order.`,
    state: { recency: [], faults: 0, hits: 0, current: null, isFault: null, evicted: null, refIndex: -1 },
  })

  LRU_REFERENCE_STRING.forEach((page, i) => {
    if (recency.includes(page)) {
      hits += 1
      recency = recency.filter((p) => p !== page)
      recency.push(page) // move to most-recently-used position
      steps.push({
        title: `Reference ${page} — HIT (recency updated)`,
        explanation: `Page ${page} is already in memory. It's a hit, but LRU still does one thing: it moves ${page} to the "most recently used" end of its tracking order, since it was just accessed again.`,
        state: { recency: [...recency], faults, hits, current: page, isFault: false, evicted: null, refIndex: i },
      })
      return
    }

    faults += 1
    let evicted = null
    if (recency.length >= LRU_FRAME_COUNT) {
      evicted = recency.shift() // least recently used
    }
    recency.push(page)

    steps.push({
      title: `Reference ${page} — PAGE FAULT${evicted !== null ? ` (evict ${evicted}, least recently used)` : ''}`,
      explanation: evicted !== null
        ? `Page ${page} is not in memory, and all frames are full. Of the resident pages, ${evicted} is the one that hasn't been accessed in the longest time — LRU evicts it specifically because it looks least likely to be needed again soon.`
        : `Page ${page} is not in memory, but a free frame is still available, so it's loaded without evicting anything.`,
      state: { recency: [...recency], faults, hits, current: page, isFault: true, evicted, refIndex: i },
    })
  })

  steps.push({
    title: 'Reference string complete',
    explanation: `On the exact same reference string, LRU produced ${faults} page faults versus FIFO's result on the FIFO Page Replacement topic — LRU\'s use of actual recency information typically pays off, though it costs more to track than FIFO\'s simple queue.`,
    state: { recency: [...recency], faults, hits, current: null, isFault: null, evicted: null, refIndex: -1, done: true },
  })

  return steps
}

export const lruPageReplacementNotes = {
  what: 'LRU (Least Recently Used) page replacement evicts whichever resident page has gone the longest without being accessed, when a new page must be loaded and no frame is free.',
  why: 'Programs tend to exhibit "locality of reference" — pages used recently are likely to be used again soon, and pages untouched for a while are less likely to be needed. LRU directly exploits this pattern, unlike FIFO which ignores usage entirely.',
  how: 'The OS tracks an ordering of resident pages by how recently each was accessed. On a hit, the accessed page moves to the "most recently used" end. On a fault with no free frames, the page at the "least recently used" end is evicted.',
  observe: 'Compare directly against FIFO on the identical reference string — watch page 0 survive longer under LRU (because it keeps getting re-accessed) than it did under FIFO\'s pure load-order eviction.',
  outcome: `LRU produces fewer page faults than FIFO on this same reference string, because it evicts based on actual usage recency rather than arbitrary load order.`,
  points: [
    'True LRU needs a timestamp or ordered list update on every single memory access, which is more expensive to implement in hardware than FIFO\'s simple queue.',
    'Real systems often use an approximation of LRU (like the "clock" / second-chance algorithm) that\'s cheaper to track but behaves similarly.',
    'LRU does not suffer from Bélády\'s anomaly the way FIFO can — adding more frames to LRU never increases the fault count.',
  ],
  complexity: 'A correct O(1) implementation is possible using a doubly-linked list plus a hash map (moving a page to the "most recent" end in constant time) — the same design used in many LRU-cache implementations.',
  realWorld: 'LRU (or an approximation of it) is the eviction policy behind not just OS page replacement, but also CPU caches, browser caches, CDN caches, and libraries like Python\'s `functools.lru_cache`.',
}
