export const SELECTION_SORT_ARRAY = [7, 2, 9, 4, 1, 6]

export function buildSelectionSortSteps(customArray) {
  const steps = []
  const arr = customArray ? [...customArray] : [...SELECTION_SORT_ARRAY]
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  steps.push({
    title: 'Starting array',
    explanation: `Selection Sort divides the array into a sorted portion (at the front) and an unsorted portion. On each pass, it scans the entire unsorted portion to find the smallest value, then swaps it into place at the front. Starting array: [${arr.join(', ')}].`,
    state: { array: [...arr], states: arr.map(() => 'default'), minIndex: -1, boundary: 0, comparisons, swaps },
  })

  for (let i = 0; i < n - 1; i += 1) {
    let minIdx = i
    steps.push({
      title: `Pass ${i + 1}: assume position ${i} (${arr[i]}) is the minimum so far`,
      explanation: `Start scanning the unsorted portion (from position ${i} onward) assuming ${arr[i]} is the smallest until proven otherwise.`,
      state: { array: [...arr], states: arr.map((_, idx) => (idx < i ? 'sorted' : idx === minIdx ? 'active' : 'default')), minIndex: minIdx, boundary: i, comparisons, swaps },
    })

    for (let j = i + 1; j < n; j += 1) {
      comparisons += 1
      const isSmaller = arr[j] < arr[minIdx]
      steps.push({
        title: `Compare candidate ${arr[j]} (pos ${j}) with current min ${arr[minIdx]} (pos ${minIdx})`,
        explanation: isSmaller
          ? `${arr[j]} is smaller than the current minimum ${arr[minIdx]}, so position ${j} becomes the new candidate for the minimum.`
          : `${arr[j]} is not smaller than the current minimum ${arr[minIdx]}, so the minimum candidate stays at position ${minIdx}.`,
        state: { array: [...arr], states: arr.map((_, idx) => (idx < i ? 'sorted' : idx === j ? 'compare' : idx === minIdx ? 'active' : 'default')), minIndex: isSmaller ? j : minIdx, boundary: i, comparisons, swaps },
      })
      if (isSmaller) minIdx = j
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      swaps += 1
      steps.push({
        title: `Swap positions ${i} and ${minIdx}`,
        explanation: `The true minimum of the unsorted portion, ${arr[i]}, was found at position ${minIdx}. It's swapped into position ${i}, extending the sorted portion by one.`,
        state: { array: [...arr], states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')), minIndex: -1, boundary: i + 1, comparisons, swaps },
      })
    } else {
      steps.push({
        title: `Position ${i} was already the minimum — no swap needed`,
        explanation: `${arr[i]} turned out to already be the smallest value in the unsorted portion, so nothing needs to move.`,
        state: { array: [...arr], states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')), minIndex: -1, boundary: i + 1, comparisons, swaps },
      })
    }
  }

  steps.push({
    title: 'Array fully sorted',
    explanation: `After ${comparisons} comparisons and ${swaps} swaps, the array is sorted: [${arr.join(', ')}]. Notice Selection Sort always does exactly n−1 swaps at most (often fewer), even though its comparison count is the same order as Bubble Sort.`,
    state: { array: [...arr], states: arr.map(() => 'sorted'), minIndex: -1, boundary: n, comparisons, swaps, done: true },
  })

  return steps
}

export const selectionSortNotes = {
  what: 'Selection Sort repeatedly finds the minimum value in the remaining unsorted portion of the array and swaps it into its correct position at the front.',
  why: 'It\'s conceptually simple and, unlike Bubble Sort, performs a predictable, minimal number of swaps — at most n−1 total — which matters when swaps (writes) are more expensive than comparisons (reads).',
  how: 'For each position from left to right, scan the remainder of the array to find the smallest value, tracking its index as you go. Once the scan finishes, swap that minimum into the current position, then move one position to the right and repeat.',
  observe: 'Watch the "current minimum" candidate change as the scan finds smaller values, and notice the swap only happens once per pass — after the entire unsorted region has been fully scanned, not during it.',
  outcome: 'The array ends up sorted in ascending order, built up one confirmed-minimum value at a time from left to right.',
  points: [
    'Selection Sort always performs the same number of comparisons regardless of the input\'s initial order — unlike Bubble Sort, it has no early-exit for already-sorted input.',
    'It performs at most n−1 swaps total, which can matter a lot when writing to memory (or disk) is expensive.',
    'It is NOT stable by default — equal elements can have their relative order changed by a swap.',
  ],
  complexity: 'O(n²) comparisons in every case (best, average, worst) since it always fully scans the remaining unsorted portion. Space complexity is O(1).',
  realWorld: 'Its minimal-swap property makes Selection Sort occasionally useful when writes are far more costly than reads — such as sorting data on flash memory, where minimizing write cycles matters.',
}
