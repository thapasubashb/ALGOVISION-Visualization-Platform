// Simulates a fund transfer transaction (commit path) followed by a
// second transaction that fails and rolls back, to show all four ACID
// properties in one continuous example.

export function buildTransactionsSteps() {
  const steps = []
  const committed = { A: 1000, B: 500 }

  steps.push({
    title: 'Initial committed state',
    explanation:
      'Account A has 1000, Account B has 500. This is the durable, committed state — the last state everyone agrees is real. Any transaction starts from here.',
    state: { committed: { ...committed }, pending: null, phase: 'idle', txLabel: null, badge: null },
  })

  steps.push({
    title: 'T1: BEGIN — transfer 200 from A to B',
    explanation:
      'A new transaction starts. Until it COMMITs, none of its changes are visible to anyone else, and if anything goes wrong, all of them can be undone as a single unit — that\'s Atomicity.',
    state: { committed: { ...committed }, pending: { A: committed.A, B: committed.B }, phase: 'begin', txLabel: 'T1', badge: 'info' },
  })

  steps.push({
    title: 'T1: READ A (1000)',
    explanation: 'The transaction reads the current value of A into its own working copy before modifying it.',
    state: { committed: { ...committed }, pending: { A: committed.A, B: committed.B }, phase: 'read-a', txLabel: 'T1', badge: 'info' },
  })

  steps.push({
    title: 'T1: WRITE A = A − 200 = 800 (uncommitted)',
    explanation:
      'A is decreased by 200. This change exists only inside T1\'s pending workspace — the committed value everyone else sees is still 1000. This isolation is what lets other transactions keep running safely while T1 is mid-flight.',
    state: { committed: { ...committed }, pending: { A: 800, B: committed.B }, phase: 'write-a', txLabel: 'T1', badge: 'info' },
  })

  steps.push({
    title: 'T1: READ B (500), WRITE B = B + 200 = 700 (uncommitted)',
    explanation:
      'Symmetrically, B is increased by 200 in the pending workspace. Notice: right now, 200 has technically "left" A but hasn\'t "arrived" at B in the committed state — if we stopped here, money would simply vanish. That\'s exactly why a transaction must finish as one atomic unit.',
    state: { committed: { ...committed }, pending: { A: 800, B: 700 }, phase: 'write-b', txLabel: 'T1', badge: 'info' },
  })

  steps.push({
    title: 'T1: COMMIT',
    explanation:
      'Both changes are made permanent together, atomically. The total (A + B = 1500) is preserved before and after — that\'s Consistency. Once committed, the new values survive even a crash immediately afterward — that\'s Durability.',
    state: { committed: { A: 800, B: 700 }, pending: null, phase: 'committed', txLabel: 'T1', badge: 'success' },
  })

  const afterT1 = { A: 800, B: 700 }

  steps.push({
    title: 'T2: BEGIN — transfer 300 more from A to B',
    explanation: 'A second, independent transaction begins from the new committed state (A=800, B=700).',
    state: { committed: { ...afterT1 }, pending: { A: afterT1.A, B: afterT1.B }, phase: 'begin', txLabel: 'T2', badge: 'info' },
  })

  steps.push({
    title: 'T2: WRITE A = A − 300 = 500 (uncommitted)',
    explanation: 'T2 stages the withdrawal from A in its own pending workspace, same as T1 did.',
    state: { committed: { ...afterT1 }, pending: { A: 500, B: afterT1.B }, phase: 'write-a', txLabel: 'T2', badge: 'info' },
  })

  steps.push({
    title: 'T2: a constraint check fails before WRITE B can run',
    explanation:
      'Suppose applying the credit to B would violate a business rule (say, a fraud check). T2 cannot safely continue — but it has already staged a change to A.',
    state: { committed: { ...afterT1 }, pending: { A: 500, B: afterT1.B }, phase: 'error', txLabel: 'T2', badge: 'danger' },
  })

  steps.push({
    title: 'T2: ROLLBACK',
    explanation:
      'The entire transaction is undone. A reverts to 800 exactly as it was before T2 began — not left at the half-finished value of 500. This is Atomicity protecting the data: a transaction either fully happens or leaves no trace at all.',
    state: { committed: { ...afterT1 }, pending: null, phase: 'rolledback', txLabel: 'T2', badge: 'danger' },
  })

  return steps
}

export const transactionsNotes = {
  what: 'A transaction is a group of one or more database operations that must all succeed together or all fail together — there\'s no partial outcome. ACID (Atomicity, Consistency, Isolation, Durability) names the four guarantees a proper transaction provides.',
  why: "Real operations often need multiple writes to stay correct — like moving money, which requires both a debit and a credit. If only one side of that happened, data would become permanently wrong (money created or destroyed). Transactions prevent that.",
  how: 'Changes are staged in a private workspace during BEGIN/READ/WRITE, invisible to everyone else. COMMIT makes them all permanent at once; ROLLBACK discards them all, leaving the database exactly as it was before the transaction started.',
  observe: 'Watch how the "committed" values never change until COMMIT happens, and how ROLLBACK snaps the pending value back to the last committed value rather than leaving it half-applied.',
  outcome: 'T1 successfully transfers 200 (A=800, B=700, permanently). T2 attempts to transfer 300 but fails partway and rolls back completely — the final state is unaffected by T2\'s aborted attempt.',
  points: [
    'Atomicity: all-or-nothing — T2\'s partial withdrawal from A was fully undone, not left in place.',
    'Consistency: the total (A+B) is preserved by every committed transaction — value is neither created nor destroyed.',
    'Isolation: while T1 was mid-transaction, nobody else could see its uncommitted 800/700 values.',
    'Durability: once T1 committed, its result survives — it doesn\'t depend on the transaction still being "in progress".',
  ],
  complexity: 'Not an algorithmic complexity in the Big-O sense — the cost of ACID guarantees is typically paid in locking/logging overhead, which is why transactions should be kept as short as reasonably possible.',
  realWorld: 'Bank transfers, e-commerce checkouts (deduct stock + charge card + create order), and airline seat booking all rely on transactions to avoid the exact "money disappears" or "double-booked seat" bugs this simulation illustrates.',
}
