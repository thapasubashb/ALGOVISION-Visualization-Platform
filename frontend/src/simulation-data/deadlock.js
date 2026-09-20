// Classic two-transaction, two-resource deadlock: T1 holds A wants B,
// T2 holds B wants A. Builds a wait-for graph, detects the cycle, and
// recovers by aborting one transaction.

export function buildDeadlockSteps() {
  const steps = []

  steps.push({
    title: 'Two transactions, two resources',
    explanation: 'T1 and T2 are both running. Resource A and Resource B are both currently free.',
    state: { holds: {}, waits: [], cycle: false, victim: null, phase: 'idle' },
  })

  steps.push({
    title: 'T1 locks Resource A',
    explanation: 'T1 requests and acquires a lock on Resource A. No conflict yet.',
    state: { holds: { A: 'T1' }, waits: [], cycle: false, victim: null, phase: 'lock' },
  })

  steps.push({
    title: 'T2 locks Resource B',
    explanation: 'T2 requests and acquires a lock on Resource B. Still no conflict — the two transactions hold different resources.',
    state: { holds: { A: 'T1', B: 'T2' }, waits: [], cycle: false, victim: null, phase: 'lock' },
  })

  steps.push({
    title: 'T1 requests Resource B — must wait',
    explanation: 'T1 now needs Resource B too, but T2 is holding it. T1 is blocked. The scheduler adds an edge to the wait-for graph: T1 → T2 ("T1 is waiting on T2").',
    state: { holds: { A: 'T1', B: 'T2' }, waits: [{ from: 'T1', to: 'T2' }], cycle: false, victim: null, phase: 'wait' },
  })

  steps.push({
    title: 'T2 requests Resource A — must wait',
    explanation: 'Symmetrically, T2 now needs Resource A, but T1 is holding it. Another wait-for edge is added: T2 → T1. Now the graph has T1 → T2 → T1.',
    state: { holds: { A: 'T1', B: 'T2' }, waits: [{ from: 'T1', to: 'T2' }, { from: 'T2', to: 'T1' }], cycle: false, victim: null, phase: 'wait' },
  })

  steps.push({
    title: 'Cycle detected: deadlock!',
    explanation: 'The wait-for graph now contains a cycle (T1 → T2 → T1). Neither transaction can ever proceed — T1 waits forever for a resource only T2 can release, and T2 waits forever for a resource only T1 can release. This is a deadlock.',
    state: { holds: { A: 'T1', B: 'T2' }, waits: [{ from: 'T1', to: 'T2' }, { from: 'T2', to: 'T1' }], cycle: true, victim: null, phase: 'detected' },
  })

  steps.push({
    title: 'Deadlock detection runs periodically',
    explanation: 'The database periodically scans the wait-for graph for cycles (this is how the cycle above actually got noticed). Once found, it must recover — deadlocks never resolve on their own.',
    state: { holds: { A: 'T1', B: 'T2' }, waits: [{ from: 'T1', to: 'T2' }, { from: 'T2', to: 'T1' }], cycle: true, victim: null, phase: 'scanning' },
  })

  steps.push({
    title: 'Recovery: choose a victim — abort T2',
    explanation: 'The database picks one transaction to sacrifice, using a policy such as "abort the one with the least work done" or "the one that started most recently." Here T2 is chosen as the victim and is rolled back, releasing everything it held.',
    state: { holds: { A: 'T1' }, waits: [{ from: 'T1', to: 'T2' }], cycle: false, victim: 'T2', phase: 'abort' },
  })

  steps.push({
    title: 'T1 acquires Resource B and proceeds',
    explanation: 'With T2 gone and Resource B free, T1\'s pending request is finally granted. T1 now holds both A and B and can finish its work and commit normally. The application retries T2 from scratch afterward.',
    state: { holds: { A: 'T1', B: 'T1' }, waits: [], cycle: false, victim: 'T2', phase: 'resolved' },
  })

  return steps
}

export const deadlockNotes = {
  what: 'A deadlock is a cycle of transactions each waiting for a resource held by the next one in the cycle, so none of them can ever proceed.',
  why: 'Locking (see Concurrency Control) prevents lost updates, but it introduces this new risk: if two transactions grab resources in opposite orders, they can each end up waiting on the other forever.',
  how: 'The database tracks a "wait-for graph" — a directed edge from transaction X to Y means X is blocked waiting for a resource Y holds. If that graph ever contains a cycle, a deadlock exists. Periodic detection scans for such cycles, and recovery aborts one transaction (the "victim") to break the cycle.',
  observe: 'Watch the exact moment the second wait-for edge appears — that\'s the instant the cycle forms and the deadlock becomes real, even though the detector doesn\'t notice until the next scan.',
  outcome: 'T2 is aborted and rolled back (releasing Resource B), which lets T1 finally acquire everything it needs and complete. T2 would typically be retried by the application afterward.',
  points: [
    'A deadlock can only be broken by aborting at least one participant — waiting longer never helps once a true cycle exists.',
    'Victim selection usually tries to minimize wasted work (e.g. abort the transaction that has done the least so far, or holds the fewest locks).',
    'A simple prevention strategy is to always acquire locks in a globally consistent order — if every transaction locks A before B, this particular deadlock shape becomes impossible.',
  ],
  complexity: 'Cycle detection in a wait-for graph with n transactions is O(n + e) using a standard graph traversal (e = number of wait edges) — cheap even though the consequence (aborting work) is costly.',
  realWorld: 'You\'ve likely seen "deadlock detected, transaction rolled back" errors from MySQL or PostgreSQL — this is the database automatically doing exactly the detection and recovery shown here.',
}
