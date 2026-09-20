export const FCFS_PROCESSES = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 4, burst: 1 },
]

export const FCFS_COLORS = { P1: 'bg-blue-500', P2: 'bg-purple-500', P3: 'bg-amber-500', P4: 'bg-pink-500' }

export function buildFcfsSteps() {
  const steps = []
  const order = [...FCFS_PROCESSES].sort((a, b) => a.arrival - b.arrival)
  const gantt = []
  const completion = {}
  let time = 0

  steps.push({
    title: 'Ready queue ordered strictly by arrival time',
    explanation: `FCFS (First-Come, First-Served) is the simplest scheduling algorithm: whoever arrives first runs first, and once running, a process is never preempted — it runs to completion. Arrival order here: ${order.map((p) => p.id).join(', ')}.`,
    state: { gantt: [], queue: order.map((p) => p.id), runningId: null, time: 0, completion: {} },
  })

  for (const p of order) {
    if (time < p.arrival) time = p.arrival
    const start = time
    const end = time + p.burst
    gantt.push({ id: p.id, start, end })
    time = end
    completion[p.id] = end

    steps.push({
      title: `Run ${p.id} from t=${start} to t=${end}`,
      explanation: p.arrival < start
        ? `${p.id} arrived at t=${p.arrival} but had to wait for the CPU to free up. Since FCFS never preempts, it now runs uninterrupted for its full burst time (${p.burst} units) until t=${end}.`
        : `${p.id} arrived at t=${p.arrival} and the CPU was immediately free, so it starts right away and runs uninterrupted for ${p.burst} units until t=${end}.`,
      state: {
        gantt: [...gantt],
        queue: order.filter((o) => !gantt.some((g) => g.id === o.id)).map((o) => o.id),
        runningId: p.id,
        time: end,
        completion: { ...completion },
      },
    })
  }

  const metrics = FCFS_PROCESSES.map((p) => {
    const finish = completion[p.id]
    const turnaround = finish - p.arrival
    const waiting = turnaround - p.burst
    return { id: p.id, arrival: p.arrival, burst: p.burst, completion: finish, turnaround, waiting }
  })
  const avgWaiting = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2)
  const avgTurnaround = (metrics.reduce((s, m) => s + m.turnaround, 0) / metrics.length).toFixed(2)

  steps.push({
    title: 'All processes complete',
    explanation: `FCFS finishes with an average waiting time of ${avgWaiting} units. Notice P3 and P4 — despite having very short bursts (2 and 1 units) — still had to wait behind P1's long 5-unit burst simply because they arrived later. This is the "convoy effect": short jobs stuck behind long ones.`,
    state: { gantt: [...gantt], queue: [], runningId: null, time, completion: { ...completion }, finalMetrics: metrics, avgWaiting, avgTurnaround },
  })

  return steps
}

export const fcfsNotes = {
  what: 'First-Come, First-Served (FCFS) is the simplest CPU scheduling algorithm: processes are executed strictly in the order they arrive, with no preemption once a process starts running.',
  why: 'It\'s the most straightforward, fair-in-a-naive-sense way to schedule — everyone gets served in line, just like a queue at a counter. It\'s a useful baseline to compare every other scheduling algorithm against.',
  how: 'Processes are sorted by arrival time. The scheduler picks the earliest arrival first and runs it completely, uninterrupted, before considering the next process in line — even if a much shorter job arrives moments later.',
  observe: 'Watch P3 (burst 2) and P4 (burst 1) — both short jobs — sit waiting behind P1\'s long 5-unit burst, purely because of arrival order, not because it\'s efficient.',
  outcome: 'All 4 processes complete in arrival order, with a noticeably higher average waiting time than a smarter algorithm (like SJF) would achieve on the same workload.',
  points: [
    'FCFS is simple to implement (a plain FIFO queue) but can produce the "convoy effect" — short processes stuck waiting behind one long one.',
    'FCFS is non-preemptive: once a process starts, nothing can interrupt it, even a much more urgent, shorter task.',
    'Average waiting time under FCFS depends heavily on arrival order, not on burst time — a bad arrival order can hurt overall throughput badly.',
  ],
  complexity: 'Each scheduling decision is O(1) using a simple queue; overall runtime to schedule n processes is O(n).',
  realWorld: 'Basic batch-processing systems and simple print-job queues often use FCFS-like scheduling — simplicity matters more than optimal turnaround time in those contexts.',
}
