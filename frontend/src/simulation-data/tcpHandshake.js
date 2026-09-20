// Builds the full step-by-step state for the TCP 3-way handshake simulation.
// Each step drives both the animated client/server diagram and the
// synced explanation panel.

export function buildTcpHandshakeSteps() {
  const steps = []

  steps.push({
    title: 'Initial state — both sides closed',
    explanation:
      "Before any connection exists, both the client and the server sockets are in the CLOSED state. No sequence numbers have been chosen yet, and no packets have been exchanged. This is the starting point every TCP connection begins from.",
    state: { client: 'CLOSED', server: 'CLOSED', packet: null, log: [] },
  })

  steps.push({
    title: 'Server starts listening',
    explanation:
      "The server application calls listen() on its socket, moving it into the LISTEN state. It is now passively waiting for incoming connection requests on its port, but it has not yet talked to any specific client.",
    state: { client: 'CLOSED', server: 'LISTEN', packet: null, log: [] },
  })

  steps.push({
    title: 'Client sends SYN',
    explanation:
      'The client picks an initial sequence number (ISN), here x = 1000, and sends a segment with the SYN flag set. This says "I want to open a connection, and my byte stream will start counting from sequence number 1000." The client moves into the SYN-SENT state while it waits for a reply.',
    state: {
      client: 'SYN-SENT',
      server: 'LISTEN',
      packet: { dir: 'toServer', flags: 'SYN', seq: 'seq=1000', ack: null },
      log: ['Client → Server: SYN, seq=1000'],
    },
  })

  steps.push({
    title: 'Server receives SYN',
    explanation:
      'The server receives the SYN segment. It now knows the client wants to connect and what sequence number the client will start from. It allocates connection state for this client and prepares its own reply.',
    state: {
      client: 'SYN-SENT',
      server: 'LISTEN',
      packet: null,
      log: ['Client → Server: SYN, seq=1000'],
      highlightServer: true,
    },
  })

  steps.push({
    title: 'Server replies with SYN-ACK',
    explanation:
      'The server responds with a single segment that does two jobs at once. The ACK flag with ack=1001 acknowledges the client\'s SYN (client seq + 1). The SYN flag with seq=2000 is the server proposing its own initial sequence number. The server moves to SYN-RECEIVED.',
    state: {
      client: 'SYN-SENT',
      server: 'SYN-RECEIVED',
      packet: { dir: 'toClient', flags: 'SYN, ACK', seq: 'seq=2000', ack: 'ack=1001' },
      log: ['Client → Server: SYN, seq=1000', 'Server → Client: SYN+ACK, seq=2000, ack=1001'],
    },
  })

  steps.push({
    title: 'Client receives SYN-ACK',
    explanation:
      "The client receives the server's SYN-ACK. Its own SYN has been acknowledged, so it already knows the connection will succeed. It also now knows the server's starting sequence number, 2000, so it can correctly acknowledge future data from the server.",
    state: {
      client: 'SYN-SENT',
      server: 'SYN-RECEIVED',
      packet: null,
      log: ['Client → Server: SYN, seq=1000', 'Server → Client: SYN+ACK, seq=2000, ack=1001'],
      highlightClient: true,
    },
  })

  steps.push({
    title: 'Client sends final ACK',
    explanation:
      "The client sends an ACK with ack=2001, acknowledging the server's SYN (server seq + 1). This is the third segment of the handshake. As soon as it's sent, the client considers the connection ESTABLISHED — it doesn't need to wait for any reply to this ACK.",
    state: {
      client: 'ESTABLISHED',
      server: 'SYN-RECEIVED',
      packet: { dir: 'toServer', flags: 'ACK', seq: 'seq=1001', ack: 'ack=2001' },
      log: [
        'Client → Server: SYN, seq=1000',
        'Server → Client: SYN+ACK, seq=2000, ack=1001',
        'Client → Server: ACK, ack=2001',
      ],
    },
  })

  steps.push({
    title: 'Server receives ACK — connection established',
    explanation:
      'The server receives the final ACK and also moves to ESTABLISHED. Both sides now agree on each other\'s starting sequence numbers, and the reliable, full-duplex TCP connection is fully open in both directions.',
    state: {
      client: 'ESTABLISHED',
      server: 'ESTABLISHED',
      packet: null,
      log: [
        'Client → Server: SYN, seq=1000',
        'Server → Client: SYN+ACK, seq=2000, ack=1001',
        'Client → Server: ACK, ack=2001',
      ],
      highlightServer: true,
    },
  })

  steps.push({
    title: 'Data transfer can now begin',
    explanation:
      'With the handshake complete, both the client and server can send application data (like an HTTP request and response) over this connection. Every following byte is tracked using the sequence and acknowledgment numbers established here — that\'s how TCP guarantees data arrives in order and without loss.',
    state: {
      client: 'ESTABLISHED',
      server: 'ESTABLISHED',
      packet: { dir: 'toServer', flags: 'PSH, ACK', seq: 'seq=1001', ack: 'ack=2001', dataFlow: true },
      log: [
        'Client → Server: SYN, seq=1000',
        'Server → Client: SYN+ACK, seq=2000, ack=1001',
        'Client → Server: ACK, ack=2001',
        'Client → Server: data begins flowing...',
      ],
    },
  })

  return steps
}

export const tcpHandshakeNotes = {
  what: 'The TCP 3-way handshake is the sequence of three segments (SYN, SYN-ACK, ACK) that two hosts exchange to open a reliable, connection-oriented TCP session before any application data is sent.',
  why: 'TCP promises reliable, in-order, duplicate-free delivery. To keep that promise both ends must first agree on starting sequence numbers and confirm that each side can actually hear the other — the handshake establishes that shared state.',
  how: 'The client sends a SYN with its initial sequence number. The server replies with a single segment carrying both SYN (its own sequence number) and ACK (acknowledging the client). The client finally sends an ACK for the server\'s sequence number, and both sides move to ESTABLISHED.',
  observe: 'Watch the state label under each box change (CLOSED → SYN-SENT/LISTEN → SYN-RECEIVED → ESTABLISHED) exactly as each packet arrives, not before — a state only changes once the corresponding segment has actually been received.',
  outcome: 'Both client and server end in the ESTABLISHED state, each aware of the other\'s starting sequence number, ready to exchange data reliably.',
  points: [
    'The SYN-ACK is one segment doing two jobs — acknowledging the client and proposing the server\'s own sequence number.',
    'The final ACK needs no reply of its own, which is why the client can consider the connection open one step before the server does.',
    'Sequence numbers here are simplified round numbers; real TCP picks a randomized initial sequence number (ISN) for security.',
  ],
  complexity: 'The handshake always takes exactly 3 segments and roughly 1.5 round trips, regardless of how much data will eventually be sent — this fixed cost is why protocols like TLS 1.3 and QUIC try to reduce or overlap it.',
  realWorld: 'Every HTTP(S) request, SSH session, and database connection over TCP starts with this exact exchange. Tools like Wireshark show these same three packets at the start of any TCP stream capture.',
}
