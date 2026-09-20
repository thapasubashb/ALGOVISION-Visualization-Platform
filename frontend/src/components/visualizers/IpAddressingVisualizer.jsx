import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildIpAddressingSteps, ipOctets, ipPrefix, toBinary, ipAddressingNotes } from '../../simulation-data/ipAddressing'

function OctetBlock({ value, revealed, binary, showBinary, active, networkPart }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.06 : 1 }}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 ${
        active ? 'border-blue-400 bg-blue-50 av-glow' : revealed ? (networkPart ? 'border-indigo-200 bg-indigo-50' : 'border-emerald-200 bg-emerald-50') : 'border-slate-100 bg-slate-50 opacity-40'
      }`}
    >
      <span className="text-lg font-bold text-slate-800">{revealed ? value : '?'}</span>
      <AnimatePresence>
        {showBinary && revealed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-mono text-slate-500 flex gap-0.5">
            {binary.split('').map((bit, i) => <span key={i}>{bit}</span>)}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function IpAddressingVisualizer() {
  const steps = useMemo(() => buildIpAddressingSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const networkOctets = Math.floor(ipPrefix / 8)

  return (
    <>
      <VisualizationShell
        title="IP Addressing"
        subtitle={`${ipOctets.join('.')} /${ipPrefix} — decimal to binary, and the network/host split`}
        engine={engine}
        legend={[
          { label: 'Network portion', color: 'bg-indigo-400' },
          { label: 'Host portion', color: 'bg-emerald-400' },
        ]}
        canvas={
          <div className="min-w-[440px] flex flex-col items-center gap-5 py-2">
            <div className="flex gap-3">
              {ipOctets.map((val, i) => (
                <OctetBlock
                  key={i}
                  value={val}
                  revealed={state.revealedOctets.includes(val) && i < state.revealedOctets.length}
                  binary={toBinary(val)}
                  showBinary={state.showBinary}
                  active={state.activeOctet === i}
                  networkPart={state.splitShown && i < networkOctets}
                />
              ))}
            </div>

            <AnimatePresence>
              {state.splitShown && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 text-xs font-semibold">
                  <span className="text-indigo-600">← Network ({ipPrefix} bits) →</span>
                  <span className="text-emerald-600">← Host ({32 - ipPrefix} bits) →</span>
                </motion.div>
              )}
            </AnimatePresence>

            {state.final && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 rounded-lg px-4 py-2 text-xs text-slate-600 text-center max-w-sm">
                Network address: <strong>192.168.1.0</strong> &nbsp;•&nbsp; This host: <strong>#10</strong>
              </motion.div>
            )}
          </div>
        }
      />
      <TopicNotes notes={ipAddressingNotes} />
    </>
  )
}

export default IpAddressingVisualizer
