const IP_OCTETS = [192, 168, 1, 10]
const PREFIX = 24 // /24 => first 3 octets are network, last is host

function toBinary(n) {
  return n.toString(2).padStart(8, '0')
}

export function buildIpAddressingSteps() {
  const steps = []

  steps.push({
    title: `IPv4 address: ${IP_OCTETS.join('.')} /${PREFIX}`,
    explanation: 'An IPv4 address is 32 bits, written as four decimal numbers (0–255) separated by dots — this is called dotted-decimal notation. The "/24" is the prefix length, telling us how many of those 32 bits identify the network.',
    state: { revealedOctets: [], showBinary: false, splitShown: false },
  })

  for (let i = 0; i < IP_OCTETS.length; i += 1) {
    steps.push({
      title: `Octet ${i + 1}: ${IP_OCTETS[i]} → binary`,
      explanation: `${IP_OCTETS[i]} in decimal is ${toBinary(IP_OCTETS[i])} in binary — 8 bits, since each octet ranges from 0 to 255 (2⁸ possible values).`,
      state: { revealedOctets: IP_OCTETS.slice(0, i + 1), showBinary: true, splitShown: false, activeOctet: i },
    })
  }

  steps.push({
    title: 'Full 32-bit binary form',
    explanation: `Put together, ${IP_OCTETS.join('.')} is ${IP_OCTETS.map(toBinary).join(' ')} in binary — 32 bits total, exactly what IPv4 uses for every address.`,
    state: { revealedOctets: [...IP_OCTETS], showBinary: true, splitShown: false, activeOctet: -1 },
  })

  steps.push({
    title: `/${PREFIX} splits the address into network + host`,
    explanation: `A /${PREFIX} prefix means the first ${PREFIX} bits (the first 3 octets: 192.168.1) identify the network, and the remaining ${32 - PREFIX} bits (the last octet: 10) identify this specific host within that network.`,
    state: { revealedOctets: [...IP_OCTETS], showBinary: true, splitShown: true, activeOctet: -1 },
  })

  steps.push({
    title: 'What this means in practice',
    explanation: `Every device on network 192.168.1.0/24 shares the same first 3 octets. This device is host number 10 on that network. Changing the network portion (e.g. to 192.168.2.x) would put a device on a completely different network, even with the same host number.`,
    state: { revealedOctets: [...IP_OCTETS], showBinary: true, splitShown: true, activeOctet: -1, final: true },
  })

  return steps
}

export const ipOctets = IP_OCTETS
export const ipPrefix = PREFIX
export { toBinary }

export const ipAddressingNotes = {
  what: 'An IPv4 address is a 32-bit number, almost always written as four 8-bit octets in decimal, separated by dots (dotted-decimal notation) — e.g. 192.168.1.10.',
  why: 'Every device that communicates over IP needs a unique address so packets know where to go — and that address needs to encode both "which network" and "which device on that network," similar to how a postal address encodes both a city and a street number.',
  how: 'A prefix length (like /24) or subnet mask specifies how many of the 32 bits are the network portion. Bits before the prefix boundary must match for two devices to be on the same network; the remaining bits identify individual hosts within it.',
  observe: 'Watch each decimal octet convert to its 8-bit binary form, and see exactly where the /24 boundary falls — right at the edge between the 3rd and 4th octet, which is why /24 addresses are so common (it lines up neatly with octet boundaries).',
  outcome: 'The address 192.168.1.10/24 is understood as network 192.168.1.0 with host number 10 — meaning up to 254 usable host addresses exist on this specific network.',
  points: [
    'Not all prefix lengths line up neatly on an octet boundary — /26, for example, splits a byte in half, which is exactly what the Subnetting topic explores.',
    '192.168.x.x, 10.x.x.x, and 172.16.x.x–172.31.x.x are reserved private address ranges, which is why 192.168.1.10 is such a common address on home routers.',
    'IPv4 has only about 4.3 billion possible addresses, which is why IPv6 (128-bit addresses) exists — but IPv4 remains dominant in most home/office networks.',
  ],
  complexity: 'Converting between decimal and binary, and computing the network/host split, are all O(1) — fixed 32-bit arithmetic regardless of network size.',
  realWorld: 'Configuring a home router, setting up a static IP on a server, or reading a `ping`/`ipconfig`/`ifconfig` output all require exactly this decimal ↔ binary, network/host understanding.',
}
