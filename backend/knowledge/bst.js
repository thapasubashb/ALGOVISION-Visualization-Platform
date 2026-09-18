let idCounter = 0
function nextId() { idCounter += 1; return `bst-${idCounter}` }

function cloneNodes(nodes) {
  const copy = {}
  Object.keys(nodes).forEach((id) => { copy[id] = { ...nodes[id] } })
  return copy
}

export function insertTrace(currentNodes, currentRootId, value) {
  const nodes = cloneNodes(currentNodes)
  let rootId = currentRootId
  const steps = []

  steps.push({ nodes: cloneNodes(nodes), rootId, current: null, highlight: [], visited: [], description: `Inserting ${value}` })

  if (rootId === null) {
    const newNode = { id: nextId(), value, left: null, right: null }
    nodes[newNode.id] = newNode
    rootId = newNode.id
    steps.push({ nodes: cloneNodes(nodes), rootId, current: newNode.id, highlight: [newNode.id], visited: [], description: `Tree was empty — ${value} becomes the root` })
    return { steps, nodes, rootId }
  }

  let currentId = rootId
  while (true) {
    const node = nodes[currentId]
    steps.push({ nodes: cloneNodes(nodes), rootId, current: currentId, highlight: [], visited: [], description: `Comparing ${value} with ${node.value}` })

    if (value < node.value) {
      if (node.left === null) {
        const newNode = { id: nextId(), value, left: null, right: null }
        nodes[newNode.id] = newNode
        node.left = newNode.id
        steps.push({ nodes: cloneNodes(nodes), rootId, current: newNode.id, highlight: [newNode.id], visited: [], description: `${value} is smaller — placed as left child of ${node.value}` })
        break
      }
      currentId = node.left
    } else if (value > node.value) {
      if (node.right === null) {
        const newNode = { id: nextId(), value, left: null, right: null }
        nodes[newNode.id] = newNode
        node.right = newNode.id
        steps.push({ nodes: cloneNodes(nodes), rootId, current: newNode.id, highlight: [newNode.id], visited: [], description: `${value} is bigger — placed as right child of ${node.value}` })
        break
      }
      currentId = node.right
    } else {
      steps.push({ nodes: cloneNodes(nodes), rootId, current: currentId, highlight: [], visited: [], description: `${value} already exists — no duplicates allowed` })
      break
    }
  }

  return { steps, nodes, rootId }
}

export function searchTrace(currentNodes, rootId, value) {
  const nodes = cloneNodes(currentNodes)
  const steps = []
  steps.push({ nodes: cloneNodes(nodes), rootId, current: null, highlight: [], visited: [], description: `Searching for ${value}` })

  let currentId = rootId
  while (currentId !== null) {
    const node = nodes[currentId]
    steps.push({ nodes: cloneNodes(nodes), rootId, current: currentId, highlight: [], visited: [], description: `Checking ${node.value}` })

    if (value === node.value) {
      steps.push({ nodes: cloneNodes(nodes), rootId, current: currentId, highlight: [currentId], visited: [], description: `Found ${value}!` })
      return { steps, nodes, rootId }
    }
    currentId = value < node.value ? node.left : node.right
  }

  steps.push({ nodes: cloneNodes(nodes), rootId, current: null, highlight: [], visited: [], description: `${value} was not found in the tree` })
  return { steps, nodes, rootId }
}

export function traversalTrace(currentNodes, rootId, order) {
  const nodes = cloneNodes(currentNodes)
  const steps = []
  const visited = []

  steps.push({ nodes: cloneNodes(nodes), rootId, current: null, highlight: [], visited: [], description: `Starting ${order} traversal` })

  function visit(id) {
    if (id === null) return
    const node = nodes[id]

    if (order === 'preorder') {
      visited.push(id)
      steps.push({ nodes: cloneNodes(nodes), rootId, current: id, highlight: [...visited], visited: [...visited], description: `Visiting ${node.value}` })
    }

    visit(node.left)

    if (order === 'inorder') {
      visited.push(id)
      steps.push({ nodes: cloneNodes(nodes), rootId, current: id, highlight: [...visited], visited: [...visited], description: `Visiting ${node.value}` })
    }

    visit(node.right)

    if (order === 'postorder') {
      visited.push(id)
      steps.push({ nodes: cloneNodes(nodes), rootId, current: id, highlight: [...visited], visited: [...visited], description: `Visiting ${node.value}` })
    }
  }

  visit(rootId)

  const orderedValues = visited.map((id) => nodes[id].value).join(' → ')
  steps.push({ nodes: cloneNodes(nodes), rootId, current: null, highlight: [...visited], visited: [...visited], description: `Traversal complete: ${orderedValues}` })
  return { steps, nodes, rootId }
}

export function computeLayout(nodes, rootId) {
  const positions = {}
  let counter = 0

  function assign(id, depth) {
    if (id === null) return
    const node = nodes[id]
    assign(node.left, depth + 1)
    positions[id] = { x: counter, y: depth }
    counter += 1
    assign(node.right, depth + 1)
  }

  assign(rootId, 0)
  return positions
}