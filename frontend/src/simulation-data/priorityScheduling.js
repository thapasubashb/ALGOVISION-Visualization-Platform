// Priority: lower number = higher priority. Non-preemptive: once a
// process starts, it always runs to completion.
export const PRIORITY_PROCESSES = [
  { id: 'P1', arrival: 0, burst: 4, priority: 3 },
  { id: 'P2', arrival: 1, burst: 3, priority: 1 },
  { id: 'P3', arrival: 2, burst: 2, priority: 2 },
  { id: 'P4', arrival: 3, burst: 1, priority: 1 },
]

export const PRIORITY_COLORS = { P1: 'bg-blue-500', P2: 'bg-purple-500', P3: 'bg-amber-500', P4: 'bg-pink-500' }

export function buildPrioritySteps() {
  const steps = []
  const done = new Set()
  const gantt = []
  const completion = {}
  let time = 0

  steps.push({
    title: 'Lower priority number = runs first (non-preemptive)',
    explanation: 'Each process has a priority (1 = highest). Whenever the CPU is free, the scheduler picks the highest-priority process among those that have already arrived. Once chosen, a process runs to completion — no preemption, even if a higher-priority process arrives moments later.',
    state: { gantt: [], queue: [], runningId: null, time: 0, completion: {}, considered: [] },
  })

  while (done.size < PRIORITY_PROCESSES.length) {
    const arrived = PRIORITY_PROCESSES.filter((p) => p.arrival <= time && !done.has(p.id))
    if (arrived.length === 0) {
      time = Math.min(...PRIORITY_PROCESSES.filter((p) => !done.has(p.id)).map((p) => p.arrival))
      continue
    }
    arrived.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival)
    const chosen = arrived[0]

    steps.push({
      title: `t=${time}: choosing among arrived processes`,
      explanation: `Arrived and waiting: ${arrived.map((p) => `${p.id} (priority ${p.priority})`).join(', ')}. ${chosen.id} has the best (lowest) priority number, so it's selected next.`,
      state: { gantt: gantt.map((g) => ({ ...g })), queue: arrived.map((p) => p.id), runningId: null, time, completion: { ...completion }, considered: arrived.map((p) => p.id) },
    })

    const start = time
    const end = time + chosen.burst
    gantt.push({ id: chosen.id, start, end })
    time = end
    done.add(chosen.id)
    completion[chosen.id] = end

    steps.push({
      title: `Run ${chosen.id} from t=${start} to t=${end}`,
      explanation: `${chosen.id} (priority ${chosen.priority}) runs uninterrupted for its full burst of ${chosen.burst} units, finishing at t=${end}. Because this is non-preemptive, even a higher-priority arrival during this window would have to wait.`,
      state: { gantt: gantt.map((g) => ({ ...g })), queue: [], runningId: chosen.id, time: end, completion: { ...completion }, considered: [] },
    })
  }

  const metrics = PRIORITY_PROCESSES.map((p) => {
    const finish = completion[p.id]
    const turnaround = finish - p.arrival
    const waiting = turnaround - p.burst
    return { id: p.id, arrival: p.arrival, burst: p.burst, priority: p.priority, completion: finish, turnaround, waiting }
  })
  const avgWaiting = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2)

  steps.push({
    title: 'All processes complete',
    explanation: `Notice P4 (priority 1, arrived at t=3) ran before P3 (priority 2, arrived earlier at t=2) — priority order won out over arrival order. Average waiting time: ${avgWaiting} units.`,
    state: { gantt: gantt.map((g) => ({ ...g })), queue: [], runningId: null, time, completion: { ...completion }, finalMetrics: metrics, avgWaiting },
  })

  return steps
}

export const priorityNotes = {
  what: 'Priority Scheduling assigns each process a priority value and always runs the highest-priority process among those currently ready, rather than simply the earliest arrival or shortest job.',
  why: 'Not all work is equally urgent — a real-time system alarm should run before a background log-cleanup task, regardless of which one technically arrived first. Priority scheduling lets the system express that urgency directly.',
  how: 'Whenever the CPU becomes free, the scheduler scans all arrived, unfinished processes and picks the one with the best (commonly, lowest-numbered) priority. In the non-preemptive version shown here, once selected a process always runs to completion.',
  observe: 'Watch P4 (priority 1) jump ahead of P3 (priority 2) even though P3 arrived earlier — priority, not arrival order, is what determines the schedule here.',
  outcome: 'Higher-priority processes systematically get better (lower) waiting times than lower-priority ones, at the cost of potentially making low-priority processes wait a long time.',
  points: [
    'Priority scheduling can starve low-priority processes indefinitely if higher-priority ones keep arriving — a serious real-world risk.',
    '"Aging" is a common fix for starvation: a process\'s priority gradually improves the longer it waits, guaranteeing it eventually runs.',
    'SJF is actually a special case of priority scheduling where priority = burst time (shorter burst = higher priority).',
  ],
  complexity: 'Selecting the highest-priority ready process is O(log n) with a priority queue, or O(n) with a simple linear scan — either way, cheap compared to the actual work being scheduled.',
  realWorld: 'Real-time operating systems (used in cars, medical devices, industrial control) rely heavily on priority scheduling — a safety-critical task must always preempt a routine one.',
}
