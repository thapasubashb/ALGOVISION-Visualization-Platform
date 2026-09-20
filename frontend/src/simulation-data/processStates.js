export function buildProcessStatesSteps() {
  const steps = []

  steps.push({
    title: 'New — process is being created',
    explanation: 'The OS is setting up a Process Control Block (PCB) for this process — allocating memory, assigning a process ID, and initializing its state. It hasn\'t been considered for CPU time yet.',
    state: { current: 'New', history: ['New'] },
  })

  steps.push({
    title: 'Ready — admitted, waiting for the CPU',
    explanation: 'The OS admits the process into the system. It now sits in the ready queue, fully able to run, but waiting for the scheduler to give it CPU time — there may be other ready processes ahead of it.',
    state: { current: 'Ready', history: ['New', 'Ready'] },
  })

  steps.push({
    title: 'Running — the scheduler dispatches it to the CPU',
    explanation: 'The scheduler picks this process from the ready queue and the dispatcher assigns it to the CPU. Its instructions are now actually executing.',
    state: { current: 'Running', history: ['New', 'Ready', 'Running'] },
  })

  steps.push({
    title: 'Waiting — it requests I/O and must block',
    explanation: 'The process needs something it can\'t get instantly — say, reading a file from disk. It issues an I/O request and moves to the Waiting (blocked) state, freeing the CPU for someone else while the I/O completes.',
    state: { current: 'Waiting', history: ['New', 'Ready', 'Running', 'Waiting'] },
  })

  steps.push({
    title: 'Ready — I/O completes, back in the queue',
    explanation: 'The I/O operation finishes. The process is fully able to run again, but it doesn\'t get the CPU immediately — it re-joins the ready queue and waits its turn, just like any other ready process.',
    state: { current: 'Ready', history: ['New', 'Ready', 'Running', 'Waiting', 'Ready'] },
  })

  steps.push({
    title: 'Running — scheduled again',
    explanation: 'The scheduler picks it up again and it resumes execution on the CPU, continuing from where it left off.',
    state: { current: 'Running', history: ['New', 'Ready', 'Running', 'Waiting', 'Ready', 'Running'] },
  })

  steps.push({
    title: 'Terminated — the process finishes',
    explanation: 'The process completes its work (or is killed). The OS reclaims its memory and other resources, and its PCB is eventually removed. This is a one-way transition — a terminated process never returns to any other state.',
    state: { current: 'Terminated', history: ['New', 'Ready', 'Running', 'Waiting', 'Ready', 'Running', 'Terminated'] },
  })

  return steps
}

export const processStatesNotes = {
  what: 'Every process an operating system manages moves through a well-defined set of states: New, Ready, Running, Waiting (Blocked), and Terminated.',
  why: 'The OS needs a clear model of what every process is currently capable of doing, so its scheduler can make correct decisions — you can\'t dispatch a Waiting process to the CPU, and you shouldn\'t let a Terminated one hold onto memory.',
  how: 'Transitions are triggered by specific events: admission (New → Ready), scheduling (Ready → Running), an I/O or event request (Running → Waiting), an I/O or event completion (Waiting → Ready), and either normal completion or being killed (Running → Terminated).',
  observe: 'Notice that a process can bounce between Ready and Running many times (via preemption or I/O) before ever reaching Terminated — the diagram is a cycle, not a straight line, except for the final Terminated state.',
  outcome: 'This particular process cycles through Ready/Running twice (once blocking for I/O in between) before finally terminating.',
  points: [
    'Running → Ready (without Waiting) also happens on preemption — e.g. a time quantum expiring in Round Robin.',
    'A process can only be Running on one CPU core at a time, but many processes can be Ready or Waiting simultaneously.',
    'Some textbooks add a "Suspended" state for processes swapped out to disk under memory pressure — this simulation covers the five-state core model.',
  ],
  complexity: 'State transitions themselves are O(1) — the OS just updates the PCB and moves it between queues; the real cost lies in the scheduling decision of which Ready process runs next.',
  realWorld: 'Every "Not Responding" app on your machine is stuck in some observable state — often blocked waiting on I/O or a lock — and OS tools like `top`/Task Manager literally show you a live snapshot of every process\'s current state.',
}
