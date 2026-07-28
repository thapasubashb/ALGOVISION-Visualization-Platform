export const NODE_IDS = ['A', 'B', 'C', 'D', 'E', 'F']

export const adjacency = {
  A: ['B', 'F', 'D'],
  B: ['A', 'C', 'E'],
  C: ['B', 'D'],
  D: ['C', 'E', 'A'],
  E: ['D', 'F', 'B'],
  F: ['E', 'A'],
}

export function bfsTrace(start) {
  const steps = []
  const visited = new Set([start])
  const queue = [start]

  steps.push({ visited: [...visited], pending: [...queue], current: null, description: `Starting BFS from ${start} — adding it to the queue` })

  while (queue.length > 0) {
    const node = queue.shift()
    steps.push({ visited: [...visited], pending: [...queue], current: node, description: `Visiting ${node}` })

    for (const neighbor of adjacency[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({ visited: [...visited], pending: [...queue], current: node, description: `${neighbor} is unvisited — adding to the back of the queue` })
      }
    }
  }

  
  
  steps.push({ visited: [...visited], pending: [], current: null, description: `DFS complete: ${[...visited].join(' → ')}` })
  return steps
}