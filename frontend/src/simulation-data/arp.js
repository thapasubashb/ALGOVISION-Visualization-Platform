const HOSTS = [
  { id: 'A', ip: '192.168.1.10', mac: 'AA:AA:AA:AA:AA:AA' },
  { id: 'B', ip: '192.168.1.20', mac: 'BB:BB:BB:BB:BB:BB' },
  { id: 'C', ip: '192.168.1.30', mac: 'CC:CC:CC:CC:CC:CC' },
]

export const ARP_HOSTS = HOSTS

export function buildArpSteps() {
  const steps = []

  steps.push({
    title: 'PC A wants to talk to 192.168.1.20',
    explanation: 'PC A knows the IP address it wants to reach (192.168.1.20) but not the MAC address — and on a local network, frames are addressed by MAC, not IP. PC A checks its ARP cache first and finds nothing.',
    state: { phase: 'intro', broadcasting: false, replying: false, cache: {}, highlightHost: null },
  })

  steps.push({
    title: "PC A broadcasts: \"Who has 192.168.1.20?\"",
    explanation: 'PC A sends an ARP request as a broadcast — addressed to every host on the local network, not just one. The message asks: "Whoever owns 192.168.1.20, please tell me your MAC address."',
    state: { phase: 'broadcast', broadcasting: true, replying: false, cache: {}, highlightHost: null },
  })

  steps.push({
    title: 'Every host receives the broadcast',
    explanation: 'Both PC B and PC C receive the broadcast frame (that\'s what "broadcast" means — everyone gets it). Each one checks: "is this IP address mine?"',
    state: { phase: 'received', broadcasting: false, replying: false, cache: {}, highlightHost: null },
  })

  steps.push({
    title: 'PC C ignores it — not addressed to it',
    explanation: '192.168.1.20 is not PC C\'s address, so PC C silently discards the request. It doesn\'t reply — only the actual owner of the requested IP responds to an ARP request.',
    state: { phase: 'ignore', broadcasting: false, replying: false, cache: {}, highlightHost: 'C' },
  })

  steps.push({
    title: 'PC B recognizes its own IP and replies',
    explanation: '192.168.1.20 belongs to PC B, so PC B sends a unicast reply — directly back to PC A only, not broadcast this time — containing its MAC address: BB:BB:BB:BB:BB:BB.',
    state: { phase: 'reply', broadcasting: false, replying: true, cache: {}, highlightHost: 'B' },
  })

  steps.push({
    title: "PC A updates its ARP cache",
    explanation: 'PC A receives the reply and stores the mapping (192.168.1.20 → BB:BB:BB:BB:BB:BB) in its ARP cache. Now it can address frames directly to PC B\'s MAC without repeating this broadcast.',
    state: { phase: 'cached', broadcasting: false, replying: false, cache: { '192.168.1.20': 'BB:BB:BB:BB:BB:BB' }, highlightHost: 'B' },
  })

  steps.push({
    title: 'Next time, no broadcast needed',
    explanation: 'If PC A wants to talk to 192.168.1.20 again soon, it checks the cache first, finds the MAC address already there, and skips the broadcast entirely — cache entries typically expire after a few minutes to stay accurate.',
    state: { phase: 'done', broadcasting: false, replying: false, cache: { '192.168.1.20': 'BB:BB:BB:BB:BB:BB' }, highlightHost: null },
  })

  return steps
}

export const arpNotes = {
  what: 'ARP (Address Resolution Protocol) maps a known IP address to the unknown MAC (hardware) address of the device that owns it, on a local network.',
  why: 'IP addresses are logical and used for routing across networks, but the actual hardware (Ethernet/Wi-Fi) delivers frames using MAC addresses. Before a device can send a frame to a given IP on its local network, it must first learn that IP\'s corresponding MAC address.',
  how: 'The requesting device broadcasts an ARP request ("who has this IP?") to every device on the local network. Only the device that owns that IP replies, directly (unicast), with its MAC address. The requester caches this mapping for future use.',
  observe: 'Notice the asymmetry: the request is a broadcast (everyone hears it), but the reply is a unicast (only the original requester hears it) — and only the actual owner of the IP responds at all.',
  outcome: "PC A's ARP cache now has a fresh entry mapping 192.168.1.20 to PC B's MAC address, letting future frames skip the broadcast step.",
  points: [
    'ARP only works within a single local network (a broadcast domain) — it can\'t resolve an IP address on a different network. That\'s the router\'s job.',
    'ARP cache entries expire after a timeout (commonly a few minutes) so the cache stays accurate as devices change or leave the network.',
    'ARP spoofing (a malicious host claiming to own someone else\'s IP) is a real security concern, since ARP has no built-in authentication.',
  ],
  complexity: 'A cache hit is O(1). A cache miss costs one broadcast round-trip, regardless of how many hosts are on the network (everyone processes it in parallel).',
  realWorld: 'Every device on your home Wi-Fi resolves your router\'s IP to its MAC address via ARP the moment it joins the network — you can see these entries yourself with the `arp -a` command.',
}
