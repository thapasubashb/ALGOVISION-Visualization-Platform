        let idCounter = 0
function nextId() { idCounter += 1; return `sq-${idCounter}` }

export function pushTrace(current, value) {
  const items = current.map((n) => ({ ...n }))
  const steps = []
  steps.push({ items: [...items], highlight: [], description: `Pushing ${value} onto the top of the stack` })
  const newNode = { id: nextId(), value }
  steps.push({ items: [...items, newNode], highlight: [newNode.id], description: `${value} is now on top` })
  return steps
}

export function popTrace(current) {
  const items = current.map((n) => ({ ...n }))
  const steps = []
  if (items.length === 0) {
    steps.push({ items: [], highlight: [], description: `Stack is empty — nothing to pop` })
    return steps
  }
  const top = items[items.length - 1]
  steps.push({ items: [...items], highlight: [top.id], description: `Removing ${top.value} from the top` })
  steps.push({ items: items.slice(0, -1), highlight: [], description: `${top.value} popped` })
  return steps
}

export function enqueueTrace(current, value) {
  const items = current.map((n) => ({ ...n }))
  const steps = []
  steps.push({ items: [...items], highlight: [], description: `Adding ${value} to the rear of the queue` })
  const newNode = { id: nextId(), value }
  steps.push({ items: [...items, newNode], highlight: [newNode.id], description: `${value} joins at the rear` })
  return steps
}

export function dequeueTrace(current) {
  const items = current.map((n) => ({ ...n }))
  const steps = []
  if (items.length === 0) {
    steps.push({ items: [], highlight: [], description: `Queue is empty — nothing to dequeue` })
    return steps
  }
  const front = items[0]
  steps.push({ items: [...items], highlight: [front.id], description: `Removing ${front.value} from the front` })
  steps.push({ items: items.slice(1), highlight: [], description: `${front.value} dequeued` })
  return steps
}