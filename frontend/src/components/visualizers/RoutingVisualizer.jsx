import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Router, Monitor } from 'lucide-react'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildRoutingSteps, routingNodes, routingTables, routingNotes } from '../../simulation-data/routing'

function NodeIcon({ label, active }) {
  const isHost = label.startsWith('Host')
  return (
    <motion.div
      animate={{ scale: active ? 1.12 : 1 }}
      className={`flex flex-col items-center gap-1 w-20 shrink-0 ${active ? '' : 'opacity-70'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${active ? 'border-blue-400 bg-blue-50 av-glow' : 'border-slate-200 bg-white'}`}>
        {isHost ? <Monitor size={20} className="text-slate-500" /> : <Router size={20} className="text-slate-500" />}
      </div>
      <p className="text-[10px] font-bold text-slate-600 text-center leading-tight">{label}</p>
    </motion.div>
  )
}

function RoutingVisualizer() {
  const steps = useMemo(() => buildRoutingSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Routing"
        subtitle="A packet hops Host A → Router 1 → Router 2 → Router 3 → Host B"
        engine={engine}
        legend={[{ label: 'Packet currently here', color: 'bg-blue-400' }]}
        canvas={
          <div className="min-w-[520px] flex flex-col items-center gap-5 py-2">
            <div className="flex items-center justify-between w-full max-w-lg">
              {routingNodes.map((node, i) => (
                <div key={node} className="flex items-center flex-1">
                  <NodeIcon label={node} active={state.hop === i} />
                  {i < routingNodes.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 mx-1" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {state.lookupRouter && (
                <motion.div
                  key={state.lookupRouter + state.highlightRow}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden w-full max-w-sm"
                >
                  <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">{state.lookupRouter}'s routing table</div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-400">
                        <th className="px-3 py-1.5 font-semibold">Destination</th>
                        <th className="px-3 py-1.5 font-semibold">Next hop</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routingTables[state.lookupRouter].map((row, i) => (
                        <tr key={row.dest} className={`border-t ${state.highlightRow === i ? 'bg-blue-50' : ''}`}>
                          <td className={`px-3 py-1.5 ${state.highlightRow === i ? 'font-bold text-blue-700' : 'text-slate-600'}`}>{row.dest}</td>
                          <td className={`px-3 py-1.5 ${state.highlightRow === i ? 'font-bold text-blue-700' : 'text-slate-600'}`}>{row.nextHop}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={routingNotes} />
    </>
  )
}

export default RoutingVisualizer
