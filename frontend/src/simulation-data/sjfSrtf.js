export const SJF_PROCESSES = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 4, burst: 1 },
]

export const SJF_COLORS = { P1: 'bg-blue-500', P2: 'bg-purple-500', P3: 'bg-amber-500', P4: 'bg-pink-500' }

// Runs a genuine unit-by-unit SRTF (Shortest Remaining Time First,
// the preemptive version of SJF) simulation, then compresses consecutive
// same-process ticks into Gantt segments for display.
export function buildSjfSrtfSteps() {
  const steps = []
  const remaining = Object.fromEntries(SJF_PROCESSES.map((p) => [p.id, p.burst]))
  const completion = {}
  const gantt = []
  let time = 0
  let lastRunning = null

  steps.push({
    title: 'SRTF — always run whoever has the least remaining time',
    explanation: 'SRTF (Shortest Remaining Time First) is the preemptive version of SJF: at every moment, the CPU runs whichever arrived process currently has the smallest remaining burst time — even switching away from a process that\'s already running if someone shorter arrives.',
    state: { gantt: [], remaining: { ...remaining }, runningId: null, time: 0, completion: {}, preemptionNote: null },
  })

  const totalBurst = SJF_PROCESSES.reduce((s, p) => s + p.burst, 0)
  let guard = 0
  while (Object.keys(completion).length < SJF_PROCESSES.length && guard < totalBurst + 5) {
    guard += 1
    const arrived = SJF_PROCESSES.filter((p) => p.arrival <= time && remaining[p.id] > 0)
    if (arrived.length === 0) {
      time += 1
      continue
    }
    arrived.sort((a, b) => remaining[a.id] - remaining[b.id] || a.arrival - b.arrival || a.id.localeCompare(b.id))
    const chosen = arrived[0].id

    if (chosen !== lastRunning) {
      gantt.push({ id: chosen, start: time, end: time })
      if (lastRunning && remaining[lastRunning] > 0) {
        steps.push({
          title: `t=${time}: Preempt ${lastRunning}, switch to ${chosen}`,
          explanation: `${chosen} now has less remaining time (${remaining[chosen]} units) than ${lastRunning} (${remaining[lastRunning]} units left), so the scheduler preempts ${lastRunning} mid-execution and switches the CPU to ${chosen}.`,
          state: { gantt: gantt.map((g) => ({ ...g })), remaining: { ...remaining }, runningId: chosen, time, completion: { ...completion }, preemptionNote: `Preempted ${lastRunning}` },
        })
      } else {
        steps.push({
          title: `t=${time}: Start ${chosen}`,
          explanation: `${chosen} has the shortest remaining time (${remaining[chosen]} units) among arrived processes, so it gets the CPU.`,
          state: { gantt: gantt.map((g) => ({ ...g })), remaining: { ...remaining }, runningId: chosen, time, completion: { ...completion }, preemptionNote: null },
        })
      }
    }

    remaining[chosen] -= 1
    time += 1
    gantt[gantt.length - 1].end = time
    lastRunning = chosen

    if (remaining[chosen] === 0) {
      completion[chosen] = time
      steps.push({
        title: `t=${time}: ${chosen} completes`,
        explanation: `${chosen} has no burst time left — it finishes at t=${time} and leaves the system.`,
        state: { gantt: gantt.map((g) => ({ ...g })), remaining: { ...remaining }, runningId: null, time, completion: { ...completion }, preemptionNote: null },
      })
      lastRunning = null
    }
  }

  const metrics = SJF_PROCESSES.map((p) => {
    const finish = completion[p.id]
    const turnaround = finish - p.arrival
    const waiting = turnaround - p.burst
    return { id: p.id, arrival: p.arrival, burst: p.burst, completion: finish, turnaround, waiting }
  })
  const avgWaiting = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2)
  const avgTurnaround = (metrics.reduce((s, m) => s + m.turnaround, 0) / metrics.length).toFixed(2)

  steps.push({
    title: 'All processes complete',
    explanation: `SRTF finishes with an average waiting time of just ${avgWaiting} units — noticeably better than FCFS on this exact same workload, because short jobs (P3, P4) get to "cut in line" ahead of P1's long burst instead of waiting behind it.`,
    state: { gantt: gantt.map((g) => ({ ...g })), remaining: { ...remaining }, runningId: null, time, completion: { ...completion }, finalMetrics: metrics, avgWaiting, avgTurnaround },
  })

  return steps
}

export const sjfSrtfNotes = {
  what: 'SJF (Shortest Job First) always picks the process with the smallest total burst time to run next. SRTF (Shortest Remaining Time First) is its preemptive version — it can interrupt a running process the instant a shorter one becomes available.',
  why: 'Running shorter jobs first minimizes average waiting time — a mathematically proven optimal result for non-preemptive scheduling when all burst times are known in advance. SRTF pushes this further by reacting immediately to new, shorter arrivals.',
  how: 'At every moment, among all arrived-but-unfinished processes, SRTF runs whichever has the least remaining burst time. If a newly arrived process has a strictly shorter remaining time than whatever is currently running, the CPU immediately switches to it (preemption).',
  observe: 'Watch P1 get preempted right after P3 arrives with a shorter remaining time, and resume much later — its execution is split into two separate Gantt segments, unlike FCFS where every process runs as one unbroken block.',
  outcome: 'A noticeably lower average waiting time than FCFS on the identical workload, at the cost of P1 experiencing a mid-execution preemption.',
  points: [
    'SRTF requires knowing (or estimating) burst times in advance — real systems often estimate this from a process\'s recent history rather than knowing it exactly.',
    'SRTF can starve long processes if short jobs keep arriving — a very long process might wait indefinitely in a worst case.',
    'This preemptive requirement means every arrival is a potential scheduling decision point, unlike FCFS which only decides when the CPU goes idle.',
  ],
  complexity: 'Selecting the shortest remaining job is O(log n) per decision using a priority queue (min-heap), with a scheduling decision needed at every arrival and completion event.',
  realWorld: 'Interactive systems favoring short, quick tasks (like handling a keystroke) over long background jobs (like a file compression) borrow directly from this same shortest-job-first intuition.',
}
