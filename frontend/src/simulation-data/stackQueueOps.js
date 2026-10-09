let idCounter = 0
function item(value) {
  idCounter += 1
  return { id: `i${idCounter}`, value }
}

export function buildStackQueueSteps() {
  const steps = []
  let stack = []

  function snapStack(title, explanation, extra = {}) {
    steps.push({ title, explanation, state: { mode: 'stack', items: [...stack], queueItems: [], highlight: -1, ...extra } })
  }

  snapStack('Stack — empty', 'A stack is LIFO: Last In, First Out. Only the "top" of the stack can be pushed to or popped from — think of a stack of plates.')

  for (const v of [5, 8, 3]) {
    stack = [...stack, item(v)]
    snapStack(`push(${v})`, `${v} is placed on top of the stack, becoming the new top. The previous top (${stack.length > 1 ? stack[stack.length - 2].value : 'none'}) is now buried beneath it.`, { highlight: stack.length - 1 })
  }

  const poppedVal = stack[stack.length - 1].value
  stack = stack.slice(0, -1)
  snapStack(`pop() → ${poppedVal}`, `pop() removes and returns the top of the stack, which was ${poppedVal}. The stack shrinks by one, and whatever was directly beneath it becomes the new top.`)

  stack = [...stack, item(12)]
  snapStack('push(12)', '12 is placed on top. Notice the stack only ever grows and shrinks from one end — that single-ended access is exactly what makes it LIFO.', { highlight: stack.length - 1 })

  let queue = []
  function snapQueue(title, explanation, extra = {}) {
    steps.push({ title, explanation, state: { mode: 'queue', items: [], queueItems: [...queue], highlight: -1, ...extra } })
  }

  snapQueue('Queue — empty', 'A queue is FIFO: First In, First Out. New items join the "back," and only the item at the "front" can be removed — think of a line at a checkout counter.')

  for (const v of ['A', 'B', 'C']) {
    queue = [...queue, item(v)]
    snapQueue(`enqueue(${v})`, `${v} joins the back of the queue. Whatever was already waiting stays ahead of it — arrival order is preserved.`, { highlight: queue.length - 1 })
  }

  const dequeuedVal = queue[0].value
  queue = queue.slice(1)
  snapQueue(`dequeue() → ${dequeuedVal}`, `dequeue() removes and returns the item at the front, ${dequeuedVal} — the item that's been waiting the longest. Everyone else shifts up one position toward the front.`)

  queue = [...queue, item('D')]
  snapQueue('enqueue(D)', 'D joins the back of the queue. Notice items are added at one end (the back) and removed from the other (the front) — that two-ended access is exactly what makes it FIFO, unlike a stack.', { highlight: queue.length - 1, done: true })

  return steps
}

export const stackQueueNotes = {
  what: 'A stack is a LIFO (Last In, First Out) structure — push and pop both happen at the same end, the "top". A queue is FIFO (First In, First Out) — items enqueue at the "back" and dequeue from the "front".',
  why: 'These two access patterns show up constantly in real problems: a stack naturally models "undo" history or nested function calls (most recent thing gets handled first); a queue naturally models anything processed in arrival order, like a print queue or task scheduler.',
  how: 'A stack supports push (add to top) and pop (remove from top) — both O(1), both at the same end. A queue supports enqueue (add to back) and dequeue (remove from front) — both O(1), but at opposite ends of the structure.',
  observe: 'Compare which end each structure grows and shrinks from — the stack always changes at its single "top," while the queue changes at two different ends depending on the operation.',
  outcome: 'The stack ends with [12, 5] from top to bottom (8 and one push/pop cycle netted out), while the queue ends with [C, D] from front to back — B and A having already been served.',
  points: [
    'Function call stacks in every programming language are literally stacks — the most recently called function is the first to return (LIFO).',
    'A queue implemented naively with an array (shifting everyone on dequeue) is O(n) per dequeue — real implementations use a circular buffer or linked list to keep it O(1).',
    'A "deque" (double-ended queue) generalizes both, allowing push/pop from either end.',
  ],
  complexity: 'Push/pop on a stack: O(1). Enqueue/dequeue on a properly implemented queue: O(1). Both need O(1) extra space per operation.',
  realWorld: 'Browser back-button history and undo/redo in editors are stacks. Print spoolers, task schedulers, and breadth-first search (see the Graph Traversal topic) all rely on queues.',
}
