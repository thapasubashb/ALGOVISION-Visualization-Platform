export const INSERTION_SORT_ARRAY = [6, 3, 8, 2, 9, 4]

export function buildInsertionSortSteps(customArray) {
  const steps = []
  const arr = customArray ? [...customArray] : [...INSERTION_SORT_ARRAY]
  const n = arr.length
  let comparisons = 0
  let shifts = 0

  steps.push({
    title: 'Starting array',
    explanation: `Insertion Sort builds up a sorted portion at the front of the array, one element at a time. For each new element, it shifts backward through the sorted portion, moving larger values right until it finds the correct spot to insert. Starting array: [${arr.join(', ')}].`,
    state: { array: [...arr], states: arr.map((_, i) => (i === 0 ? 'sorted' : 'default')), boundary: 1, comparisons, shifts },
  })

  for (let i = 1; i < n; i += 1) {
    const key = arr[i]
    steps.push({
      title: `Take element at position ${i} (${key}) as the "key"`,
      explanation: `The sorted portion is currently [${arr.slice(0, i).join(', ')}]. We pick up ${key} and will shift it backward through that sorted portion until we find where it belongs.`,
      state: { array: [...arr], states: arr.map((_, idx) => (idx < i ? 'sorted' : idx === i ? 'active' : 'default')), boundary: i, comparisons, shifts },
    })

    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      comparisons += 1
      steps.push({
        title: `${arr[j]} > ${key} — shift ${arr[j]} one position right`,
        explanation: `${arr[j]} at position ${j} is greater than the key (${key}), so it doesn't belong before it. Shift ${arr[j]} one position to the right to make room.`,
        state: { array: [...arr], states: arr.map((_, idx) => (idx === j ? 'compare' : idx === j + 1 ? 'swap' : idx < i ? 'sorted' : 'default')), boundary: i, comparisons, shifts },
      })
      arr[j + 1] = arr[j]
      shifts += 1
      j -= 1
    }
    if (j >= 0) comparisons += 1 // the comparison that stopped the loop
    arr[j + 1] = key

    steps.push({
      title: `Insert ${key} at position ${j + 1}`,
      explanation: j >= 0
        ? `${arr[j]} at position ${j} is not greater than ${key}, so the key finally belongs right after it — inserted at position ${j + 1}.`
        : `The key ${key} is smaller than everything already in the sorted portion, so it belongs right at the very front, position 0.`,
      state: { array: [...arr], states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')), boundary: i + 1, comparisons, shifts },
    })
  }

  steps.push({
    title: 'Array fully sorted',
    explanation: `After ${comparisons} comparisons and ${shifts} shifts, the array is sorted: [${arr.join(', ')}]. Insertion Sort is efficient on nearly-sorted data — if the array were already sorted, each element would need zero shifts.`,
    state: { array: [...arr], states: arr.map(() => 'sorted'), boundary: n, comparisons, shifts, done: true },
  })

  return steps
}

export const insertionSortNotes = {
  what: 'Insertion Sort builds a sorted portion of the array one element at a time, taking each new element and shifting it backward through the sorted portion until it lands in its correct position.',
  why: 'It\'s intuitive (much like sorting playing cards in your hand) and, unlike Bubble or Selection Sort, adapts well to data that\'s already mostly sorted — needing very little work in that case.',
  how: 'Starting from the second element, treat each element as a "key" to insert. Compare it against elements to its left in the sorted portion, shifting each larger one right by one position, until you find the correct spot for the key and drop it in.',
  observe: 'Watch how many positions the key has to shift back — a key that\'s already close to correctly placed barely moves, while a very out-of-place key shifts through many positions.',
  outcome: 'The array ends up sorted in ascending order, having been built up incrementally from a single sorted element into the full sorted array.',
  points: [
    'Insertion Sort is stable — equal elements never swap past each other.',
    'It performs extremely well (close to O(n)) on nearly-sorted input, unlike Selection Sort which always does the same amount of work.',
    'It sorts in-place using only O(1) extra space, and is often used as the base case for more complex hybrid sorts (like Timsort) on small subarrays.',
  ],
  complexity: 'O(n²) comparisons and shifts in the worst case (reverse-sorted input), but O(n) in the best case (already sorted). Space complexity is O(1).',
  realWorld: 'Many production sorting implementations (like Python\'s Timsort, used in `sorted()` and `.sort()`) switch to Insertion Sort for small subarrays because of its low overhead and excellent best-case performance.',
}
