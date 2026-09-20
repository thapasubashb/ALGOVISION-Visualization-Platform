export const DISK_MAX_TRACK = 199
export const DISK_HEAD_START = 53
export const DISK_REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67]

const ALGO_LABEL = { fcfs: 'FCFS', sstf: 'SSTF', scan: 'SCAN', cscan: 'C-SCAN' }

function computeOrder(algorithm) {
  const requests = [...DISK_REQUESTS]
  let head = DISK_HEAD_START

  if (algorithm === 'fcfs') {
    return requests
  }

  if (algorithm === 'sstf') {
    const order = []
    const remaining = [...requests]
    let current = head
    while (remaining.length > 0) {
      remaining.sort((a, b) => Math.abs(a - current) - Math.abs(b - current))
      const next = remaining.shift()
      order.push(next)
      current = next
    }
    return order
  }

  if (algorithm === 'scan') {
    const up = requests.filter((r) => r >= head).sort((a, b) => a - b)
    const down = requests.filter((r) => r < head).sort((a, b) => b - a)
    return [...up, DISK_MAX_TRACK, ...down]
  }

  // cscan
  const up = requests.filter((r) => r >= head).sort((a, b) => a - b)
  const down = requests.filter((r) => r < head).sort((a, b) => a - b)
  return [...up, DISK_MAX_TRACK, 0, ...down]
}

export function buildDiskSchedulingSteps(algorithm) {
  const steps = []
  const order = computeOrder(algorithm)
  let head = DISK_HEAD_START
  let totalMovement = 0
  const visited = []

  steps.push({
    title: `${ALGO_LABEL[algorithm]} — head starts at track ${DISK_HEAD_START}`,
    explanation: `Requests waiting to be serviced: ${DISK_REQUESTS.join(', ')} (disk has tracks 0–${DISK_MAX_TRACK}). ${algoExplain(algorithm)}`,
    state: { head: DISK_HEAD_START, visited: [], totalMovement: 0, path: [DISK_HEAD_START], nextTarget: order[0] },
  })

  order.forEach((track, i) => {
    const distance = Math.abs(track - head)
    totalMovement += distance
    head = track
    visited.push(track)
    const isRealRequest = DISK_REQUESTS.includes(track)
    steps.push({
      title: `Move to track ${track} (${distance} tracks)${isRealRequest ? '' : ' — end of disk, no request here'}`,
      explanation: isRealRequest
        ? `The head moves from its previous position to track ${track}, servicing this request. That's a movement of ${distance} tracks. Total head movement so far: ${totalMovement}.`
        : `The head continues in its current direction all the way to track ${track} — the edge of the disk — even though no request is waiting there, because ${algorithm === 'scan' ? 'SCAN' : 'C-SCAN'} always sweeps to the end before reversing or wrapping.`,
      state: { head: track, visited: [...visited], totalMovement, path: [DISK_HEAD_START, ...visited], nextTarget: order[i + 1] ?? null },
    })
  })

  steps.push({
    title: `${ALGO_LABEL[algorithm]} complete — total head movement: ${totalMovement} tracks`,
    explanation: `All ${DISK_REQUESTS.length} requests have been serviced. The total distance the disk head physically traveled is ${totalMovement} tracks — this is the number every disk scheduling algorithm is trying to minimize, since head movement is the slowest part of a disk seek.`,
    state: { head, visited: [...visited], totalMovement, path: [DISK_HEAD_START, ...visited], nextTarget: null, done: true },
  })

  return steps
}

function algoExplain(algorithm) {
  switch (algorithm) {
    case 'fcfs': return 'FCFS services requests in the exact order they arrived, ignoring their track positions entirely.'
    case 'sstf': return 'SSTF (Shortest Seek Time First) always services whichever waiting request is physically closest to the head\'s current position.'
    case 'scan': return 'SCAN moves the head in one direction, servicing every request it passes, sweeps all the way to the end of the disk, then reverses direction.'
    default: return 'C-SCAN moves the head in one direction only, servicing requests as it goes; upon reaching the end, it jumps back to track 0 and continues in the same direction — never reversing.'
  }
}

export const diskSchedulingNotes = {
  what: 'Disk scheduling algorithms decide the order in which pending disk I/O requests (each targeting a specific track) are serviced, to minimize the total distance the physical disk head has to travel.',
  why: 'On mechanical (spinning) disks, moving the read/write head is by far the slowest part of an I/O operation. Servicing requests in a smart order rather than arrival order can dramatically reduce total seek time and improve throughput.',
  how: 'FCFS ignores position entirely. SSTF always jumps to the nearest request. SCAN sweeps across the whole disk in one direction like an elevator, servicing everything along the way, then reverses. C-SCAN does the same sweep but always jumps back to the start rather than reversing, keeping wait times more uniform.',
  observe: 'Switch algorithms on the identical request queue and head start position, and compare total head movement directly — notice how FCFS\'s "zig-zag" path (chasing requests in arrival order) covers far more distance than the others.',
  outcome: 'The same 8 requests get serviced by every algorithm, but the total head travel distance differs substantially depending on which strategy is used.',
  points: [
    'SSTF can starve far-away requests if closer ones keep arriving — similar to the starvation risk in SJF/priority CPU scheduling.',
    'SCAN and C-SCAN provide more predictable, uniform wait times than SSTF, at some cost to raw total movement in certain cases.',
    'On modern SSDs, there\'s no physical head to move, so these algorithms matter far less than they did (and still do) for spinning hard disks.',
  ],
  complexity: 'FCFS is O(1) per request (no sorting needed). SSTF costs O(n) per pick without a sorted structure. SCAN/C-SCAN sort the queue once, O(n log n), then service it in a single pass.',
  realWorld: 'Database engines and OS I/O schedulers historically used variants of these algorithms (like the Linux "elevator" I/O scheduler, directly named after SCAN\'s elevator analogy) to optimize spinning-disk performance.',
}
