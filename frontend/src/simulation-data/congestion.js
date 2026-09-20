// Simulates TCP congestion window (cwnd) evolving across rounds:
// slow start (exponential growth), a loss event, then congestion
// avoidance (linear growth) after the threshold drops.

export function buildCongestionSteps() {
  const steps = []
  let cwnd = 1
  let ssthresh = 16
  const history = []

  steps.push({
    title: 'Connection starts — slow start begins',
    explanation: 'A new TCP connection doesn\'t know how much bandwidth is available, so it starts cautiously: congestion window (cwnd) = 1 segment. ssthresh (slow start threshold) is set high at 16.',
    state: { cwnd, ssthresh, phase: 'slow-start', history: [...history], event: null },
  })

  for (let round = 1; round <= 4; round += 1) {
    cwnd = cwnd * 2
    history.push(cwnd)
    if (cwnd >= ssthresh) {
      steps.push({
        title: `Round ${round}: cwnd doubles to ${cwnd} — reaches ssthresh`,
        explanation: `In slow start, cwnd doubles every round trip (every ACK'd window). It just reached ssthresh (${ssthresh}), so the connection now switches from slow start to congestion avoidance — a more cautious growth phase.`,
        state: { cwnd, ssthresh, phase: 'transition', history: [...history], event: null },
      })
      break
    }
    steps.push({
      title: `Round ${round}: cwnd doubles to ${cwnd}`,
      explanation: `Every ACK received during slow start increases cwnd, causing it to roughly double each round trip: 1 → 2 → 4 → 8... This exponential growth quickly finds a rough estimate of available bandwidth.`,
      state: { cwnd, ssthresh, phase: 'slow-start', history: [...history], event: null },
    })
  }

  for (let round = 1; round <= 4; round += 1) {
    cwnd = cwnd + 1
    history.push(cwnd)
    steps.push({
      title: `Congestion avoidance round ${round}: cwnd = ${cwnd}`,
      explanation: `Past ssthresh, TCP grows much more cautiously — roughly +1 segment per round trip instead of doubling. This linear growth probes for more bandwidth without risking a big burst of loss.`,
      state: { cwnd, ssthresh, phase: 'congestion-avoidance', history: [...history], event: null },
    })
  }

  const preLossCwnd = cwnd
  ssthresh = Math.floor(preLossCwnd / 2)
  cwnd = ssthresh
  history.push(cwnd)
  steps.push({
    title: `Packet loss detected at cwnd = ${preLossCwnd}!`,
    explanation: `A packet loss (detected via a timeout or duplicate ACKs) is TCP's signal that the network is congested. In response, ssthresh is set to half the current cwnd (${ssthresh}), and cwnd drops back down to that new ssthresh — a large, deliberate pullback to relieve congestion.`,
    state: { cwnd, ssthresh, phase: 'loss', history: [...history], event: 'loss' },
  })

  for (let round = 1; round <= 3; round += 1) {
    cwnd = cwnd + 1
    history.push(cwnd)
    steps.push({
      title: `Recovering — congestion avoidance round ${round}: cwnd = ${cwnd}`,
      explanation: 'After a loss, TCP resumes congestion avoidance (linear growth) from the new, lower ssthresh — cautiously re-probing the network\'s capacity rather than jumping back to where it was.',
      state: { cwnd, ssthresh, phase: 'congestion-avoidance', history: [...history], event: null },
    })
  }

  steps.push({
    title: 'The sawtooth pattern',
    explanation: 'Zoom out on the graph: exponential growth (slow start), a switch to linear growth (congestion avoidance), a sharp drop on loss, then linear growth again. This repeating "sawtooth" shape is the signature behavior of classic TCP congestion control.',
    state: { cwnd, ssthresh, phase: 'summary', history: [...history], event: null },
  })

  return steps
}

export const congestionNotes = {
  what: 'TCP congestion control dynamically adjusts how much unacknowledged data (the congestion window, cwnd) a sender is allowed to have in flight, to avoid overwhelming the network.',
  why: 'A sender has no direct visibility into how congested the network path is. Sending too fast causes packet loss and buffer overflow at routers; sending too slow wastes available bandwidth. TCP needs an adaptive strategy that works without global network knowledge.',
  how: 'Slow start grows cwnd exponentially at first (doubling each round trip) to quickly find a rough capacity estimate. Once cwnd passes ssthresh, congestion avoidance grows it only linearly (+1 per round trip) to probe more cautiously. On packet loss, ssthresh is halved and cwnd drops, restarting the cautious growth.',
  observe: 'Watch the shape of the graph: a steep exponential curve during slow start, a shallower straight line during congestion avoidance, and a sharp vertical drop the instant a loss is detected.',
  outcome: 'Sending rate rises quickly at first, then grows more cautiously, and pulls back sharply on any sign of congestion — repeating this cycle for the life of the connection.',
  points: [
    'The repeating rise-then-drop shape is called the TCP "sawtooth" and is one of the most recognizable patterns in networking.',
    'Modern TCP variants (like CUBIC, used by default on Linux) tune this curve differently, but the slow-start/congestion-avoidance/loss-response structure remains conceptually similar.',
    'This is why a single very lossy link can dramatically reduce a TCP connection\'s effective throughput — every loss event is a forced cwnd cut.',
  ],
  complexity: 'Slow start reaches a cwnd of size n in O(log n) round trips (exponential growth); congestion avoidance takes O(n) round trips to grow by the same amount (linear growth) — a deliberate asymmetry between "probe fast" and "back off cautiously".',
  realWorld: 'Every TCP-based download, video stream, or file transfer you\'ve ever done had its throughput shaped by exactly this algorithm running invisibly underneath.',
}
