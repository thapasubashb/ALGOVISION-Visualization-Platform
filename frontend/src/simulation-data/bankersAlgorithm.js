// Classic Silberschatz textbook example: 5 processes, 3 resource types.
export const BANKERS_PROCESSES = ['P0', 'P1', 'P2', 'P3', 'P4']
export const RESOURCE_NAMES = ['A', 'B', 'C']
export const ALLOCATION = {
  P0: [0, 1, 0],
  P1: [2, 0, 0],
  P2: [3, 0, 2],
  P3: [2, 1, 1],
  P4: [0, 0, 2],
}
export const MAX = {
  P0: [7, 5, 3],
  P1: [3, 2, 2],
  P2: [9, 0, 2],
  P3: [2, 2, 2],
  P4: [4, 3, 3],
}
export const INITIAL_AVAILABLE = [3, 3, 2]

function need(p) {
  return MAX[p].map((m, i) => m - ALLOCATION[p][i])
}

function fits(need, available) {
  return need.every((n, i) => n <= available[i])
}

export function buildBankersSteps() {
  const steps = []
  const needs = Object.fromEntries(BANKERS_PROCESSES.map((p) => [p, need(p)]))
  let available = [...INITIAL_AVAILABLE]
  const done = new Set()
  const safeSequence = []

  steps.push({
    title: "Banker's Algorithm — checking if the current state is safe",
    explanation: `A state is "safe" if there exists SOME order in which every process can finish, even in the worst case where each one eventually demands its full Max. We compute Need = Max − Allocation for each process, then search for a safe execution order.`,
    state: { available: [...available], done: [], safeSequence: [], checking: null, result: null, needs },
  })

  let guard = 0
  while (done.size < BANKERS_PROCESSES.length && guard < 20) {
    guard += 1
    let foundThisRound = false
    for (const p of BANKERS_PROCESSES) {
      if (done.has(p)) continue
      const canRun = fits(needs[p], available)
      steps.push({
        title: `Check ${p}: Need [${needs[p].join(', ')}] vs Available [${available.join(', ')}]`,
        explanation: canRun
          ? `${p}'s Need is fully covered by what's currently Available — in the worst case, ${p} could ask for its entire Need and the system could still satisfy it. ${p} can safely be allowed to run to completion.`
          : `${p} needs more of at least one resource than is currently Available — it's possible ${p} could get stuck waiting. Skip it for now and check the next process.`,
        state: { available: [...available], done: [...done], safeSequence: [...safeSequence], checking: p, result: canRun ? 'ok' : 'blocked', needs },
      })

      if (canRun) {
        available = available.map((a, i) => a + ALLOCATION[p][i])
        done.add(p)
        safeSequence.push(p)
        foundThisRound = true
        steps.push({
          title: `${p} finishes and releases its resources`,
          explanation: `${p} completes, and its allocated resources [${ALLOCATION[p].join(', ')}] are returned to the pool. Available becomes [${available.join(', ')}] — likely enough now to unblock a process that couldn't run before.`,
          state: { available: [...available], done: [...done], safeSequence: [...safeSequence], checking: null, result: null, needs },
        })
        break
      }
    }
    if (!foundThisRound) break
  }

  const isSafe = done.size === BANKERS_PROCESSES.length
  steps.push({
    title: isSafe ? `Safe sequence found: ${safeSequence.join(' → ')}` : 'No safe sequence exists — UNSAFE state',
    explanation: isSafe
      ? `Every process can finish in the order ${safeSequence.join(' → ')} without any deadlock, even in the worst case. Because a safe sequence exists, the system is in a safe state and can accept this resource allocation.`
      : 'No ordering allows every remaining process to finish — the system is in an unsafe state, which means a deadlock is possible (though not guaranteed). A request that would lead here should be denied or delayed.',
    state: { available: [...available], done: [...done], safeSequence: [...safeSequence], checking: null, result: null, needs, final: true, isSafe },
  })

  return steps
}

export const bankersAlgorithmNotes = {
  what: "Banker's Algorithm is a deadlock-avoidance algorithm that checks, before granting a resource request, whether the resulting state is still \"safe\" — meaning every process could still finish given enough time.",
  why: 'Deadlock detection (see the Deadlocks topic) reacts after a deadlock has already happened. Banker\'s Algorithm instead prevents it proactively — the OS simulates granting a request and only actually grants it if the system would remain in a safe state.',
  how: 'For each process, compute Need = Max − Allocation. Repeatedly scan for any not-yet-finished process whose Need can be fully satisfied by the currently Available resources; "run" it (add its Allocation back to Available) and mark it done. If every process eventually finishes this way, a safe sequence exists.',
  observe: 'Watch how a process that initially can\'t run (its Need exceeds Available) becomes runnable later, once an earlier process finishes and returns its resources to the pool — that\'s exactly why we need to keep retrying processes in a loop.',
  outcome: `A safe sequence (${['P1', 'P3', 'P4', 'P0', 'P2'].join(' → ')} in this classic example) is found, confirming the current allocation state is safe and won\'t lead to deadlock.`,
  points: [
    'A safe state guarantees no deadlock; but an unsafe state doesn\'t guarantee deadlock will happen — it just means the algorithm can\'t prove safety.',
    'The algorithm requires knowing each process\'s maximum possible resource demand in advance — a strong assumption that limits its use in some real systems.',
    'The safety-check part of the algorithm is run every time a new resource request comes in, not just once at startup.',
  ],
  complexity: "The safety algorithm is O(n² × m) for n processes and m resource types — each of the n passes may scan all remaining processes, each requiring an O(m) comparison.",
  realWorld: "Banker's Algorithm is more often taught as a foundational concept than deployed literally in modern OSes (its need-to-know-max-demand requirement is impractical for general-purpose systems), but its core idea — check safety before granting — underlies many real resource managers.",
}
