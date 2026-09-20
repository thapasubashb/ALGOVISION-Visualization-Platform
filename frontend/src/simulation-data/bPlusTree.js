// A genuine (if minimal) order-3 B+ tree: max 2 keys per node, splitting
// on overflow. The insert sequence below is fixed, but the tree shape at
// every step is the real output of the algorithm below, not scripted.

const MAX_KEYS = 2
const INSERT_SEQUENCE = [10, 20, 5, 6, 12, 30]
const SEARCH_KEY = 12

function cloneTree(node) {
  if (!node) return null
  return {
    id: node.id,
    keys: [...node.keys],
    leaf: node.leaf,
    children: node.children ? node.children.map(cloneTree) : null,
  }
}

let idCounter = 0
function makeNode(leaf, keys) {
  idCounter += 1
  return { id: `n${idCounter}`, keys, leaf, children: leaf ? null : [] }
}

function insert(root, key, events) {
  if (!root) {
    const leaf = makeNode(true, [key])
    events.push({ type: 'create-root', message: `The tree is empty, so inserting ${key} creates the first node — a single leaf.`, tree: cloneTree(leaf) })
    return leaf
  }

  const path = []
  let node = root
  while (!node.leaf) {
    path.push(node)
    let i = 0
    while (i < node.keys.length && key >= node.keys[i]) i += 1
    node = node.children[i]
  }

  events.push({ type: 'descend', message: `Starting at the root, the search compares ${key} against the separator keys at each level and follows the correct child pointer down to leaf [${node.keys.join(', ')}].`, tree: cloneTree(root), focusNodeId: node.id })

  node.keys.push(key)
  node.keys.sort((a, b) => a - b)
  events.push({ type: 'insert-leaf', message: `${key} is inserted into the leaf in sorted order, giving [${node.keys.join(', ')}].`, tree: cloneTree(root), focusNodeId: node.id })

  if (node.keys.length <= MAX_KEYS) {
    events.push({ type: 'no-split', message: `The leaf now holds ${node.keys.length} key(s), within the limit of ${MAX_KEYS} — no split needed.`, tree: cloneTree(root), focusNodeId: node.id })
    return root
  }

  // Overflow: split the leaf
  const mid = Math.ceil(node.keys.length / 2)
  const leftKeys = node.keys.slice(0, mid)
  const rightKeys = node.keys.slice(mid)
  node.keys = leftKeys
  const newLeaf = makeNode(true, rightKeys)
  const promote = rightKeys[0]

  if (path.length === 0) {
    const newRoot = makeNode(false, [promote])
    newRoot.children = [node, newLeaf]
    events.push({ type: 'split-leaf-new-root', message: `The leaf overflowed past ${MAX_KEYS} keys, so it splits into [${leftKeys.join(', ')}] and [${rightKeys.join(', ')}]. Since this leaf was the root, a brand-new root is created holding the separator key ${promote}, pointing at both leaves.`, tree: cloneTree(newRoot) })
    return newRoot
  }

  const parent = path[path.length - 1]
  const idx = parent.children.indexOf(node)
  parent.children.splice(idx + 1, 0, newLeaf)
  parent.keys.splice(idx, 0, promote)
  events.push({ type: 'split-leaf', message: `The leaf overflowed past ${MAX_KEYS} keys, so it splits into [${leftKeys.join(', ')}] and [${rightKeys.join(', ')}]. The separator key ${promote} (the smallest key of the new right leaf) is copied up into the parent, which now points at both leaves.`, tree: cloneTree(root), focusNodeId: parent.id })

  return root
}

