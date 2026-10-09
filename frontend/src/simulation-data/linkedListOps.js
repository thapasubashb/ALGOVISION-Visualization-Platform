// Simulates a real singly linked list through a sequence of genuine
// operations: head insert, tail insert, positional insert, traversal
// (search), deletion, and a full reverse.

let idCounter = 0
function node(value) {
  idCounter += 1
  return { id: `n${idCounter}`, value }
}

export function buildLinkedListSteps() {
  const steps = []
  let list = []

  function snap(title, explanation, extra = {}) {
    steps.push({ title, explanation, state: { nodes: [...list], highlightIndex: -1, ...extra } })
  }

  snap('Empty list', 'A singly linked list is a chain of nodes, each holding a value and a pointer to the next node. HEAD points to the first node — right now, HEAD is null because the list is empty.')

  const n10 = node(10)
  list = [n10]
  snap('Insert 10 at the head', 'To insert at the head, create a new node, point its "next" to the current HEAD, then make HEAD point to the new node. Since the list was empty, 10 simply becomes the only node.', { highlightIndex: 0 })

  const n30 = node(30)
  list = [...list, n30]
  snap('Insert 30 at the tail', 'To insert at the tail, traverse to the last node (currently 10, since its "next" is null), then point its "next" to the new node 30.', { highlightIndex: 1 })

  const n40 = node(40)
  list = [...list, n40]
  snap('Insert 40 at the tail', 'Traverse to the new last node (30) and point its "next" to 40. The list is now 10 → 30 → 40.', { highlightIndex: 2 })

  const n20 = node(20)
  list = [list[0], n20, list[1], list[2]]
  snap('Insert 20 at position 1 (between 10 and 30)', 'A positional insert walks from HEAD to just before the target position, then rewires two pointers: the previous node\'s "next" now points to the new node, and the new node\'s "next" points to what used to come after it. The list is now 10 → 20 → 30 → 40.', { highlightIndex: 1 })

  for (let i = 0; i < list.length; i += 1) {
    const isMatch = list[i].value === 30
    snap(`Traverse: check node ${i} (value ${list[i].value})`, isMatch
      ? `Value 30 found at position ${i}! Traversal always starts at HEAD and follows "next" pointers one at a time — there's no way to jump directly to a position like with an array.`
      : `Value ${list[i].value} isn't the target (30), so follow this node's "next" pointer to keep going.`,
      { highlightIndex: i, found: isMatch })
    if (isMatch) break
  }

  const deleteIdx = list.findIndex((n) => n.value === 20)
  list = list.filter((_, i) => i !== deleteIdx)
  snap('Delete the node with value 20', 'Deleting a middle node means finding the node just before it, then pointing its "next" directly to the node after the one being removed — the deleted node is skipped over entirely and can be garbage collected. The list is now 10 → 30 → 40.', { highlightIndex: -1 })

  snap('Reverse the list — before', 'Reversing a singly linked list means walking through it once, flipping each node\'s "next" pointer to point backward instead of forward, and finally updating HEAD to what used to be the tail.')

  list = [...list].reverse()
  snap('Reverse the list — after', 'Every pointer now points the opposite direction: what was 10 → 30 → 40 is now 40 → 30 → 10. Notice this only took one pass through the list — no extra memory was needed, just pointer rewiring.', { done: true })

  return steps
}

export const linkedListNotes = {
  what: 'A singly linked list is a linear data structure made of nodes, where each node holds a value and a pointer to the next node in the sequence. HEAD points to the first node; the last node\'s pointer is null.',
  why: 'Unlike an array, a linked list doesn\'t need a contiguous block of memory and can grow or shrink without ever needing to be resized or copied — insertions and deletions at known positions are very cheap.',
  how: 'Insert at head: point the new node at the old HEAD, then make HEAD point to the new node. Insert at tail/position: traverse to the right spot and rewire two pointers. Delete: point the previous node\'s "next" past the node being removed. Reverse: walk through once, flipping every "next" pointer.',
  observe: 'Notice that finding a specific value always requires walking from HEAD one node at a time — there\'s no equivalent of jumping straight to "index 5" the way an array allows.',
  outcome: 'The list goes from empty, through several inserts, a successful search, a deletion, and finally a full reversal — ending as 40 → 30 → 10.',
  points: [
    'Random access (get the 5th element) is O(n) on a linked list, versus O(1) on an array — this is the core tradeoff.',
    'Insertion/deletion at a known position is O(1) once you\'re there (versus O(n) shifting on an array), but getting there still costs O(n) traversal.',
    'A doubly linked list adds a "previous" pointer to each node, allowing traversal in both directions at the cost of extra memory per node.',
  ],
  complexity: 'Traversal/search: O(n). Insert/delete at head: O(1). Insert/delete at a known position (with a reference to it): O(1), but O(n) to reach that position from HEAD. Reverse: O(n) time, O(1) extra space.',
  realWorld: 'Undo history in editors, the underlying structure of many LRU cache implementations, and browser back/forward navigation all commonly use linked-list-like structures.',
}
