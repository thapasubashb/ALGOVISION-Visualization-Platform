export const BUBBLE_SORT_ARRAY = [8, 3, 5, 1, 9, 2]

export function buildBubbleSortSteps(customArray) {
  const steps = []
  const arr = customArray ? [...customArray] : [...BUBBLE_SORT_ARRAY]
  const n = arr.length
  const sortedFrom = new Set()

  steps.push({
    title: 'Starting array',
    explanation: `Bubble Sort repeatedly steps through the array, comparing each pair of adjacent elements and swapping them if they're in the wrong order. Larger values "bubble up" toward the end with each full pass. Starting array: [${arr.join(', ')}].`,
    state: { array: [...arr], states: arr.map(() => 'default'), pass: 0, comparisons: 0, swaps: 0 },
  })

  let comparisons = 0
  let swaps = 0

  for (let i = 0; i < n - 1; i += 1) {
    let swappedThisPass = false
    for (let j = 0; j < n - 1 - i; j += 1) {
      comparisons += 1
      const states = arr.map((_, idx) => (sortedFrom.has(idx) ? 'sorted' : idx === j || idx === j + 1 ? 'compare' : 'default'))
      steps.push({
        title: `Pass ${i + 1}: compare positions ${j} and ${j + 1} (${arr[j]} vs ${arr[j + 1]})`,
        explanation: `Comparing the two adjacent values ${arr[j]} and ${arr[j + 1]}. ${arr[j] > arr[j + 1] ? `${arr[j]} is greater than ${arr[j + 1]}, so they're out of order and need to be swapped.` : `${arr[j]} is already less than or equal to ${arr[j + 1]}, so they're left in place.`}`,
        state: { array: [...arr], states, pass: i + 1, comparisons, swaps },
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swaps += 1
        swappedThisPass = true
        const swapStates = arr.map((_, idx) => (sortedFrom.has(idx) ? 'sorted' : idx === j || idx === j + 1 ? 'swap' : 'default'))
        steps.push({
          title: `Swap positions ${j} and ${j + 1}`,
          explanation: `${arr[j + 1]} and ${arr[j]} are swapped, so the larger value moves one step closer to its correct position at the end of the array.`,
          state: { array: [...arr], states: swapStates, pass: i + 1, comparisons, swaps },
        })
      }
    }
    sortedFrom.add(n - 1 - i)
    steps.push({
      title: `End of pass ${i + 1}`,
      explanation: `After this pass, the largest remaining unsorted value (${arr[n - 1 - i]}) has bubbled all the way to position ${n - 1 - i}, which is now locked in as sorted. ${swappedThisPass ? 'The next pass will scan one fewer element, since the tail is now settled.' : 'No swaps happened this entire pass, which actually means the array is already fully sorted!'}`,
      state: { array: [...arr], states: arr.map((_, idx) => (idx >= n - 1 - i ? 'sorted' : 'default')), pass: i + 1, comparisons, swaps },
    })
    if (!swappedThisPass) break
  }

  steps.push({
    title: 'Array fully sorted',
    explanation: `After ${comparisons} comparisons and ${swaps} swaps, the array is sorted: [${arr.join(', ')}]. Bubble Sort's simplicity comes at a cost — it's rarely used in practice for large datasets because of its O(n²) comparisons.`,
    state: { array: [...arr], states: arr.map(() => 'sorted'), pass: n - 1, comparisons, swaps, done: true },
  })

  return steps
}

export const bubbleSortNotes = {
  what: 'Bubble Sort repeatedly steps through an array, comparing adjacent pairs and swapping them if they\'re out of order, until no swaps are needed.',
  why: 'It\'s one of the simplest sorting algorithms to understand and implement, making it a common first introduction to the idea of a comparison-based sort — though its inefficiency limits its real-world use.',
  how: 'Each full pass compares every adjacent pair from the start of the unsorted portion to the end, swapping when the left value is greater. Every pass guarantees the largest remaining value "bubbles up" to its correct final position.',
  observe: 'Watch how each pass needs to check one fewer element than the last, since the tail of the array locks into its sorted position pass by pass — and notice a pass with zero swaps means the array is already sorted.',
  outcome: 'The array ends up fully sorted in ascending order, with every value having bubbled to its correct position through repeated adjacent swaps.',
  points: [
    'Bubble Sort can detect an already-sorted array early: if a full pass makes zero swaps, it can stop immediately.',
    'It is a stable sort — equal elements never change their relative order.',
    'It sorts in-place, needing no extra memory beyond the original array.',
  ],
  complexity: 'O(n²) comparisons and swaps in the worst and average case, but O(n) in the best case (already sorted, with the early-exit optimization). Space complexity is O(1).',
  realWorld: 'Rarely used in production due to its inefficiency on large inputs, but its simplicity still makes it a common teaching tool for introducing algorithmic thinking and Big-O analysis.',
}
