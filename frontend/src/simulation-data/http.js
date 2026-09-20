export function buildHttpSteps(secure) {
  const steps = []

  steps.push({
    title: 'Browser wants to load a page',
    explanation: `The browser needs to fetch https${secure ? '' : ''}://example.com/. Several things need to happen before a single byte of the actual page arrives.`,
    state: { phase: 'intro', activeStep: -1, encrypted: false },
  })

  steps.push({
    title: 'Step 1 — DNS resolution',
    explanation: 'The browser resolves example.com to an IP address (see the DNS Resolution topic for the full breakdown of this step).',
    state: { phase: 'dns', activeStep: 0, encrypted: false },
  })

  steps.push({
    title: 'Step 2 — TCP connection',
    explanation: 'The browser opens a TCP connection to the server\'s IP on port 80 (HTTP) or 443 (HTTPS), using the 3-way handshake (see the TCP 3-Way Handshake topic).',
    state: { phase: 'tcp', activeStep: 1, encrypted: false },
  })

  if (secure) {
    steps.push({
      title: 'Step 3 — TLS handshake (HTTPS only)',
      explanation: 'Before any HTTP data is sent, the browser and server perform a TLS handshake: they agree on encryption algorithms and exchange keys, so everything from this point on is encrypted. This step doesn\'t exist for plain HTTP.',
      state: { phase: 'tls', activeStep: 2, encrypted: true },
    })
  }

  steps.push({
    title: `Step ${secure ? 4 : 3} — Browser sends the HTTP request`,
    explanation: secure
      ? 'The browser sends "GET / HTTP/1.1" along with headers (Host, User-Agent, Cookie, etc). Because TLS is active, this entire request is encrypted before it leaves the browser — anyone intercepting it sees only ciphertext.'
      : 'The browser sends "GET / HTTP/1.1" along with headers (Host, User-Agent, Cookie, etc), in plain text. Anyone able to observe the network traffic — an ISP, a shared Wi-Fi network, a proxy — can read this request exactly as sent.',
    state: { phase: 'request', activeStep: secure ? 3 : 2, encrypted: secure },
  })

  steps.push({
    title: `Step ${secure ? 5 : 4} — Server processes the request`,
    explanation: 'The web server reads the request, decides what to do (serve a file, run application code, query a database) and prepares a response.',
    state: { phase: 'server', activeStep: secure ? 4 : 3, encrypted: secure },
  })

  steps.push({
    title: `Step ${secure ? 6 : 5} — Server sends the HTTP response`,
    explanation: secure
      ? 'The server replies with "HTTP/1.1 200 OK", headers, and the page content — all encrypted over the same TLS connection.'
      : 'The server replies with "HTTP/1.1 200 OK", headers, and the page content, again in plain text.',
    state: { phase: 'response', activeStep: secure ? 5 : 4, encrypted: secure },
  })

  steps.push({
    title: 'Page rendered',
    explanation: secure
      ? 'The browser receives and decrypts the response, then renders the page. The padlock icon in the address bar reflects that this entire exchange was encrypted end-to-end.'
      : 'The browser receives and renders the page. Without encryption, anything sensitive sent along the way (cookies, form data, passwords) was exposed to anyone who could observe the connection.',
    state: { phase: 'done', activeStep: -1, encrypted: secure },
  })

  return steps
}

export const httpNotes = {
  what: 'HTTP (HyperText Transfer Protocol) is the request/response protocol browsers and servers use to exchange web content. HTTPS is HTTP layered on top of TLS encryption.',
  why: 'Plain HTTP sends everything — including passwords, cookies, and form data — as readable text over the network. HTTPS adds a TLS handshake that encrypts the entire exchange, protecting it from eavesdroppers on the network path.',
  how: 'Both start with DNS resolution and a TCP connection. HTTPS inserts one extra step — a TLS handshake — before any HTTP data is exchanged. After that, both protocols follow the same request → server processing → response pattern, just with HTTPS encrypting every byte.',
  observe: 'Toggle between HTTP and HTTPS and watch for the extra TLS handshake step, and notice which steps turn into a "locked" (encrypted) visual once TLS is active.',
  outcome: 'Both modes render the same page in the browser — but HTTPS protects everything exchanged along the way from network eavesdroppers, at the cost of one extra round trip during the TLS handshake.',
  points: [
    'HTTPS uses port 443 by default; plain HTTP uses port 80.',
    'The TLS handshake overhead is a one-time cost per connection — modern browsers and servers reuse (keep-alive) connections to amortize it across many requests.',
    'A padlock icon means the connection is encrypted — it does NOT guarantee the site itself is trustworthy, only that the data in transit can\'t be read by a third party.',
  ],
  complexity: 'The TLS handshake adds roughly one extra round trip (TLS 1.3) compared to plain HTTP\'s TCP handshake alone — a small, fixed, one-time cost per new connection.',
  realWorld: 'Modern browsers actively warn users ("Not Secure") when a site uses plain HTTP, and most of the web has moved to HTTPS by default — this exact difference is why.',
}
