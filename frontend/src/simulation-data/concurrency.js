// Two transactions competing for the same row, demonstrating locking:
// T1 acquires the lock first, T2 must wait, T1 commits and releases,
// then T2 proceeds.

export function buildConcurrencySteps() {
  const steps = []

  steps.push({
    title: 'Shared resource: Account row (balance = 500)',
    explanation:
      'Two transactions, T1 and T2, both want to update the same row at nearly the same time. Without any coordination, they could both read 500, both compute their own new value, and one write would silently overwrite the other — a lost update.',
    state: { balance: 500, lockOwner: null, waiting: [], t1: 'idle', t2: 'idle', log: [] },
  })

  steps.push({
    title: 'T1: BEGIN and acquire lock',
    explanation: 'T1 starts first and requests a lock on the row. Since no one else holds it, T1 acquires the lock immediately and can proceed safely.',
    state: { balance: 500, lockOwner: 'T1', waiting: [], t1: 'locked', t2: 'idle', log: ['T1 acquires the lock'] },
  })

  steps.push({
    title: 'T2: BEGIN and request the same lock',
    explanation: 'T2 also wants to update this row and requests the lock. But T1 already holds it — T2 cannot proceed and must wait.',
    state: { balance: 500, lockOwner: 'T1', waiting: ['T2'], t1: 'locked', t2: 'waiting', log: ['T1 acquires the lock', 'T2 requests the lock — must wait'] },
  })

  steps.push({
    title: 'T1: READ balance (500), WRITE balance = 500 + 100 = 600',
    explanation: 'While T2 waits, T1 safely reads and updates the balance. Because it holds the exclusive lock, no other transaction can interfere with this read-modify-write sequence — that\'s what prevents the lost update.',
    state: { balance: 600, lockOwner: 'T1', waiting: ['T2'], t1: 'writing', t2: 'waiting', log: ['T1 acquires the lock', 'T2 requests the lock — must wait', 'T1 updates balance to 600 (uncommitted)'] },
  })

  steps.push({
    title: 'T1: COMMIT and release the lock',
    explanation: 'T1 commits its change (balance permanently becomes 600) and releases the lock. The lock is now free for whoever is waiting.',
    state: { balance: 600, lockOwner: null, waiting: ['T2'], t1: 'done', t2: 'waiting', log: ['T1 acquires the lock', 'T2 requests the lock — must wait', 'T1 updates balance to 600 (uncommitted)', 'T1 commits and releases the lock'] },
  })

  steps.push({
    title: 'T2: acquires the now-free lock',
    explanation: 'T2 was queued waiting for exactly this lock. Now that it\'s free, T2 immediately acquires it and can finally proceed.',
    state: { balance: 600, lockOwner: 'T2', waiting: [], t1: 'done', t2: 'locked', log: ['T1 acquires the lock', 'T2 requests the lock — must wait', 'T1 updates balance to 600 (uncommitted)', 'T1 commits and releases the lock', 'T2 acquires the lock'] },
  })

  steps.push({
    title: 'T2: READ balance (600), WRITE balance = 600 + 50 = 650',
    explanation: 'T2 reads the balance T1 actually committed — 600, not the stale 500 it might have read if it hadn\'t waited — and applies its own update on top of it.',
    state: { balance: 650, lockOwner: 'T2', waiting: [], t1: 'done', t2: 'writing', log: ['T1 acquires the lock', 'T2 requests the lock — must wait', 'T1 updates balance to 600 (uncommitted)', 'T1 commits and releases the lock', 'T2 acquires the lock', 'T2 updates balance to 650 (uncommitted)'] },
  })

  steps.push({
    title: 'T2: COMMIT and release the lock',
    explanation: 'T2 commits, the balance becomes 650, and the lock is released. Both updates (+100 then +50) were applied correctly, in order, with neither transaction ever seeing or overwriting the other\'s uncommitted work.',
    state: { balance: 650, lockOwner: null, waiting: [], t1: 'done', t2: 'done', log: ['T1 acquires the lock', 'T2 requests the lock — must wait', 'T1 updates balance to 600 (uncommitted)', 'T1 commits and releases the lock', 'T2 acquires the lock', 'T2 updates balance to 650 (uncommitted)', 'T2 commits and releases the lock'] },
  })

  return steps
}

export const concurrencyNotes = {
  what: 'Concurrency control is the set of techniques a database uses to let multiple transactions run at the same time without corrupting each other\'s work — most commonly using locks.',
  why: 'If two transactions read the same value and both write back their own update, one update can silently overwrite the other (a "lost update"), even though each transaction individually looked correct. Real systems have many transactions running simultaneously, so this has to be handled automatically.',
  how: 'Before modifying a row, a transaction acquires a lock on it. Any other transaction wanting the same lock must wait until it\'s released (typically at COMMIT or ROLLBACK). This serializes access to that specific row without blocking transactions touching unrelated data.',
  observe: 'Watch T2 sit in a genuine "waiting" state — not proceeding, not erroring — until T1\'s lock is released, and notice T2 reads T1\'s committed value (600), never T1\'s uncommitted in-progress one.',
  outcome: 'Both updates apply correctly and in order: 500 → 600 (T1) → 650 (T2), with no lost update, at the cost of T2 having to wait briefly.',
  points: [
    'Locking trades some concurrency (T2 has to wait) for correctness (no lost updates) — this is a fundamental tradeoff, not a flaw.',
    'Real databases often use row-level locks (as shown here) rather than table-level locks, so unrelated rows aren\'t affected.',
    'Holding locks for too long (long transactions) increases how often other transactions have to wait — a common real-world performance issue.',
  ],
  complexity: 'Acquiring/releasing an uncontended lock is O(1); a waiting transaction\'s delay depends entirely on how long the lock holder takes, not on data size.',
  realWorld: 'Two people trying to book the last seat on a flight, or two bank tellers processing withdrawals from the same account at the same moment, are exactly this scenario in production systems.',
}
