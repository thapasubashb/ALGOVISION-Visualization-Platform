let idCounter = 0
function nextId() { idCounter += 1; return `node-${idCounter}` }

export function insertAtHeadTrace(currentList, value) {
  const list = currentList.map((n) => ({ ...n }))
  const steps = []
  steps.push({ list: [...list], pointer: null, highlight: [], description: `Creating a new node with value ${value}` })
  const newNode = { id: nextId(), value }
  const newList = [newNode, ...list]
  steps.push({ list: newList, pointer: newNode.id, highlight: [newNode.id], description: `New node points to the old head — it's now the new head` })
  return steps
}

export function insertAtTailTrace(currentList, value) {
  const list = currentList.map((n) => ({ ...n }))
  const steps = []
  steps.push({ list: [...list], pointer: list.length ? list[list.length - 1].id : null, highlight: [], description: list.length ? `Traversing to the last node` : `List is empty — new node becomes the head` })
  const newNode = { id: nextId(), value }
  const newList = [...list, newNode]
  steps.push({ list: newList, pointer: newNode.id, highlight: [newNode.id], description: `New node added at the tail, pointing to null` })
  return steps
}

export function deleteByValueTrace(currentList, value) {
  const list = currentList.map((n) => ({ ...n }))
  const steps = []
  let found = false

  for (let i = 0; i < list.length; i++) {
    steps.push({ list: [...list], pointer: list[i].id, highlight: [], description: `Checking node with value ${list[i].value}` })
    if (list[i].value === value) {
      found = true
      steps.push({ list: [...list], pointer: list[i].id, highlight: [list[i].id], description: `Found ${value} — unlinking this node` })
      const newList = list.filter((n) => n.id !== list[i].id)
      steps.push({ list: newList, pointer: null, highlight: [], description: `Node removed — previous node now points to what came after it` })
      break
    }
  }

  if (!found) {
    steps.push({ list: [...list], pointer: null, highlight: [], description: `${value} was not found in the list` })
  }
  return steps
}

export function traverseTrace(currentList) {
  const list = currentList.map((n) => ({ ...n }))
  const steps = []
  steps.push({ list: [...list], pointer: null, highlight: [], description: `Starting from the head` })
  list.forEach((node) => {
    steps.push({ list: [...list], pointer: node.id, highlight: [], description: `Visiting node with value ${node.value}` })
  })
  steps.push({ list: [...list], pointer: null, highlight: [], description: `Reached the end — next is null` })
  return steps
}

export function reverseTrace(currentList) {
  const list = currentList.map((n) => ({ ...n }))
  const steps = []
  let remaining = [...list]
  let reversedSoFar = []

  steps.push({ list: [...remaining], pointer: remaining[0]?.id ?? null, highlight: [], description: `Starting reversal from the head` })

  while (remaining.length > 0) {
    const node = remaining.shift()
    reversedSoFar = [node, ...reversedSoFar]
    steps.push({
      list: [...reversedSoFar, ...remaining],
      pointer: node.id,
      highlight: [node.id],
      description: `Flipping node ${node.value}'s pointer — it now points backward`,
    })
  }

  steps.push({ list: [...reversedSoFar], pointer: null, highlight: [], description: `List fully reversed` })
  return steps
}