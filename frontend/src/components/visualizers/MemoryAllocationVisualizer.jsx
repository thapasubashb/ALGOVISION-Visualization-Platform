import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { INITIAL_BLOCKS, MEMORY_PROCESSES, buildMemoryAllocationSteps, memoryAllocationNotes } from '../../simulation-data/memoryAllocation'

const STRATEGIES = [
  { id: 'first', label: 'First Fit' },
  { id: 'best', label: 'Best Fit' },
  { id: 'worst', label: 'Worst Fit' },
]

function MemoryAllocationVisualizer() {
  const [strategy, setStrategy] = useState('first')
  const steps = useMemo(() => buildMemoryAllocationSteps(strategy), [strategy])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const maxBlock = Math.max(...INITIAL_BLOCKS)

  return (
    <>
      <VisualizationShell
        title="Memory Allocation"
        subtitle="First Fit vs Best Fit vs Worst Fit — same blocks, same process requests"
        engine={engine}
        legend={[
          { label: 'Allocated', color: 'bg-blue-500' },
          { label: 'Free fragment', color: 'bg-slate-200' },
          { label: 'Selected this step', color: 'bg-amber-400' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div className="flex gap-2 justify-center">
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${strategy === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-3 justify-center h-40">
              {INITIAL_BLOCKS.map((total, i) => {
                const freeNow = state.free[i]
                const usedPct = ((total - freeNow) / maxBlock) * 100
                const freePct = (freeNow / maxBlock) * 100
                const isChosen = state.chosenIndex === i
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="flex flex-col-reverse w-14 rounded-lg overflow-hidden border-2 border-slate-200" style={{ height: 140 }}>
                      <motion.div animate={{ height: `${freePct}%` }} className="bg-slate-100 w-full" />
                      <motion.div
                        animate={{ height: `${usedPct}%` }}
                        className={`w-full ${isChosen ? 'bg-amber-400 av-glow' : 'bg-blue-500'}`}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500">Block {i}</p>
                    <p className="text-[9px] text-slate-400">{freeNow}/{total} KB free</p>
                    {state.assigned[i] && <StatusBadge tone="info">{state.assigned[i]}</StatusBadge>}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {MEMORY_PROCESSES.map((p) => {
                const isDone = state.assigned.includes(p.id)
                const isFailed = state.failed === p.id
                const isCurrent = state.currentProcess === p.id
                return (
                  <div
                    key={p.id}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border-2 ${
                      isFailed ? 'border-rose-400 bg-rose-50 text-rose-700 av-glow-danger' : isDone ? 'border-teal-300 bg-teal-50 text-teal-700' : isCurrent ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {p.id} ({p.size} KB)
                  </div>
                )
              })}
            </div>
          </div>
        }
        footnote="Switching strategy resets the simulation."
      />
      <TopicNotes notes={memoryAllocationNotes} />
    </>
  )
}

export default MemoryAllocationVisualizer
