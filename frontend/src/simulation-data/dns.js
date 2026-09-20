const CHAIN = ['Browser', 'Resolver', 'Root DNS', 'TLD DNS (.com)', 'Authoritative DNS']
const DOMAIN = 'www.example.com'
const RESULT_IP = '93.184.216.34'

export function buildDnsSteps() {
  const steps = []

  steps.push({
    title: `Resolving ${DOMAIN}`,
    explanation: `Before your browser can connect to ${DOMAIN}, it needs to know its IP address. DNS is the system that translates human-readable domain names into IP addresses.`,
    state: { mode: 'uncached', activeIndex: -1, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'Browser asks the DNS resolver',
    explanation: 'The browser sends the query to a DNS resolver (usually run by your ISP or a public service like 8.8.8.8). The resolver will do the actual chain of lookups on the browser\'s behalf.',
    state: { mode: 'uncached', activeIndex: 1, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'Resolver asks a Root DNS server',
    explanation: `The resolver doesn't know ${DOMAIN} yet, so it starts at the top: a Root DNS server. Root servers don't know the final IP — they only know which server handles the ".com" domains, and point the resolver there.`,
    state: { mode: 'uncached', activeIndex: 2, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'Resolver asks the .com TLD DNS server',
    explanation: 'The TLD (Top-Level Domain) server for .com doesn\'t know the final IP either — but it knows which Authoritative server is responsible for example.com specifically, and points the resolver there.',
    state: { mode: 'uncached', activeIndex: 3, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'Resolver asks the Authoritative DNS server',
    explanation: `This server actually owns the DNS records for example.com and can answer directly: "${DOMAIN} is at ${RESULT_IP}."`,
    state: { mode: 'uncached', activeIndex: 4, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'The answer travels back to the browser',
    explanation: `The IP address ${RESULT_IP} travels back up the chain to the resolver, which caches it and returns it to the browser. Only now can the browser open a TCP connection to the actual web server.`,
    state: { mode: 'uncached', activeIndex: -1, direction: 'up', resolvedIp: RESULT_IP, cached: false },
  })

  steps.push({
    title: 'Second visit — with the resolver\'s cache warm',
    explanation: `Suppose you visit ${DOMAIN} again a minute later. The resolver already has this answer cached from before (DNS records include a TTL — time-to-live — telling the resolver how long it's safe to reuse the answer).`,
    state: { mode: 'cached', activeIndex: 1, direction: 'down', resolvedIp: null, cached: false },
  })

  steps.push({
    title: 'Resolver answers instantly from cache',
    explanation: `Instead of the full 4-hop chain (Root → TLD → Authoritative), the resolver returns ${RESULT_IP} immediately from its cache. This is why repeat visits to the same site feel snappier — DNS resolution is essentially free the second time.`,
    state: { mode: 'cached', activeIndex: -1, direction: 'up', resolvedIp: RESULT_IP, cached: true },
  })

  return steps
}

export const dnsChain = CHAIN
export const dnsDomain = DOMAIN

export const dnsNotes = {
  what: 'DNS (Domain Name System) is the hierarchical, distributed system that translates human-readable domain names (like www.example.com) into the IP addresses computers actually use to connect.',
  why: 'IP addresses are hard to remember and can change over time. DNS lets services keep a stable, memorable name while the underlying IP address (and even server infrastructure) changes freely behind the scenes.',
  how: 'A resolver walks a hierarchy: Root DNS servers know only which server handles each top-level domain (.com, .org, etc); TLD servers know which server is authoritative for a specific domain; the Authoritative server holds the actual records and gives the final answer.',
  observe: 'Compare the two runs — count how many hops the uncached lookup takes versus the cached one, and notice the cached answer skips straight from Resolver to Browser.',
  outcome: `Both lookups end with the browser learning ${RESULT_IP}, but the cached lookup gets there in a fraction of the steps.`,
  points: [
    'Every DNS record has a TTL (time-to-live) that controls how long resolvers are allowed to cache it before checking again.',
    'The "Root → TLD → Authoritative" chain is why DNS scales globally — no single server needs to know every domain in the world.',
    'DNS caching happens at multiple levels — your browser, your OS, your router, and your ISP\'s resolver can all cache the same answer independently.',
  ],
  complexity: 'An uncached lookup takes a small constant number of hops (typically 3–4) regardless of how many domains exist worldwide, thanks to the hierarchical structure — it\'s effectively O(1) in practice, not O(n) over all domains.',
  realWorld: 'Every single web address you\'ve ever typed into a browser triggered a DNS resolution like this one before your browser could load anything.',
}
