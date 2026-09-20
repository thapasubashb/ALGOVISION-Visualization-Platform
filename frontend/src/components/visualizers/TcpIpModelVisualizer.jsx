import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { TCPIP_LAYERS, buildTcpIpSteps, tcpIpNotes } from '../../simulation-data/tcpIpModel'

function TcpIpModelVisualizer() {
  const steps = useMemo(() => buildTcpIpSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="TCP/IP Model"
        subtitle="4 layers that power the real internet, mapped against OSI's 7"
        engine={engine}
        legend={TCPIP_LAYERS.map((l) => ({ label: l.name, color: l.color }))}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-3 py-2">
            {TCPIP_LAYERS.map((layer, i) => {
              const isActive = i === state.activeIndex
              const wrapped = state.wrappers.some((w) => w.name === layer.name)
              return (
                <motion.div
                  key={layer.name}
                  layout
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 transition-colors ${
                    isActive ? 'border-blue-400 bg-blue-50 av-glow' : wrapped ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full shrink-0 ${layer.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{layer.name}</p>
                    <p className="text-[11px] text-slate-400">OSI: {layer.maps.join(' + ')}</p>
                  </div>
                  <AnimatePresence>
                    {wrapped && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-1">
                        {layer.maps.map((m) => (
                          <span key={m} className="text-[9px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{m}</span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        }
      />
      <TopicNotes notes={tcpIpNotes} />
    </>
  )
}

export default TcpIpModelVisualizer
