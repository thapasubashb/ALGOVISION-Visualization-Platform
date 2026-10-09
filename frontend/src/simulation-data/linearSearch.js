export const LINEAR_SEARCH_ARRAY = [12, 7, 19, 4, 25, 9, 16]
export const LINEAR_SEARCH_TARGET = 25

export function buildLinearSearchSteps(customArray, customTarget) {
  const steps = []
  const arr = customArray || LINEAR_SEARCH_ARRAY
  const target = customTarget !== undefined ? customTarget : LINEAR_SEARCH_TARGET
  let comparisons = 0

  steps.push({
    title: `Searching for ${target}`,
    explanation: `Linear Search checks each element one by one, from the start of the array, until it finds a match or reaches the end. It makes no assumption about the array being sorted — it simply can't skip anything. Array: [${arr.join(', ')}].`,
    state: { current: -1, checked: [], found: -1, comparisons },
  })

  for (let i = 0; i < arr.length; i += 1) {
    comparisons += 1
    const isMatch = arr[i] === target
    steps.push({
      title: `Check position ${i}: is ${arr[i]} == ${target}?`,
      explanation: isMatch
        ? `${arr[i]} matches the target! The search stops here — position ${i} is the answer.`
        : `${arr[i]} does not match ${target}, so the search moves on to the next position.`,
      state: { current: i, checked: Array.from({ length: i }, (_, k) => k), found: isMatch ? i : -1, comparisons },
    })
    if (isMatch) break
  }

  const foundIndex = arr.indexOf(target)
  steps.push({
    title: foundIndex !== -1 ? `Found at position ${foundIndex}` : 'Not found',
    explanation: foundIndex !== -1
      ? `${target} was found at position ${foundIndex} after checking ${comparisons} element(s).`
      : `${target} isn't in the array — every element was checked (${comparisons} comparisons) with no match.`,
    state: { current: -1, checked: Array.from({ length: arr.length }, (_, k) => k), found: foundIndex, comparisons, done: true },
  })

  return steps
}

export const linearSearchNotes = {
  what: 'Linear Search checks each element of an array in sequence, from start to end, until it finds the target value or reaches the end without finding it.',
  why: 'It\'s the most basic search possible and works on ANY array — sorted or not. When you have no guarantee about ordering, linear search (or a hash-based lookup) is often your only straightforward option.',
  how: 'Starting from index 0, compare each element to the target. If it matches, return that index immediately. If the loop finishes with no match, the target isn\'t present.',
  observe: 'Watch that every single element before the match gets checked — there\'s no way to skip ahead, since the array isn\'t assumed to be sorted.',
  outcome: 'The target is found at its position after checking every preceding element in order, or the search reports "not found" after scanning the whole array.',
  points: [
    'Linear Search has no requirement that the input be sorted, unlike Binary Search.',
    'Its worst case (checking every element) happens when the target is at the very end or absent entirely.',
    'For small arrays, its simplicity often makes it just as practical as more complex approaches — the overhead of sorting or indexing isn\'t worth it for tiny datasets.',
  ],
  complexity: 'O(n) time in the worst and average case — you may need to check every element. Best case is O(1) if the very first element matches. Space complexity is O(1).',
  realWorld: 'Searching an unsorted list, scanning a small config file for a key, or checking membership in a short unindexed collection are all everyday linear searches, even when you don\'t think of them by that name.',
}
