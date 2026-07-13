export function mergeSortTrace(inputArray) {
  const arr = [...inputArray]
  const steps = []

  steps.push({
    array: [...arr], range: null, comparing: [], placed: null,
    sortedIndices: [], description: "Starting array",
  })

  function mergeSort(start, end) {
    if (start >= end) return
    const mid = Math.floor((start + end) / 2)
    mergeSort(start, mid)
    mergeSort(mid + 1, end)
    merge(start, mid, end)
  }

  function merge(start, mid, end) {
    const left = arr.slice(start, mid + 1)
    const right = arr.slice(mid + 1, end + 1)

    steps.push({
      array: [...arr], range: [start, end], comparing: [], placed: null,
      sortedIndices: [], description: `Merging positions ${start} to ${end}`,
    })

    let i = 0, j = 0, k = start

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr], range: [start, end], comparing: [start + i, mid + 1 + j], placed: null,
        sortedIndices: [], description: `Comparing ${left[i]} and ${right[j]}`,
      })

      if (left[i] <= right[j]) {
        arr[k] = left[i]
        i++
      } else {
        arr[k] = right[j]
        j++
      }

      steps.push({
        array: [...arr], range: [start, end], comparing: [], placed: k,
        sortedIndices: [], description: `Placed ${arr[k]} at position ${k}`,
      })
      k++
    }

    while (i < left.length) {
      arr[k] = left[i]
      steps.push({
        array: [...arr], range: [start, end], comparing: [], placed: k,
        sortedIndices: [], description: `Placed remaining ${arr[k]} at position ${k}`,
      })
      i++; k++
    }

    while (j < right.length) {
      arr[k] = right[j]
      steps.push({
        array: [...arr], range: [start, end], comparing: [], placed: k,
        sortedIndices: [], description: `Placed remaining ${arr[k]} at position ${k}`,
      })
      j++; k++
    }
  }

  mergeSort(0, arr.length - 1)

  steps.push({
    array: [...arr], range: null, comparing: [], placed: null,
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    description: "Array sorted!",
  })

  return steps
}