export const BINARY_SEARCH_ARRAY = [2, 5, 8, 12, 16, 23, 29, 34, 41]
export const BINARY_SEARCH_TARGET = 23

export function buildBinarySearchSteps(customArray, customTarget) {
  const steps = []
  const arr = customArray ? [...customArray].sort((a, b) => a - b) : BINARY_SEARCH_ARRAY
  const target = customTarget !== undefined ? customTarget : BINARY_SEARCH_TARGET
  let lo = 0
  let hi = arr.length - 1
  let comparisons = 0
  let foundIndex = -1

  steps.push({
    title: `Searching for ${target} in a SORTED array`,
    explanation: `Binary Search only works on sorted data. It repeatedly checks the middle element of the current range and eliminates half the remaining possibilities with every comparison. Array: [${arr.join(', ')}].`,
    state: { lo, hi, mid: -1, found: -1, comparisons },
  })

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    comparisons += 1
    steps.push({
      title: `Check middle of [${lo}, ${hi}]: position ${mid} (${arr[mid]})`,
      explanation: `The middle of the current range is position ${mid}, holding ${arr[mid]}. Comparing it to the target ${target}...`,
      state: { lo, hi, mid, found: -1, comparisons },
    })

    if (arr[mid] === target) {
      foundIndex = mid
      steps.push({
        title: `${arr[mid]} matches — found at position ${mid}`,
        explanation: `${arr[mid]} equals the target exactly. Search complete after just ${comparisons} comparison(s) — dramatically fewer than a linear scan would need on a larger array.`,
        state: { lo, hi, mid, found: mid, comparisons },
      })
      break
    } else if (arr[mid] < target) {
      steps.push({
        title: `${arr[mid]} < ${target} — search the right half`,
        explanation: `Since the array is sorted, if ${arr[mid]} is less than the target, the target (if present) must be somewhere to the right. The entire left half, including position ${mid}, is eliminated in one step.`,
        state: { lo, hi, mid, found: -1, comparisons },
      })
      lo = mid + 1
    } else {
      steps.push({
        title: `${arr[mid]} > ${target} — search the left half`,
        explanation: `Since the array is sorted, if ${arr[mid]} is greater than the target, the target (if present) must be somewhere to the left. The entire right half, including position ${mid}, is eliminated in one step.`,
        state: { lo, hi, mid, found: -1, comparisons },
      })
      hi = mid - 1
    }
  }

  steps.push({
    title: foundIndex !== -1 ? `Found at position ${foundIndex}` : 'Not found',
    explanation: foundIndex !== -1
      ? `${target} was found at position ${foundIndex} using only ${comparisons} comparisons on a ${arr.length}-element array.`
      : `The search range became empty (lo > hi) without a match — ${target} isn't in the array.`,
    state: { lo, hi, mid: -1, found: foundIndex, comparisons, done: true },
  })

  return steps
}

export const binarySearchNotes = {
  what: 'Binary Search finds a target value in a SORTED array by repeatedly checking the middle element and eliminating half of the remaining search space with each comparison.',
  why: 'Sorted order is powerful information — it lets you skip checking most of the array entirely, since you know immediately which half a value must be in based on a single comparison.',
  how: 'Maintain a low and high boundary spanning the current search range. Check the middle element: if it matches, you\'re done; if it\'s too small, move the low boundary past it (search the right half); if it\'s too large, move the high boundary before it (search the left half). Repeat until found or the range is empty.',
  observe: 'Watch the search range (low to high) roughly halve with every single comparison — this is dramatically faster than Linear Search\'s one-element-at-a-time elimination.',
  outcome: `${BINARY_SEARCH_TARGET} is found in just a few comparisons, versus what could be up to ${BINARY_SEARCH_ARRAY.length} comparisons with Linear Search on the same array.`,
  points: [
    'Binary Search REQUIRES the input to already be sorted — running it on unsorted data gives incorrect, unpredictable results.',
    'If the data changes frequently, the cost of keeping it sorted may outweigh Binary Search\'s speed advantage over Linear Search.',
    'Binary Search is the foundation for many other algorithms, like finding insertion points, or searching in rotated sorted arrays.',
  ],
  complexity: 'O(log n) time — each comparison eliminates half the remaining elements, so an array of size n takes only about log₂(n) comparisons. Space complexity is O(1) for the iterative version shown here.',
  realWorld: 'Looking up a word in a physical dictionary, or a database index seeking a specific key (see the DBMS Indexing and B+ Tree topics), both rely on exactly this halving strategy.',
}
