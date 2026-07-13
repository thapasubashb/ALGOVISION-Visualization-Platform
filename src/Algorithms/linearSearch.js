export function linearSearchTrace(inputArray, target) {
  const arr = [...inputArray]
  const steps = []
  const checked = []

  steps.push({ array: [...arr], comparing: [], checked: [], found: null, description: `Searching for ${target}, one element at a time` })

  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], comparing: [i], checked: [...checked], found: null, description: `Checking index ${i}: is ${arr[i]} equal to ${target}?` })

    if (arr[i] === target) {
      steps.push({ array: [...arr], comparing: [], checked: [...checked], found: i, description: `Found ${target} at index ${i}!` })
      return steps
    }
    checked.push(i)
  }

  steps.push({ array: [...arr], comparing: [], checked: [...checked], found: null, description: `${target} was not found in the array` })
  return steps
}