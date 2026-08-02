export function insertionSortTrace(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length

  steps.push({
    array: [...arr], comparing: [], keyIndex: null,
    sortedIndices: [0], description: "First element is trivially sorted on its own",
  })

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1
    const sortedSoFar = Array.from({ length: i }, (_, k) => k)

    steps.push({
      array: [...arr], comparing: [], keyIndex: i,
      sortedIndices: sortedSoFar, description: `Picking up ${key} to insert into the sorted part`,
    })

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr], comparing: [j, j + 1], keyIndex: j,
        sortedIndices: sortedSoFar, description: `${arr[j]} is bigger than ${key} — shifting it right`,
      })
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key

    steps.push({
      array: [...arr], comparing: [], keyIndex: null,
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      description: `Placed ${key} in its correct spot`,
    })
  }

  steps.push({
    array: [...arr], comparing: [], keyIndex: null,
    sortedIndices: Array.from({ length: n }, (_, k) => k), description: "Array sorted!",
  })

  return steps
}