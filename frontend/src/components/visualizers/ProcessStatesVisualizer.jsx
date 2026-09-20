import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildProcessStatesSteps, processStatesNotes } from '../../simulation-data/processStates'

const LAYOUT = {
  New: { top: '5%', left: '5%' },
  Ready: { top: '5%', left: '38%' },
  Running: { top: '5%', left: '71%' },
  Waiting: { top: '55%', left: '38%' },
  Terminated: { top: '55%', left: '71%' },
}

function StateBox({ name, active }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.15 : 1 }}
      className={`absolute w-24 h-16 rounded-xl border-2 flex items-center justify-center text-xs font-bold text-center px-1 ${
        active ? 'border-blue-400 bg-blue-50 text-blue-700 av-glow' : 'border-slate-200 bg-white text-slate-500'
      }`}
      style={{ top: LAYOUT[name].top, left: LAYOUT[name].left }}
    >
      {name}
    </motion.div>
  )
}

function ProcessStatesVisualizer() {
  const steps = useMemo(() => buildProcessStatesSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Process States"
        subtitle="A single process's journey through New → Ready → Running → Waiting → Terminated"
        engine={engine}
        legend={[{ label: 'Current state', color: 'bg-blue-400' }]}
        canvas={
          <div className="min-w-[440px] relative" style={{ height: 220 }}>
            {Object.keys(LAYOUT).map((name) => (
              <StateBox key={name} name={name} active={state.current === name} />
            ))}
          </div>
        }
        footnote={`Path so far: ${state.history.join(' → ')}`}
      />
      <TopicNotes notes={processStatesNotes} />
    </>
  )
}

export default ProcessStatesVisualizer
