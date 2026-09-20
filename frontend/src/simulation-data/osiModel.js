// Walks data down all 7 OSI layers at the sender (encapsulation), across
// the wire, then back up all 7 at the receiver (decapsulation).

export const LAYERS = [
  { name: 'Application', unit: 'Data', color: 'bg-blue-500', desc: 'The user\'s actual message — e.g. an HTTP request — is created here.' },
  { name: 'Presentation', unit: 'Data', color: 'bg-indigo-500', desc: 'Data is formatted/encoded (and optionally encrypted or compressed) into a form both ends agree on.' },
  { name: 'Session', unit: 'Data', color: 'bg-purple-500', desc: 'A logical session between the two applications is established and tracked.' },
  { name: 'Transport', unit: 'Segment', color: 'bg-fuchsia-500', desc: 'A Transport-layer header (e.g. TCP) is added — source/destination port numbers and sequence numbers — turning Data into a Segment.' },
  { name: 'Network', unit: 'Packet', color: 'bg-rose-500', desc: 'A Network-layer header (IP) is added — source/destination IP addresses — turning the Segment into a Packet.' },
  { name: 'Data Link', unit: 'Frame', color: 'bg-orange-500', desc: 'A Data Link header/trailer is added — source/destination MAC addresses and error-checking — turning the Packet into a Frame.' },
  { name: 'Physical', unit: 'Bits', color: 'bg-amber-500', desc: 'The Frame is converted into a raw stream of bits (electrical signals, light pulses, or radio waves) for transmission.' },
]

export function buildOsiSteps() {
  const steps = []

  steps.push({
    title: 'A message is about to travel across the network',
    explanation: 'Before anything is sent, the OSI model breaks the journey into 7 layers. At the sender, data travels DOWN through all 7, gaining a header at most layers (encapsulation). At the receiver, it travels back UP through all 7, losing those same headers in reverse order (decapsulation).',
    state: { phase: 'intro', activeIndex: -1, wrappers: [], direction: 'down' },
  })

  for (let i = 0; i < LAYERS.length; i += 1) {
    const layer = LAYERS[i]
    steps.push({
      title: `Sender — Layer ${i + 1}: ${layer.name}`,
      explanation: `${layer.desc} The data unit is now called a "${layer.unit}".`,
      state: { phase: 'down', activeIndex: i, wrappers: LAYERS.slice(0, i + 1), direction: 'down' },
    })
  }

  steps.push({
    title: 'Bits travel across the physical medium',
    explanation: 'The fully encapsulated frame — now just a stream of bits — physically travels across the cable, fiber, or radio link to the receiver.',
    state: { phase: 'across', activeIndex: -1, wrappers: [...LAYERS], direction: 'across' },
  })

  for (let i = LAYERS.length - 1; i >= 0; i -= 1) {
    const layer = LAYERS[i]
    steps.push({
      title: `Receiver — Layer ${i + 1}: ${layer.name}`,
      explanation: `The receiver's ${layer.name} layer reads and strips off its corresponding header, having used the information in it (e.g. the Data Link layer checks the frame for errors and reads the MAC address) before passing what remains up to the next layer.`,
      state: { phase: 'up', activeIndex: i, wrappers: LAYERS.slice(0, i), direction: 'up' },
    })
  }

  steps.push({
    title: 'Original data delivered to the receiving application',
    explanation: 'After all 7 layers have been peeled back in reverse order, the receiving application gets exactly the same Data that the sending application created — none of the intermediate headers are visible to it.',
    state: { phase: 'done', activeIndex: -1, wrappers: [], direction: 'done' },
  })

  return steps
}

export const osiNotes = {
  what: 'The OSI (Open Systems Interconnection) model divides network communication into 7 conceptual layers, each responsible for one aspect of getting data from one application to another across a network.',
  why: 'Splitting networking into layers lets each one be designed, implemented, and replaced independently — Wi-Fi and Ethernet differ at the Physical/Data Link layers, but everything above them (like an HTTP request) doesn\'t need to know or care which one is in use.',
  how: 'At the sender, each layer wraps the data from the layer above it with its own header (encapsulation), from Application down to Physical. At the receiver, each layer reads and strips off its corresponding header in reverse order (decapsulation), until the original data reaches the receiving application.',
  observe: 'Watch the data unit\'s name change at specific layers — Data → Segment → Packet → Frame → Bits — and notice that the receiver\'s layers are visited in the exact reverse order of the sender\'s.',
  outcome: 'The receiving application ends up with the exact same data the sending application started with, having passed through 14 total layer-crossings (7 down, 7 up) along the way.',
  points: [
    'Only 4 of the 7 layers actually change the data unit\'s name (Transport/Network/Data Link/Physical) — Application, Presentation and Session all still just carry "Data".',
    'Real-world protocol stacks (like TCP/IP) often combine several OSI layers into one — see the TCP/IP Model topic for that comparison.',
    'Each layer only talks to its direct peer layer on the other end conceptually, even though physically everything travels through the layers below it.',
  ],
  complexity: 'Encapsulation/decapsulation adds a fixed, small, constant overhead per layer (a header of some tens of bytes) — it doesn\'t scale with the size of the actual data being sent.',
  realWorld: 'Every single web request, video call, or file download you\'ve ever made has been encapsulated and decapsulated through layers just like this, even though you never see any of it happen.',
}
