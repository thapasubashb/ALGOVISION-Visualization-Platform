export function binarySearchTrace(inputArray, target) {
  const arr = [...inputArray].sort((a, b) => a - b)
  const steps = []
  let low = 0
  let high = arr.length - 1

  steps.push({ array: [...arr], low, mid: null, high, found: null, description: `Array sorted first — binary search only works on sorted data` })

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    steps.push({ array: [...arr], low, mid, high, found: null, description: `Checking middle index ${mid}: is ${arr[mid]} equal to ${target}?` })

    if (arr[mid] === target) {
      steps.push({ array: [...arr], low, mid, high, found: mid, description: `Found ${target} at index ${mid}!` })
      return steps
    } else if (arr[mid] < target) {
      low = mid + 1
      steps.push({ array: [...arr], low, mid: null, high, found: null, description: `${arr[mid]} is smaller than ${target} — searching the right half` })
    } else {
      high = mid - 1
      steps.push({ array: [...arr], low, mid: null, high, found: null, description: `${arr[mid]} is bigger than ${target} — searching the left half` })
    }
  }

  steps.push({ array: [...arr], low, mid: null, high, found: null, description: `${target} was not found in the array` })
  return steps
}