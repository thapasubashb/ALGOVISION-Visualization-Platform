export const QUICK_SORT_ARRAY = [8, 3, 7, 1, 9, 2, 5]

export function buildQuickSortSteps(customArray) {
  const steps = []
  const arr = customArray ? [...customArray] : [...QUICK_SORT_ARRAY]
  const n = arr.length
  let comparisons = 0
  let swaps = 0
  const sorted = new Set()

  function snapshot(title, explanation, extra) {
    steps.push({
      title,
      explanation,
      state: { array: [...arr], sorted: [...sorted], comparisons, swaps, ...extra },
    })
  }

  steps.push({
    title: 'Starting array',
    explanation: `Quick Sort picks a "pivot" value, then partitions the array so everything smaller than the pivot ends up to its left and everything larger ends up to its right. It then recursively sorts each side. Starting array: [${arr.join(', ')}].`,
    state: { array: [...arr], sorted: [], comparisons, swaps, pivotIndex: -1, compareIndex: -1, range: null },
  })

  function quickSort(lo, hi) {
    if (lo >= hi) {
      if (lo === hi) sorted.add(lo)
      return
    }
    const pivot = arr[hi]
    snapshot(`Pivot = ${pivot} (position ${hi})`, `The last element of this range, ${pivot}, is chosen as the pivot. Everything else in the range [${arr.slice(lo, hi + 1).join(', ')}] will be compared against it.`, { pivotIndex: hi, compareIndex: -1, range: [lo, hi] })

    let i = lo - 1
    for (let j = lo; j < hi; j += 1) {
      comparisons += 1
      const goesLeft = arr[j] < pivot
      snapshot(`Compare ${arr[j]} with pivot ${pivot}`, goesLeft
        ? `${arr[j]} is less than the pivot (${pivot}), so it belongs in the left (smaller) partition.`
        : `${arr[j]} is not less than the pivot (${pivot}), so it stays in the right (larger) partition for now.`,
        { pivotIndex: hi, compareIndex: j, range: [lo, hi] })

      if (goesLeft) {
        i += 1
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          swaps += 1
          snapshot(`Swap positions ${i} and ${j}`, `${arr[j]} and ${arr[i]} are swapped, growing the "smaller than pivot" region by one.`, { pivotIndex: hi, compareIndex: -1, range: [lo, hi] })
        }
      }
    }

    ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
    swaps += 1
    sorted.add(i + 1)
    snapshot(`Place pivot ${pivot} at position ${i + 1}`, `The pivot is swapped into position ${i + 1} — its final, correct sorted position. Everything to its left is smaller, everything to its right is larger.`, { pivotIndex: -1, compareIndex: -1, range: [lo, hi] })

    quickSort(lo, i)
    quickSort(i + 2, hi)
  }

  quickSort(0, n - 1)

  steps.push({
    title: 'Array fully sorted',
    explanation: `After ${comparisons} comparisons and ${swaps} swaps, the array is sorted: [${arr.join(', ')}]. Each pivot placement locks in one more element's final position, which is why the sorted set grows with every partition step.`,
    state: { array: [...arr], sorted: Array.from({ length: n }, (_, i) => i), comparisons, swaps, pivotIndex: -1, compareIndex: -1, range: null, done: true },
  })

  return steps
}

export const quickSortNotes = {
  what: 'Quick Sort is a divide-and-conquer algorithm that picks a "pivot" element, partitions the array so smaller values end up left of it and larger values end up right of it, then recursively sorts each side.',
  why: 'When the pivot splits the array roughly in half each time, Quick Sort achieves O(n log n) performance with very low overhead — in practice, it\'s often faster than Merge Sort because it sorts in-place and has excellent cache behavior.',
  how: 'Choose a pivot (here, the last element of the current range). Walk through the range, and whenever an element is smaller than the pivot, swap it into a growing "smaller" region. After the walk, swap the pivot into place right after that region — it\'s now in its final sorted position. Recurse on both sides.',
  observe: 'Watch each pivot get swapped into its final position exactly once — that position never changes again, which is why the "sorted" set grows by one guaranteed-correct position with every partition.',
  outcome: 'The array ends up sorted in ascending order, built by recursively partitioning around a sequence of pivots.',
  points: [
    'Quick Sort\'s worst case is O(n²), which happens when the pivot is consistently the smallest or largest element (e.g., an already-sorted array with last-element pivoting) — real implementations often randomize pivot choice to avoid this.',
    'Unlike Merge Sort, Quick Sort sorts in-place, needing only O(log n) extra space for recursion.',
    'It is NOT stable — the partitioning swaps can change the relative order of equal elements.',
  ],
  complexity: 'O(n log n) average case, O(n²) worst case (rare with good pivot selection). Space complexity is O(log n) for the recursion stack in the average case.',
  realWorld: 'Many standard library sort functions (like C\'s `qsort`, and historically Java\'s primitive array sort) are built on Quick Sort or a hybrid variant, chosen for its excellent real-world average-case speed.',
}
