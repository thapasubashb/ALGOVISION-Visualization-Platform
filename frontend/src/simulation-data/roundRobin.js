// Runs an actual Round Robin scheduling simulation over a fixed set of
// sample processes and emits one step per CPU burst (context switch),
// so Play genuinely walks through the real algorithm rather than a
// canned animation.

export const PROCESSES = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 4, burst: 1 },
]

export const QUANTUM = 2

export const PROCESS_COLORS = {
  P1: 'bg-blue-500',
  P2: 'bg-purple-500',
  P3: 'bg-amber-500',
  P4: 'bg-pink-500',
}

export function buildRoundRobinSteps() {
  const steps = []
  const remaining = Object.fromEntries(PROCESSES.map((p) => [p.id, p.burst]))
  const completion = {}
  const added = new Set()
  let queue = []
  let time = 0
  const gantt = []

  const byArrival = [...PROCESSES].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id))

  function admit(upTo) {
    const newlyAdded = []
    for (const p of byArrival) {
      if (p.arrival <= upTo && !added.has(p.id)) {
        queue.push(p.id)
        added.add(p.id)
        newlyAdded.push(p.id)
      }
    }
    return newlyAdded
  }

  steps.push({
    title: 'Ready queue before scheduling starts',
    explanation:
      `Four processes arrive at different times: ${PROCESSES.map((p) => `${p.id} at t=${p.arrival} (burst ${p.burst})`).join(', ')}. ` +
      `Round Robin uses a fixed time quantum of ${QUANTUM} units — every process gets at most ${QUANTUM} units of CPU time per turn before being moved to the back of the queue.`,
    state: { time: 0, queue: [], runningId: null, remaining: { ...remaining }, gantt: [], completion: {}, justArrived: [] },
  })

  admit(0)
  steps.push({
    title: `t=0: P1 arrives and enters the ready queue`,
    explanation: 'P1 is the only process that has arrived at time 0, so it enters the empty ready queue and will be the first to run.',
    state: { time: 0, queue: [...queue], runningId: null, remaining: { ...remaining }, gantt: [], completion: {}, justArrived: ['P1'] },
  })

  let guard = 0
  while (Object.keys(completion).length < PROCESSES.length && guard < 50) {
    guard += 1
    admit(time)
    if (queue.length === 0) {
      const next = byArrival.find((p) => !added.has(p.id))
      if (!next) break
      time = next.arrival
      admit(time)
    }

    const runningId = queue.shift()
    const runFor = Math.min(QUANTUM, remaining[runningId])
    const start = time
    const end = time + runFor
    gantt.push({ id: runningId, start, end })
    time = end
    remaining[runningId] -= runFor

    const arrivedDuring = admit(time).filter((id) => id !== runningId)

    let requeued = false
    if (remaining[runningId] > 0) {
      queue.push(runningId)
      requeued = true
    } else {
      completion[runningId] = time
    }

    const willFinish = remaining[runningId] === 0
    const explanationParts = [
      `The scheduler takes ${runningId} from the front of the queue and runs it from t=${start} to t=${end} (${runFor} unit${runFor === 1 ? '' : 's'}).`,
    ]
    if (arrivedDuring.length > 0) {
      explanationParts.push(`While it ran, ${arrivedDuring.join(', ')} arrived and joined the back of the queue.`)
    }
    if (willFinish) {
      explanationParts.push(`${runningId} has no burst time left, so it finishes at t=${end} and leaves the system.`)
    } else {
      explanationParts.push(`${runningId} still has ${remaining[runningId]} unit(s) left, so it goes to the back of the queue for another turn.`)
    }

    steps.push({
      title: `t=${start}–${end}: Run ${runningId}${willFinish ? ' (completes)' : ' (preempted)'}`,
      explanation: explanationParts.join(' '),
      state: {
        time,
        queue: [...queue],
        runningId,
        remaining: { ...remaining },
        gantt: [...gantt],
        completion: { ...completion },
        justArrived: arrivedDuring,
        requeued,
      },
    })
  }

  const metrics = PROCESSES.map((p) => {
    const finish = completion[p.id]
    const turnaround = finish - p.arrival
    const waiting = turnaround - p.burst
    return { id: p.id, arrival: p.arrival, burst: p.burst, completion: finish, turnaround, waiting }
  })
  const avgWaiting = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2)
  const avgTurnaround = (metrics.reduce((s, m) => s + m.turnaround, 0) / metrics.length).toFixed(2)

  steps.push({
    title: 'All processes complete',
    explanation:
      `Every process has finished. Average waiting time is ${avgWaiting} units and average turnaround time is ${avgTurnaround} units. ` +
      'Round Robin trades a bit of extra context-switching overhead for fairness — no process waits too long before getting another turn.',
    state: {
      time,
      queue: [],
      runningId: null,
      remaining: { ...remaining },
      gantt: [...gantt],
      completion: { ...completion },
      justArrived: [],
      finalMetrics: metrics,
      avgWaiting,
      avgTurnaround,
    },
  })

  return steps
}

export const roundRobinNotes = {
  what: 'Round Robin is a preemptive CPU scheduling algorithm that gives every process a fixed time slice (the "quantum") in turn, cycling through the ready queue.',
  why: 'FCFS can let a long process hog the CPU while short ones wait (the convoy effect). Round Robin bounds the maximum wait any single process can experience before getting the CPU, which is important for interactive, time-shared systems.',
  how: 'Processes sit in a FIFO ready queue. The scheduler always runs the process at the front for at most one quantum. If it still has burst time left, it goes to the back of the queue; if it finishes, it leaves the system. New arrivals join the back of the queue.',
  observe: 'Watch how P1 gets interrupted after 2 units even though it needs 5, and has to wait behind P2, P3 and P4 before getting another turn — that repeated cycling is the defining behaviour of Round Robin.',
  outcome: 'A Gantt chart showing every CPU burst in order, plus completion, turnaround and waiting time for each process.',
  points: [
    'A very small quantum causes excessive context-switching overhead; a very large quantum makes Round Robin degrade toward FCFS.',
    'Average waiting time in Round Robin is often higher than SJF, but no single process is ever starved.',
    'Newly arrived processes are typically queued before a preempted process is put back — the exact tie-breaking rule can vary by textbook/implementation.',
  ],
  complexity: 'Each scheduling decision is O(1) (pop from the front of a queue), so simulating n processes with a total of B burst units takes O(B/quantum) context switches.',
  realWorld: 'Time-sharing operating systems and many task schedulers use Round Robin or a close variant to keep the system responsive to many processes at once, rather than letting one process monopolize the CPU.',
}
