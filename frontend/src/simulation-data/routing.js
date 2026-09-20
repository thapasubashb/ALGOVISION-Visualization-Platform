const NODES = ['Host A', 'Router 1', 'Router 2', 'Router 3', 'Host B']

const ROUTING_TABLES = {
  'Router 1': [
    { dest: '10.0.3.0/24', nextHop: 'Router 2' },
    { dest: '10.0.4.0/24', nextHop: 'Router 2' },
  ],
  'Router 2': [
    { dest: '10.0.4.0/24', nextHop: 'Router 3' },
    { dest: '10.0.1.0/24', nextHop: 'Router 1' },
  ],
  'Router 3': [
    { dest: '10.0.4.0/24', nextHop: 'Host B (directly connected)' },
  ],
}

const DEST_NETWORK = '10.0.4.0/24'

export function buildRoutingSteps() {
  const steps = []

  steps.push({
    title: `Host A sends a packet to Host B (${DEST_NETWORK})`,
    explanation: 'Host A is not directly connected to Host B — the packet must travel through a chain of routers, each making its own independent forwarding decision based on its own routing table.',
    state: { hop: 0, lookupRouter: null, highlightRow: null },
  })

  const hops = ['Router 1', 'Router 2', 'Router 3']
  hops.forEach((router, i) => {
    const table = ROUTING_TABLES[router]
    const matchIndex = table.findIndex((row) => row.dest === DEST_NETWORK)
    steps.push({
      title: `Packet arrives at ${router}`,
      explanation: `${router} receives the packet and looks up the destination network ${DEST_NETWORK} in its own routing table to decide where to send it next.`,
      state: { hop: i + 1, lookupRouter: router, highlightRow: null },
    })
    steps.push({
      title: `${router}: routing table lookup`,
      explanation: `${router}'s table says: to reach ${DEST_NETWORK}, forward to "${table[matchIndex].nextHop}". This is the selected route — the packet is forwarded accordingly, one hop closer to Host B.`,
      state: { hop: i + 1, lookupRouter: router, highlightRow: matchIndex },
    })
  })

  steps.push({
    title: 'Packet arrives at Host B',
    explanation: 'After 3 independent hop-by-hop decisions — each router only knowing its own next hop, not the entire path — the packet reaches its final destination.',
    state: { hop: 4, lookupRouter: null, highlightRow: null },
  })

  return steps
}

export const routingNodes = NODES
export const routingTables = ROUTING_TABLES
export const routingDest = DEST_NETWORK

export const routingNotes = {
  what: 'Routing is the process of forwarding a packet from its source to its destination across multiple networks, hop by hop, using routing tables at each router along the way.',
  why: 'The internet is made of an enormous number of interconnected networks — no single device has (or needs) a complete map of the entire path. Routing lets each router make a local, independent decision that collectively gets the packet to the right place.',
  how: 'Each router examines the packet\'s destination IP address, looks it up against its own routing table (matching the destination network), and forwards the packet to the corresponding "next hop" — another router or the final destination if directly connected.',
  observe: 'Watch how each router only ever decides its own single next hop — none of them knows or needs to know the full path from Host A to Host B.',
  outcome: 'The packet reaches Host B after 3 independent forwarding decisions, none of which required global knowledge of the network.',
  points: [
    'Routing tables are usually built automatically by routing protocols (like OSPF or BGP) rather than configured by hand for every possible destination.',
    'A route with a more specific prefix (e.g. /24 vs /16) is normally preferred when multiple routes could match — called the "longest prefix match" rule.',
    'If a router has no matching route for a destination, it typically forwards to a "default route," or drops the packet if none exists.',
  ],
  complexity: 'A single routing table lookup is typically O(log n) using a trie or similar structure, regardless of the total number of hops the packet still has to travel.',
  realWorld: 'Every time you `traceroute` a website, you\'re watching exactly this hop-by-hop routing decision-making happen in real time, one router at a time.',
}
