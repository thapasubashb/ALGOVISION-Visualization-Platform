import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildSubnettingSteps, subnettingNotes } from '../../simulation-data/subnetting'

function SubnetCard({ subnet, highlighted }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: highlighted ? 1.03 : 1 }}
      className={`bg-white rounded-lg border-2 p-3 w-full sm:w-56 ${highlighted ? 'border-blue-400 av-glow' : 'border-slate-200'}`}
    >
      <p className="text-xs font-bold text-slate-700 mb-1">Subnet {subnet.index}</p>
      <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
        <p>Network: <span className="text-slate-800 font-bold">{subnet.network}</span></p>
        <p>Usable: {subnet.firstUsable} – {subnet.lastUsable}</p>
        <p>Broadcast: {subnet.broadcast}</p>
      </div>
      <p className="text-[10px] text-slate-400 mt-1">{subnet.usableCount} usable hosts</p>
    </motion.div>
  )
}

function SubnettingVisualizer() {
  const steps = useMemo(() => buildSubnettingSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Subnetting"
        subtitle="192.168.1.0/24 split into 4 subnets of /26 each"
        engine={engine}
        legend={[{ label: 'Subnet ID bits (borrowed)', color: 'bg-blue-400' }, { label: 'Host bits', color: 'bg-slate-300' }]}
        canvas={
          <div className="min-w-[480px] flex flex-col items-center gap-5 py-2">
            {state.showBits && (
              <div className="flex gap-1 font-mono text-sm">
                {'00000000'.split('').map((_, i) => (
                  <span key={i} className={`w-6 h-8 flex items-center justify-center rounded ${i < 2 ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                    {i < 2 ? 'S' : 'H'}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center w-full">
              <AnimatePresence>
                {state.revealedSubnets.map((s) => (
                  <SubnetCard key={s.index} subnet={s} highlighted={state.highlightIndex === s.index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        }
      />
      <TopicNotes notes={subnettingNotes} />
    </>
  )
}

export default SubnettingVisualizer
