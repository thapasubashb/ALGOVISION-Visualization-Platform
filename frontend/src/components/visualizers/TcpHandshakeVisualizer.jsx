import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server as ServerIcon, Monitor } from 'lucide-react'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildTcpHandshakeSteps, tcpHandshakeNotes } from '../../simulation-data/tcpHandshake'

const STATE_TONE = {
  CLOSED: 'default',
  LISTEN: 'info',
  'SYN-SENT': 'warning',
  'SYN-RECEIVED': 'warning',
  ESTABLISHED: 'success',
}

function Host({ icon: Icon, name, state, highlight }) {
  return (
    <motion.div
      animate={highlight ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-2 w-32 sm:w-40"
    >
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2 transition-colors ${
        state === 'ESTABLISHED' ? 'bg-teal-50 border-teal-300 av-glow-success' : 'bg-white border-slate-200'
      }`}>
        <Icon size={30} className={state === 'ESTABLISHED' ? 'text-teal-600' : 'text-slate-500'} />
      </div>
      <p className="text-sm font-bold text-slate-700">{name}</p>
      <StatusBadge tone={STATE_TONE[state] || 'default'}>{state}</StatusBadge>
    </motion.div>
  )
}

function PacketFlight({ packet, stepIndex }) {
  if (!packet) return null
  const toServer = packet.dir === 'toServer'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{ left: toServer ? '14%' : '86%', opacity: 0 }}
        animate={{ left: toServer ? '86%' : '14%', opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ left: toServer ? '14%' : '86%' }}
      >
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap av-glow ${
          packet.dataFlow ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {packet.flags}
          <span className="ml-1.5 font-normal opacity-90">
            {[packet.seq, packet.ack].filter(Boolean).join(', ')}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function TcpHandshakeVisualizer() {
  const steps = useMemo(() => buildTcpHandshakeSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="TCP 3-Way Handshake"
        subtitle="How a client and server establish a reliable connection before exchanging data"
        engine={engine}
        legend={[
          { label: 'SYN', color: 'bg-blue-600' },
          { label: 'Data', color: 'bg-indigo-600' },
          { label: 'Established', color: 'bg-teal-500' },
        ]}
        canvas={
          <div className="relative flex items-center justify-between px-4 sm:px-10 py-8 min-w-[420px]" style={{ minHeight: 180 }}>
            <Host icon={Monitor} name="Client" state={state.client} highlight={state.highlightClient} />
            <div className="absolute left-[28%] right-[28%] top-1/2 h-0.5 bg-slate-200" />
            <PacketFlight packet={state.packet} stepIndex={engine.currentIndex} />
            <Host icon={ServerIcon} name="Server" state={state.server} highlight={state.highlightServer} />
          </div>
        }
        footnote="Sequence numbers are simplified round numbers for clarity — real TCP randomizes the initial sequence number."
      />
      <TopicNotes notes={tcpHandshakeNotes} />
    </>
  )
}

export default TcpHandshakeVisualizer