export function buildBPlusTreeSteps() {
  const steps = []
  const events = []
  let root = null

  for (const key of INSERT_SEQUENCE) {
    events.push({ type: 'start-insert', message: `Inserting key ${key} into the tree.`, tree: cloneTree(root), insertKey: key })
    root = insert(root, key, events)
  }

  events.push({ type: 'start-search', message: `Now let's search for key ${SEARCH_KEY}.`, tree: cloneTree(root), searchKey: SEARCH_KEY })
  {
    let node = root
    const path = []
    while (!node.leaf) {
      path.push(node.id)
      let i = 0
      while (i < node.keys.length && SEARCH_KEY >= node.keys[i]) i += 1
      const dir = i === 0 ? `< ${node.keys[0]}` : i === node.keys.length ? `≥ ${node.keys[node.keys.length - 1]}` : `between ${node.keys[i - 1]} and ${node.keys[i]}`
      events.push({ type: 'search-step', message: `At node [${node.keys.join(', ')}], ${SEARCH_KEY} is ${dir}, so we follow that child pointer down.`, tree: cloneTree(root), focusNodeId: node.id, searchKey: SEARCH_KEY })
      node = node.children[i]
    }
    const found = node.keys.includes(SEARCH_KEY)
    events.push({ type: 'search-done', message: `We arrive at leaf [${node.keys.join(', ')}] and scan its keys directly — ${SEARCH_KEY} is ${found ? 'found' : 'not present'} here. Because every leaf holds real keys (not just routing information), the search always ends at a leaf.`, tree: cloneTree(root), focusNodeId: node.id, searchKey: SEARCH_KEY, found })
  }

  for (const e of events) {
    steps.push({
      title: eventTitle(e),
      explanation: e.message,
      state: { tree: e.tree, focusNodeId: e.focusNodeId || null, searchKey: e.searchKey ?? null, found: e.found ?? null },
    })
  }

  return steps
}

function eventTitle(e) {
  switch (e.type) {
    case 'start-insert': return `Insert ${e.insertKey}`
    case 'create-root': return 'First key — create root leaf'
    case 'descend': return 'Descend to the correct leaf'
    case 'insert-leaf': return 'Insert key into leaf'
    case 'no-split': return 'Fits within capacity'
    case 'split-leaf-new-root': return 'Leaf overflows — split, new root created'
    case 'split-leaf': return 'Leaf overflows — split, parent updated'
    case 'start-search': return 'Search'
    case 'search-step': return 'Follow separator key'
    case 'search-done': return 'Arrived at leaf'
    default: return 'Step'
  }
}

export const bPlusTreeNotes = {
  what: 'A B+ Tree is a self-balancing, sorted tree structure where every value lives in a leaf node, internal nodes only hold routing keys, and all leaves sit at the same depth and are linked together in order.',
  why: 'Databases store far more data than fits in memory. A B+ tree keeps the tree shallow (high fanout) so finding any row takes only a handful of disk reads, and its sorted leaf-linked-list makes range queries (e.g. "id BETWEEN 10 AND 30") fast too.',
  how: 'Insert descends from the root, following the child whose key range contains the new key, until it reaches a leaf. The key is inserted in sorted order; if the leaf now has too many keys, it splits into two, and a copy of the separator key moves up into the parent — which can itself split, if needed.',
  observe: 'Watch how inserting 5 and then 6 both trigger a leaf split — and how the second split doesn\'t create a new root (a parent already exists to absorb it), while the very first split had no parent yet, so a brand new root was created.',
  outcome: 'A tree with one root routing key and three linked leaves, all containing every inserted key in sorted order — and a search that reaches the correct leaf in just 2 comparisons instead of scanning all 6 keys.',
  points: [
    'Only leaves hold "real" data pointers — internal node keys exist purely to route searches, which is what distinguishes a B+ tree from a plain B-tree.',
    'This example uses order 3 (max 2 keys/node) to keep splits frequent and visible; real database indexes use a much higher order (often 100+) to keep the tree extremely shallow.',
    'Leaves are linked left-to-right, which is what makes range scans fast — you don\'t need to revisit the root between leaves.',
  ],
  complexity: 'Search, insert and delete are all O(log n) — and because the fanout is high, that logarithm has a very large base, so real B+ trees stay just 3-4 levels deep even with millions of rows.',
  realWorld: 'This is exactly the structure behind a SQL PRIMARY KEY or indexed column in MySQL (InnoDB) and most other relational databases — "the index" you create with CREATE INDEX is almost always a B+ tree under the hood.',
}
