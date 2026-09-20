import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { LAYERS, buildOsiSteps, osiNotes } from '../../simulation-data/osiModel'

function LayerRow({ layer, index, activeIndex, wrapped }) {
  const isActive = index === activeIndex
  return (
    <motion.div
      layout
      animate={{ scale: isActive ? 1.03 : 1 }}
      className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-colors ${
        isActive ? 'border-blue-400 bg-blue-50 av-glow' : wrapped ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
      }`}
    >
      <span className="text-xs sm:text-sm font-bold text-slate-700">{index + 1}. {layer.name}</span>
      {wrapped && <span className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />}
    </motion.div>
  )
}

function PacketStack({ wrappers }) {
  return (
    <div className="flex flex-col-reverse items-center">
      <AnimatePresence initial={false}>
        {wrappers.map((l) => (
          <motion.div
            key={l.name}
            layout
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className={`text-[9px] font-bold text-white px-2 py-1 rounded ${l.color}`}
            style={{ marginTop: -2 }}
          >
            {l.name[0]}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">DATA</div>
    </div>
  )
}

function OsiModelVisualizer() {
  const steps = useMemo(() => buildOsiSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const dataUnit = state.wrappers.length > 0 ? state.wrappers[state.wrappers.length - 1].unit : 'Data'

  return (
    <>
      <VisualizationShell
        title="OSI Model"
        subtitle="Data encapsulated down 7 layers at the sender, then decapsulated back up at the receiver"
        engine={engine}
        legend={LAYERS.map((l) => ({ label: l.name, color: l.color }))}
        metrics={[
          { label: 'Phase', value: state.phase === 'down' ? 'Sender (encapsulating)' : state.phase === 'up' ? 'Receiver (decapsulating)' : state.phase === 'across' ? 'In transit' : '—' },
          { label: 'Data unit', value: dataUnit },
        ]}
        canvas={
          <div className="min-w-[500px] flex items-start justify-center gap-8 py-2">
            <div className="flex flex-col gap-1.5 w-56">
              <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">Sender</p>
              {LAYERS.map((l, i) => (
                <LayerRow key={l.name} layer={l} index={i} activeIndex={state.direction === 'down' ? state.activeIndex : -1} wrapped={state.direction !== 'down' || i <= state.activeIndex} />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-2 pt-8">
              <PacketStack wrappers={state.wrappers} />
              {state.phase === 'across' && (
                <StatusBadge tone="info">on the wire →</StatusBadge>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-56">
              <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">Receiver</p>
              {LAYERS.map((l, i) => (
                <LayerRow key={l.name} layer={l} index={i} activeIndex={state.direction === 'up' ? state.activeIndex : -1} wrapped={state.direction === 'up' && i < state.activeIndex} />
              ))}
            </div>
          </div>
        }
      />
      <TopicNotes notes={osiNotes} />
    </>
  )
}

export default OsiModelVisualizer
