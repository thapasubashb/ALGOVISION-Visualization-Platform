// Splits 192.168.1.0/24 into four /26 subnets, showing the binary math
// behind network address, broadcast address, and usable host range.

function ipFromParts(o1, o2, o3, o4) {
  return `${o1}.${o2}.${o3}.${o4}`
}

function toBinaryByte(n) {
  return n.toString(2).padStart(8, '0')
}

const BASE = [192, 168, 1, 0]
const NEW_PREFIX = 26
const SUBNET_BITS = NEW_PREFIX - 24
const BLOCK_SIZE = 256 / Math.pow(2, SUBNET_BITS)

function buildSubnet(index) {
  const networkLastOctet = index * BLOCK_SIZE
  const broadcastLastOctet = networkLastOctet + BLOCK_SIZE - 1
  return {
    index,
    network: ipFromParts(BASE[0], BASE[1], BASE[2], networkLastOctet),
    broadcast: ipFromParts(BASE[0], BASE[1], BASE[2], broadcastLastOctet),
    firstUsable: ipFromParts(BASE[0], BASE[1], BASE[2], networkLastOctet + 1),
    lastUsable: ipFromParts(BASE[0], BASE[1], BASE[2], broadcastLastOctet - 1),
    usableCount: BLOCK_SIZE - 2,
    binaryLastOctet: toBinaryByte(networkLastOctet),
  }
}

export function buildSubnettingSteps() {
  const steps = []
  const subnets = [0, 1, 2, 3].map(buildSubnet)

  steps.push({
    title: `Starting network: 192.168.1.0/24`,
    explanation: `We have a single /24 network with 256 addresses (192.168.1.0 – 192.168.1.255). We want to split it into 4 smaller, separate subnets — say, for 4 different office floors.`,
    state: { revealedSubnets: [], showBits: false, highlightIndex: -1 },
  })

  steps.push({
    title: `Borrowing 2 bits: /24 → /26`,
    explanation: `To create 4 subnets (2² = 4), we borrow 2 bits from the host portion, moving the prefix from /24 to /26. Those 2 borrowed bits become the "subnet ID," and the remaining 6 bits are still host bits — giving 2⁶ = 64 addresses per subnet.`,
    state: { revealedSubnets: [], showBits: true, highlightIndex: -1 },
  })

  subnets.forEach((s, i) => {
    steps.push({
      title: `Subnet ${i}: last octet = ${s.binaryLastOctet}`,
      explanation: `The 2 subnet-ID bits are set to ${s.binaryLastOctet.slice(0, 2)} (binary for ${i}), and the remaining 6 host bits range from 000000 to 111111. This gives network address ${s.network} through broadcast address ${s.broadcast} — a block of ${BLOCK_SIZE} addresses.`,
      state: { revealedSubnets: subnets.slice(0, i + 1), showBits: true, highlightIndex: i },
    })
  })

  steps.push({
    title: 'All 4 subnets, side by side',
    explanation: `192.168.1.0/24 is now cleanly divided into 4 independent /26 networks, each with ${BLOCK_SIZE - 2} usable host addresses (one address is reserved as the network address, one as the broadcast address, in every subnet).`,
    state: { revealedSubnets: subnets, showBits: true, highlightIndex: -1 },
  })

  return steps
}

export const subnettingNotes = {
  what: 'Subnetting is dividing a single, larger IP network into multiple smaller networks (subnets) by extending the network prefix, borrowing bits from what was previously the host portion.',
  why: 'A flat /24 network puts every device in one broadcast domain, which doesn\'t scale and doesn\'t match how organizations are actually structured (different floors, departments, or security zones). Subnetting creates smaller, isolated, more manageable networks from one address block.',
  how: 'Borrowing n bits from the host portion creates 2ⁿ subnets, each with 2^(remaining host bits) addresses. Each subnet reserves its first address as the network address and its last as the broadcast address — neither is assignable to a host.',
  observe: 'Watch exactly which bits of the last octet change between subnets (the 2 leftmost bits of that octet) while the remaining 6 bits still range across the full 00000000–11111111 span within each subnet.',
  outcome: 'Four independent /26 subnets, each covering exactly 64 addresses (62 usable), carved cleanly out of the original 256-address /24 block.',
  points: [
    'Borrowing more bits creates more, smaller subnets; borrowing fewer bits creates fewer, larger subnets — it\'s a direct tradeoff.',
    'The network address and broadcast address of every subnet are never assignable to a host — that\'s why usable hosts = block size − 2.',
    'CIDR notation (/26) is a compact way of expressing exactly the subnet mask (255.255.255.192 in this case) used in this calculation.',
  ],
  complexity: 'All subnetting math is fixed 32-bit arithmetic — O(1) regardless of network size — though planning which departments get which subnet is a design decision, not a computed one.',
  realWorld: 'Network engineers subnet address blocks constantly — separating a guest Wi-Fi network from an internal office network, or isolating a company\'s different departments, are both classic subnetting use cases.',
}
