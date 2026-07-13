export function quickSortTrace(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const sortedIndices = new Set()

  steps.push({
    array: [...arr], range: null, pivotIndex: null, comparing: [], swapped: [],
    sortedIndices: [], description: "Starting array",
  })

  function partition(low, high) {
    const pivot = arr[high]

    steps.push({
      array: [...arr], range: [low, high], pivotIndex: high, comparing: [], swapped: [],
      sortedIndices: [...sortedIndices], description: `Choosing ${pivot} as the pivot`,
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr], range: [low, high], pivotIndex: high, comparing: [j, high], swapped: [],
        sortedIndices: [...sortedIndices], description: `Comparing ${arr[j]} with pivot ${pivot}`,
      })

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push({
            array: [...arr], range: [low, high], pivotIndex: high, comparing: [], swapped: [i, j],
            sortedIndices: [...sortedIndices], description: `${arr[i]} is smaller than pivot — moving it left`,
          })
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    sortedIndices.add(i + 1)

    steps.push({
      array: [...arr], range: [low, high], pivotIndex: null, comparing: [], swapped: [i + 1, high],
      sortedIndices: [...sortedIndices], description: `Pivot ${arr[i + 1]} is now in its final position`,
    })

    return i + 1
  }

  function quickSort(low, high) {
    if (low > high) return
    if (low === high) {
      sortedIndices.add(low)
      steps.push({
        array: [...arr], range: null, pivotIndex: null, comparing: [], swapped: [],
        sortedIndices: [...sortedIndices], description: `Single element — already in place`,
      })
      return
    }
    const pivotIndex = partition(low, high)
    quickSort(low, pivotIndex - 1)
    quickSort(pivotIndex + 1, high)
  }

  quickSort(0, arr.length - 1)

  steps.push({
    array: [...arr], range: null, pivotIndex: null, comparing: [], swapped: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    description: "Array sorted!",
  })

  return steps
}