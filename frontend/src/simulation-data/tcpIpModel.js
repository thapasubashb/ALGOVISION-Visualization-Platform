export const TCPIP_LAYERS = [
  { name: 'Application', maps: ['Application', 'Presentation', 'Session'], color: 'bg-blue-500', desc: 'Combines OSI\'s Application, Presentation and Session layers — this is where protocols like HTTP, DNS and SMTP live.' },
  { name: 'Transport', maps: ['Transport'], color: 'bg-fuchsia-500', desc: 'Same role as OSI\'s Transport layer — TCP or UDP headers with port numbers are added here.' },
  { name: 'Internet', maps: ['Network'], color: 'bg-rose-500', desc: 'Same role as OSI\'s Network layer — the IP header with source/destination addresses is added here.' },
  { name: 'Network Access', maps: ['Data Link', 'Physical'], color: 'bg-orange-500', desc: 'Combines OSI\'s Data Link and Physical layers — framing, MAC addresses, and the actual electrical/radio transmission.' },
]

export function buildTcpIpSteps() {
  const steps = []

  steps.push({
    title: 'TCP/IP has 4 layers, not 7',
    explanation: 'The TCP/IP model is the practical model the real internet is built on. It groups OSI\'s 7 layers into just 4, without changing what actually happens on the wire — it\'s a simplification of the same ideas.',
    state: { activeIndex: -1, wrappers: [] },
  })

  for (let i = 0; i < TCPIP_LAYERS.length; i += 1) {
    const layer = TCPIP_LAYERS[i]
    steps.push({
      title: `${layer.name} layer`,
      explanation: `${layer.desc} In OSI terms, this single TCP/IP layer corresponds to: ${layer.maps.join(', ')}.`,
      state: { activeIndex: i, wrappers: TCPIP_LAYERS.slice(0, i + 1) },
    })
  }

  steps.push({
    title: 'Same encapsulation, fewer named layers',
    explanation: 'Application data still ends up as a Segment, then a Packet, then a Frame, then Bits — exactly like in the OSI model. TCP/IP just doesn\'t bother naming Presentation/Session or splitting Data Link from Physical as separate layers, because in practice they\'re rarely designed independently.',
    state: { activeIndex: -1, wrappers: [...TCPIP_LAYERS] },
  })

  return steps
}

export const tcpIpNotes = {
  what: 'The TCP/IP model (also called the Internet Protocol Suite) is the 4-layer model that the actual internet is built on: Application, Transport, Internet, and Network Access.',
  why: 'The OSI model is a useful teaching tool, but it was designed somewhat independently of how the internet was actually built. TCP/IP is the model that matches real protocols (IP, TCP, UDP, Ethernet) and real running systems.',
  how: 'Each TCP/IP layer absorbs the responsibilities of one or more OSI layers: Application absorbs OSI\'s Application/Presentation/Session, and Network Access absorbs OSI\'s Data Link/Physical. Transport and Internet map directly to OSI\'s Transport and Network layers.',
  observe: 'Compare this to the OSI Model topic — the data unit names (Segment, Packet, Frame) and their order are identical; only the layer groupings and names differ.',
  outcome: 'The same encapsulated data travels through 4 named layers instead of 7, with identical underlying behavior.',
  points: [
    'When people talk about "the internet protocol stack," they almost always mean TCP/IP, not OSI.',
    'OSI is still valuable for teaching and for troubleshooting language ("that\'s a Layer 2 problem" refers to OSI\'s Data Link layer even in TCP/IP contexts).',
    'TCP/IP predates the OSI model\'s standardization — OSI was, in a sense, built to describe/generalize what TCP/IP was already doing.',
  ],
  complexity: 'Identical to OSI\'s — grouping layers doesn\'t change the actual header overhead or processing cost, only how we talk about it.',
  realWorld: 'Every networking course eventually needs both models: OSI for precise, layer-by-layer troubleshooting language, and TCP/IP for describing how the actual software and protocols you\'ll use are organized.',
}
