const INSERT_SEQUENCE = [50, 30, 70, 20, 40, 60, 80]
const SEARCH_TARGET = 60

let idCounter = 0
function makeNode(value) {
  idCounter += 1
  return { id: `b${idCounter}`, value, left: null, right: null }
}

function insertNode(root, value) {
  if (!root) return makeNode(value)
  if (value < root.value) root.left = insertNode(root.left, value)
  else root.right = insertNode(root.right, value)
  return root
}

// Assigns x by in-order index (guarantees no horizontal overlap) and
// y by depth, then flattens the tree into a positioned node list plus
// an edge list, for rendering.
function layoutTree(root) {
  const nodes = []
  const edges = []
  let counter = 0

  function inorder(node, depth) {
    if (!node) return
    inorder(node.left, depth + 1)
    const x = counter
    counter += 1
    nodes.push({ id: node.id, value: node.value, x, depth })
    inorder(node.right, depth + 1)
    if (node.left) edges.push({ from: node.id, to: node.left.id })
    if (node.right) edges.push({ from: node.id, to: node.right.id })
  }
  inorder(root, 0)

  const n = nodes.length
  const positioned = nodes.map((nd) => ({ ...nd, x: (nd.x - (n - 1) / 2) * 90, y: nd.depth * 90 }))
  const posMap = Object.fromEntries(positioned.map((p) => [p.id, p]))
  return { nodes: positioned, edges: edges.map((e) => ({ ...e, from: posMap[e.from], to: posMap[e.to] })) }
}

export function buildBstSteps() {
  const steps = []
  let root = null

  steps.push({
    title: 'Empty tree',
    explanation: 'A Binary Search Tree keeps every node ordered: everything in a node\'s left subtree is smaller, everything in its right subtree is larger. This ordering is what makes search fast.',
    state: { ...layoutTree(root), highlightId: null, path: [] },
  })

  for (const v of INSERT_SEQUENCE) {
    root = insertNode(root, v)
    const { nodes } = layoutTree(root)
    const newNode = nodes.find((n) => n.value === v)
    steps.push({
      title: `Insert ${v}`,
      explanation: `Starting at the root, ${v} is compared at each node: smaller goes left, larger goes right, until an empty spot is found. ${v} lands as a new leaf.`,
      state: { ...layoutTree(root), highlightId: newNode.id, path: [] },
    })
  }

  // Search for target
  {
    let node = root
    const path = []
    while (node) {
      path.push(node.id)
      if (SEARCH_TARGET === node.value) break
      node = SEARCH_TARGET < node.value ? node.left : node.right
    }
    const found = node && node.value === SEARCH_TARGET
    for (let i = 0; i < path.length; i += 1) {
      const layout = layoutTree(root)
      const isLast = i === path.length - 1
      steps.push({
        title: `Search for ${SEARCH_TARGET}: visit node ${layout.nodes.find((n) => n.id === path[i]).value}`,
        explanation: isLast && found
          ? `Match! ${SEARCH_TARGET} is found. Because the tree is ordered, the search never needed to look at more than ${path.length} node(s), even though the tree has ${INSERT_SEQUENCE.length} total.`
          : `${SEARCH_TARGET} ${SEARCH_TARGET < layout.nodes.find((n) => n.id === path[i]).value ? 'is smaller, so go left' : 'is larger, so go right'}.`,
        state: { ...layout, highlightId: path[i], path: path.slice(0, i + 1) },
      })
    }
  }

  steps.push({
    title: 'Search and insertion both took only a few comparisons',
    explanation: `Both inserting and searching in this tree only ever needed to follow one path from root to a leaf — never a full scan of all ${INSERT_SEQUENCE.length} values. That's the entire benefit of keeping the tree ordered.`,
    state: { ...layoutTree(root), highlightId: null, path: [], done: true },
  })

  return steps
}

export const bstNotes = {
  what: 'A Binary Search Tree (BST) is a tree where every node\'s left subtree contains only smaller values and its right subtree contains only larger values — recursively, at every level.',
  why: 'This ordering lets you search, insert, and delete in time proportional to the tree\'s height rather than its total size — dramatically faster than a linear scan once the tree has many nodes, as long as it stays reasonably balanced.',
  how: 'To insert a value, start at the root and repeatedly go left or right depending on whether the value is smaller or larger than the current node, until you reach an empty spot — that\'s where the new node goes. Searching follows the exact same path logic.',
  observe: 'Watch how both insertion and search only ever touch one path from the root down — never branching to check both sides — which is the direct payoff of the BST ordering property.',
  outcome: `The tree ends up holding all ${INSERT_SEQUENCE.length} inserted values in a shape determined entirely by insertion order, and a search for ${SEARCH_TARGET} succeeds in just a couple of comparisons.`,
  points: [
    'A BST\'s performance depends entirely on how balanced it is — inserting already-sorted data in order produces a "tree" that\'s really just a linked list, with O(n) operations.',
    'Self-balancing variants (AVL trees, Red-Black trees) automatically restructure themselves during insertion to guarantee O(log n) height no matter the insertion order.',
    'An in-order traversal of a BST always visits values in ascending sorted order — a useful, non-obvious property.',
  ],
  complexity: 'O(log n) average case for search/insert/delete in a balanced tree, but O(n) worst case for a completely unbalanced (linked-list-shaped) tree. Space complexity is O(n) for the tree itself.',
  realWorld: 'Balanced BST variants underpin many language standard libraries (e.g. C++\'s `std::map`/`std::set`, Java\'s `TreeMap`) for maintaining sorted, efficiently searchable collections.',
}
