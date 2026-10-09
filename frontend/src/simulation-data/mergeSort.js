export const MERGE_SORT_ARRAY = [6, 3, 8, 2, 9, 4, 1]

export function buildMergeSortSteps(customArray) {
  const steps = []
  const arr = customArray ? [...customArray] : [...MERGE_SORT_ARRAY]
  const n = arr.length
  let comparisons = 0

  function snapshot(range, compareIdx, title, explanation) {
    steps.push({
      title,
      explanation,
      state: {
        array: [...arr],
        activeRange: range,
        compareIndices: compareIdx || [],
        comparisons,
      },
    })
  }

  steps.push({
    title: 'Starting array',
    explanation: `Merge Sort splits the array in half recursively until each piece has just one element (trivially sorted), then merges those pieces back together in sorted order. Starting array: [${arr.join(', ')}].`,
    state: { array: [...arr], activeRange: null, compareIndices: [], comparisons },
  })

  function mergeSort(lo, hi) {
    if (hi - lo <= 1) return
    const mid = Math.floor((lo + hi) / 2)
    snapshot([lo, hi], [], `Split [${arr.slice(lo, hi).join(', ')}]`, `The range from position ${lo} to ${hi - 1} is split into two halves: [${arr.slice(lo, mid).join(', ')}] and [${arr.slice(mid, hi).join(', ')}]. Each half will be sorted independently before merging.`)

    mergeSort(lo, mid)
    mergeSort(mid, hi)

    const left = arr.slice(lo, mid)
    const right = arr.slice(mid, hi)
    snapshot([lo, hi], [], `Merge [${left.join(', ')}] and [${right.join(', ')}]`, `Both halves are now individually sorted: [${left.join(', ')}] and [${right.join(', ')}]. Now merge them into one sorted run by repeatedly taking the smaller of the two fronts.`)

    let i = 0
    let j = 0
    let k = lo
    while (i < left.length && j < right.length) {
      comparisons += 1
      const takeLeft = left[i] <= right[j]
      snapshot([lo, hi], [lo + i, mid + j], `Compare ${left[i]} vs ${right[j]}`, `Comparing the front of each half: ${left[i]} vs ${right[j]}. ${takeLeft ? `${left[i]} is smaller (or equal), so it's placed next into the merged result.` : `${right[j]} is smaller, so it's placed next into the merged result.`}`)
      if (takeLeft) {
        arr[k] = left[i]
        i += 1
      } else {
        arr[k] = right[j]
        j += 1
      }
      k += 1
      snapshot([lo, hi], [], `Place ${arr[k - 1]} at position ${k - 1}`, `${arr[k - 1]} is written into position ${k - 1} of the array — the next slot in the merged, sorted run.`)
    }
    while (i < left.length) {
      arr[k] = left[i]
      snapshot([lo, hi], [], `Copy remaining ${left[i]}`, `The right half is exhausted, so the rest of the left half (${left.slice(i).join(', ')}) is copied over in order, since it's already sorted.`)
      i += 1
      k += 1
    }
    while (j < right.length) {
      arr[k] = right[j]
      snapshot([lo, hi], [], `Copy remaining ${right[j]}`, `The left half is exhausted, so the rest of the right half (${right.slice(j).join(', ')}) is copied over in order, since it's already sorted.`)
      j += 1
      k += 1
    }

    snapshot([lo, hi], [], `[${arr.slice(lo, hi).join(', ')}] is now sorted`, `The range from position ${lo} to ${hi - 1} is fully merged and sorted: [${arr.slice(lo, hi).join(', ')}].`)
  }

  mergeSort(0, n)

  steps.push({
    title: 'Array fully sorted',
    explanation: `After ${comparisons} comparisons across all merge steps, the array is sorted: [${arr.join(', ')}]. Every merge only ever compares the fronts of two already-sorted runs, which is what keeps Merge Sort's total work down to O(n log n).`,
    state: { array: [...arr], activeRange: null, compareIndices: [], comparisons, done: true },
  })

  return steps
}

export const mergeSortNotes = {
  what: 'Merge Sort is a divide-and-conquer sorting algorithm: it recursively splits the array in half until each piece is trivially sorted (one element), then merges sorted pieces back together in order.',
  why: 'Its recursive halving guarantees O(n log n) performance in every case — best, average, and worst — unlike simpler algorithms whose worst case degrades to O(n²). This predictability makes it valuable when consistent performance matters.',
  how: 'Recursively split the array into halves until each is a single element. Then merge pairs of sorted halves back together: repeatedly compare the front of each half and take the smaller one, until both halves are fully consumed.',
  observe: 'Watch the highlighted range shrink as the array splits deeper, then watch it grow back as sorted halves merge — the two-pointer comparison during each merge only ever needs to look at the very front of each half, never anywhere else.',
  outcome: 'The array ends up fully sorted, built from the bottom up by merging progressively larger sorted runs.',
  points: [
    'Merge Sort needs O(n) extra space for the temporary arrays used during merging — it does not sort in-place like Bubble/Selection/Insertion Sort.',
    'It is a stable sort: when values are equal, the merge step (taking from the left half on ties) preserves their original relative order.',
    'Its guaranteed O(n log n) worst case (unlike Quick Sort\'s O(n²) worst case) makes it attractive when predictable performance matters more than average-case speed.',
  ],
  complexity: 'O(n log n) time in every case (best, average, worst) — the array is always split into log n levels, and each level does O(n) total work merging. Space complexity is O(n) for the temporary arrays.',
  realWorld: 'Merge Sort (or a hybrid built on it) powers stable sorting in many languages\' standard libraries, and is the standard choice for external sorting — sorting data too large to fit in memory, merged from disk in chunks.',
}
