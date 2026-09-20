import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildHttpSteps, httpNotes } from '../../simulation-data/http'

const PHASE_LABELS = {
  dns: 'DNS lookup',
  tcp: 'TCP connect',
  tls: 'TLS handshake',
  request: 'HTTP request',
  server: 'Server processing',
  response: 'HTTP response',
}

function HttpVisualizer() {
  const [secure, setSecure] = useState(true)
  const steps = useMemo(() => buildHttpSteps(secure), [secure])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const order = secure ? ['dns', 'tcp', 'tls', 'request', 'server', 'response'] : ['dns', 'tcp', 'request', 'server', 'response']

  return (
    <>
      <VisualizationShell
        title="HTTP / HTTPS"
        subtitle="From DNS lookup to a rendered page — with and without TLS encryption"
        engine={engine}
        legend={[
          { label: 'Current step', color: 'bg-blue-400' },
          { label: 'Encrypted (HTTPS)', color: 'bg-teal-400' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col items-center gap-5 py-2">
            <div className="flex gap-2">
              <button
                onClick={() => setSecure(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full ${!secure ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                HTTP
              </button>
              <button
                onClick={() => setSecure(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full ${secure ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                HTTPS
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {order.map((phase) => {
                const isActive = state.phase === phase
                return (
                  <motion.div
                    key={phase}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    className={`flex flex-col items-center justify-center w-24 h-16 rounded-lg border-2 text-[10px] font-bold text-center px-1 ${
                      isActive ? (state.encrypted ? 'border-teal-400 bg-teal-50 text-teal-700 av-glow-success' : 'border-blue-400 bg-blue-50 text-blue-700 av-glow') : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    {isActive && (state.encrypted ? <Lock size={12} className="mb-0.5" /> : <Unlock size={12} className="mb-0.5" />)}
                    {PHASE_LABELS[phase]}
                  </motion.div>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              {(state.phase === 'request' || state.phase === 'response') && (
                <motion.div
                  key={state.phase}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-xs px-4 py-2 rounded-lg ${state.encrypted ? 'bg-teal-900 text-teal-200' : 'bg-slate-800 text-rose-300'}`}
                >
                  {state.encrypted
                    ? (state.phase === 'request' ? '🔒 8f3a9c...encrypted...4b1e' : '🔒 2d7f01...encrypted...9a3c')
                    : (state.phase === 'request' ? 'GET / HTTP/1.1 — readable by anyone on the network' : 'HTTP/1.1 200 OK — readable by anyone on the network')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
        footnote="Toggling HTTP/HTTPS resets the simulation."
      />
      <TopicNotes notes={httpNotes} />
    </>
  )
}

export default HttpVisualizer
