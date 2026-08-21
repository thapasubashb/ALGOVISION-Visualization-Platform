export function selectionSortTrace(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const sortedIndices = []
  const n = arr.length

  steps.push({
    array: [...arr], comparing: [], minIndex: null, swapped: [],
    sortedIndices: [], description: "Starting array",
  })

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    steps.push({
      array: [...arr], comparing: [], minIndex, swapped: [],
      sortedIndices: [...sortedIndices],
      description: `Assuming ${arr[i]} is the smallest so far`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr], comparing: [j, minIndex], minIndex, swapped: [],
        sortedIndices: [...sortedIndices],
        description: `Comparing ${arr[j]} with current smallest ${arr[minIndex]}`,
      })

      if (arr[j] < arr[minIndex]) {
        minIndex = j
        steps.push({
          array: [...arr], comparing: [], minIndex, swapped: [],
          sortedIndices: [...sortedIndices],
          description: `${arr[j]} is smaller — new smallest found`,
        })
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      steps.push({
        array: [...arr], comparing: [], minIndex: null, swapped: [i, minIndex],
        sortedIndices: [...sortedIndices],
        description: `Swapped ${arr[minIndex]} and ${arr[i]}`,
      })
    }
    sortedIndices.push(i)
  }
  sortedIndices.push(n - 1)

  steps.push({
    array: [...arr], comparing: [], minIndex: null, swapped: [],
    sortedIndices: [...Array(n).keys()], description: "Array sorted!",
  })

  return steps
}