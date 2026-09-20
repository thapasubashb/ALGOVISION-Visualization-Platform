import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor } from 'lucide-react'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildArpSteps, ARP_HOSTS, arpNotes } from '../../simulation-data/arp'

function HostBox({ host, highlight, sourceOfBroadcast, ignoring }) {
  return (
    <motion.div
      animate={{ scale: highlight ? 1.08 : 1 }}
      className={`flex flex-col items-center gap-1 w-24 px-2 py-3 rounded-xl border-2 ${
        highlight === 'B' ? 'border-teal-400 bg-teal-50 av-glow-success' : ignoring ? 'border-slate-200 bg-slate-50 opacity-60' : sourceOfBroadcast ? 'border-blue-400 bg-blue-50 av-glow' : 'border-slate-200 bg-white'
      }`}
    >
      <Monitor size={22} className="text-slate-500" />
      <p className="text-xs font-bold text-slate-700">PC {host.id}</p>
      <p className="text-[9px] text-slate-400">{host.ip}</p>
      <p className="text-[9px] text-slate-400 font-mono">{host.mac.slice(0, 8)}…</p>
    </motion.div>
  )
}

function ArpVisualizer() {
  const steps = useMemo(() => buildArpSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="ARP — Address Resolution Protocol"
        subtitle="PC A resolves 192.168.1.20 to a MAC address via broadcast"
        engine={engine}
        legend={[
          { label: 'Broadcasting', color: 'bg-blue-400' },
          { label: 'Owner (replies)', color: 'bg-teal-400' },
        ]}
        canvas={
          <div className="min-w-[440px] flex flex-col items-center gap-6 py-4">
            <div className="flex justify-center gap-8">
              <HostBox host={{ id: 'A', ip: '192.168.1.10', mac: 'AA:AA:AA:AA:AA:AA' }} sourceOfBroadcast={state.broadcasting} />
              <div className="flex flex-col justify-center items-center gap-2">
                {ARP_HOSTS.filter((h) => h.id !== 'A').map((h) => (
                  <HostBox key={h.id} host={h} highlight={state.highlightHost} ignoring={state.phase === 'ignore' && h.id === 'C'} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {state.phase === 'broadcast' && (
                <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <StatusBadge tone="info">Broadcasting: "Who has 192.168.1.20?"</StatusBadge>
                </motion.div>
              )}
              {state.phase === 'reply' && (
                <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <StatusBadge tone="success">PC B replies: "192.168.1.20 is at BB:BB:BB:BB:BB:BB"</StatusBadge>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full max-w-xs bg-slate-50 rounded-lg border border-slate-100 p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">PC A's ARP cache</p>
              {Object.keys(state.cache).length === 0 ? (
                <p className="text-xs text-slate-400 italic">empty</p>
              ) : (
                Object.entries(state.cache).map(([ip, mac]) => (
                  <p key={ip} className="text-xs text-slate-600 font-mono">{ip} → {mac}</p>
                ))
              )}
            </div>
          </div>
        }
      />
      <TopicNotes notes={arpNotes} />
    </>
  )
}

export default ArpVisualizer
