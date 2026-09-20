export const osTopics = [
  { id: 'round-robin', name: 'Round Robin Scheduling', category: 'Operating Systems', description: 'A real Round Robin run with a live ready queue, CPU, and growing Gantt chart.', difficulty: 'Beginner', status: 'Built' },
  { id: 'process-states', name: 'Process States', category: 'Operating Systems', description: 'A process moving through New → Ready → Running → Waiting → Terminated.', difficulty: 'Beginner', status: 'Built' },
  { id: 'fcfs', name: 'FCFS CPU Scheduling', category: 'Operating Systems', description: 'First-come-first-served scheduling with a progressively built Gantt chart.', difficulty: 'Beginner', status: 'Built' },
  { id: 'sjf-srtf', name: 'SJF / SRTF', category: 'Operating Systems', description: 'Shortest-job-first scheduling, including preemption when a shorter job arrives.', difficulty: 'Intermediate', status: 'Built' },
  { id: 'priority-scheduling', name: 'Priority Scheduling', category: 'Operating Systems', description: 'The scheduler picks the highest-priority ready process each time.', difficulty: 'Intermediate', status: 'Built' },
  { id: 'fifo-page-replacement', name: 'FIFO Page Replacement', category: 'Operating Systems', description: 'Page hits and faults against a reference string, oldest page evicted first.', difficulty: 'Intermediate', status: 'Built' },
  { id: 'lru-page-replacement', name: 'LRU Page Replacement', category: 'Operating Systems', description: 'Recency tracked per page frame, least-recently-used one evicted on a fault.', difficulty: 'Intermediate', status: 'Built' },
  { id: 'memory-allocation', name: 'Memory Allocation', category: 'Operating Systems', description: 'First Fit, Best Fit and Worst Fit placing processes into memory blocks.', difficulty: 'Intermediate', status: 'Built' },
  { id: 'bankers-algorithm', name: "Banker's Algorithm", category: 'Operating Systems', description: 'A live safety check searching for a safe sequence across processes and resources.', difficulty: 'Advanced', status: 'Built' },
  { id: 'disk-scheduling', name: 'Disk Scheduling', category: 'Operating Systems', description: 'FCFS, SSTF, SCAN and C-SCAN moving a disk head across tracks.', difficulty: 'Advanced', status: 'Built' },
]
