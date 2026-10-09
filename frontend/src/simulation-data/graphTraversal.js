export const GRAPH_NODES = {
  A: { x: -140, y: -40, z: -40 },
  B: { x: -40, y: -100, z: 40 },
  C: { x: -40, y: 20, z: -60 },
  D: { x: 80, y: -80, z: 0 },
  E: { x: 80, y: 40, z: 60 },
  F: { x: 180, y: -20, z: -20 },
}

export const ADJACENCY = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D', 'E'],
  D: ['B', 'C', 'F'],
  E: ['C', 'F'],
  F: ['D', 'E'],
}

export const GRAPH_EDGES = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F'],
]

const START = 'A'

function snapshotState(mode, visited, frontier, current, order) {
  return { mode, visited: [...visited], frontier: [...frontier], current, order: [...order] }
}

export function buildGraphTraversalSteps() {
  const steps = []

  // ---- BFS ----
  {
    const visited = new Set([START])
    const queue = [START]
    const order = []
    steps.push({
      title: `BFS starting at ${START}`,
      explanation: `Breadth-First Search explores level by level, using a QUEUE. ${START} is marked visited and placed in the queue first.`,
      state: snapshotState('bfs', visited, queue, null, order),
    })

    while (queue.length > 0) {
      const node = queue.shift()
      order.push(node)
      steps.push({
        title: `Dequeue ${node}, visit it`,
        explanation: `${node} comes off the front of the queue and is processed — added to the visit order. Its neighbors are ${ADJACENCY[node].join(', ')}.`,
        state: snapshotState('bfs', visited, queue, node, order),
      })
      for (const neighbor of ADJACENCY[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          steps.push({
            title: `Discover ${neighbor} from ${node}, enqueue it`,
            explanation: `${neighbor} hasn't been visited yet, so it's marked visited immediately and added to the back of the queue — it will be explored once everything already in the queue is done.`,
            state: snapshotState('bfs', visited, queue, node, order),
          })
        }
      }
    }

    steps.push({
      title: `BFS complete: ${order.join(' → ')}`,
      explanation: `BFS visits nodes in order of distance from the start — everything one hop away (B, C) before anything two hops away (D, E), then three hops (F). This level-by-level order is exactly why BFS finds the shortest path (by hop count) in an unweighted graph.`,
      state: snapshotState('bfs', visited, [], null, order),
    })
  }

  // ---- DFS ----
  {
    const visited = new Set()
    const order = []
    const stack = [START]

    steps.push({
      title: `DFS starting at ${START}`,
      explanation: `Depth-First Search explores as far as possible along one path before backtracking, using a STACK. ${START} is pushed first.`,
      state: snapshotState('dfs', visited, stack, null, order),
    })

    while (stack.length > 0) {
      const node = stack[stack.length - 1]
      if (!visited.has(node)) {
        visited.add(node)
        order.push(node)
        steps.push({
          title: `Visit ${node}`,
          explanation: `${node} is now visited and added to the order. DFS will immediately dive into its first unvisited neighbor rather than exploring its other neighbors first.`,
          state: snapshotState('dfs', visited, stack, node, order),
        })
      }
      const nextNeighbor = ADJACENCY[node].find((nb) => !visited.has(nb))
      if (nextNeighbor) {
        stack.push(nextNeighbor)
        steps.push({
          title: `Push ${nextNeighbor} (unvisited neighbor of ${node})`,
          explanation: `${node} has an unvisited neighbor, ${nextNeighbor}. DFS goes deeper immediately, pushing it onto the stack, rather than checking ${node}'s other neighbors first.`,
          state: snapshotState('dfs', visited, stack, node, order),
        })
      } else {
        stack.pop()
        steps.push({
          title: `Backtrack from ${node}`,
          explanation: `${node} has no more unvisited neighbors, so DFS backtracks — popping it off the stack and returning attention to whichever node called into it.`,
          state: snapshotState('dfs', visited, stack, node, order),
        })
      }
    }

    steps.push({
      title: `DFS complete: ${order.join(' → ')}`,
      explanation: `DFS visited nodes in a completely different order than BFS did, even on the identical graph: it plunged deep down one path (A → B → D) before ever backtracking to explore C. Both orders are valid traversals — they just prioritize differently.`,
      state: snapshotState('dfs', visited, [], null, order),
    })
  }

  return steps
}

export const graphTraversalNotes = {
  what: 'Graph traversal means visiting every reachable node in a graph exactly once. BFS (Breadth-First Search) explores level by level using a queue; DFS (Depth-First Search) plunges as deep as possible before backtracking, using a stack.',
  why: 'Almost every graph problem — shortest paths, connectivity, cycle detection, finding connected components — starts with a systematic traversal. Which one you pick (BFS or DFS) depends on what you need: BFS for shortest hop-count paths, DFS for exploring full paths or detecting structure.',
  how: 'BFS: enqueue the start node; repeatedly dequeue a node, visit it, and enqueue any unvisited neighbors. DFS: push the start node; repeatedly look at the top of the stack, visit it if unvisited, then push its next unvisited neighbor (or pop/backtrack if none remain).',
  observe: 'Watch how BFS visits B and C (both one hop from A) before touching D or E — it fans out level by level — while DFS commits to a single path (A → B → D) as deep as it can go before ever backtracking to try C.',
  outcome: 'The exact same graph produces two different visit orders — A→B→C→D→E→F for BFS, versus A→B→D→C→E→F for DFS — depending purely on queue vs. stack discipline.',
  points: [
    'BFS guarantees the shortest path (by number of edges) from the start to any reached node in an unweighted graph — DFS gives no such guarantee.',
    'DFS is naturally expressed recursively (the call stack acts as the stack) — the iterative stack-based version shown here behaves identically.',
    'Both algorithms visit every reachable node exactly once and run in the same asymptotic time — the difference is purely the order, not the total work.',
  ],
  complexity: 'Both BFS and DFS run in O(V + E) time — every vertex and every edge is examined a constant number of times — and O(V) space for the visited set and queue/stack.',
  realWorld: 'BFS powers "shortest number of connections" features (like LinkedIn\'s degree-of-separation) and shortest-path routing in unweighted networks; DFS powers maze-solving, dependency resolution, and cycle detection in build systems.',
}
