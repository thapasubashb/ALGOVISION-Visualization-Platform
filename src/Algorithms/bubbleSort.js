export function bubbleSortTrace(inputArray) {
  const arr = [...inputArray]     // make a copy, don't touch the original
  const steps = []                // this will hold every "photo"
  const sortedIndices = []

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [],
    description: "Starting array",
  })

  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // photo: "I'm about to compare these two"
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sortedIndices: [...sortedIndices],
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]   // swap them

        // photo: "I just swapped these two"
        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sortedIndices: [...sortedIndices],
          description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
        })
      }
    }
    sortedIndices.push(n - 1 - i)
  }
  sortedIndices.push(0)

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...Array(n).keys()],
    description: "Array sorted!",
  })

  return steps
}