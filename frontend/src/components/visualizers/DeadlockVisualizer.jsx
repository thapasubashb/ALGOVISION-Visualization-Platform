import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildDeadlockSteps, deadlockNotes } from '../../simulation-data/deadlock'

function NodeCircle({ label, kind, dimmed }) {
  const isTx = kind === 'tx'
  return (
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0 transition-opacity ${
        isTx ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-slate-50 border-slate-400 text-slate-600'
      } ${dimmed ? 'opacity-30' : ''}`}
    >
      {label}
    </div>
  )
}

function DeadlockVisualizer() {
  const steps = useMemo(() => buildDeadlockSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const waitT1toT2 = state.waits.some((w) => w.from === 'T1' && w.to === 'T2')
  const waitT2toT1 = state.waits.some((w) => w.from === 'T2' && w.to === 'T1')

  return (
    <>
      <VisualizationShell
        title="Deadlocks"
        subtitle="T1 holds A, wants B. T2 holds B, wants A — a classic wait-for cycle."
        engine={engine}
        legend={[
          { label: 'Holds', color: 'bg-slate-400' },
          { label: 'Waits for', color: 'bg-amber-400' },
          { label: 'Deadlock cycle', color: 'bg-rose-500' },
        ]}
        canvas={
          <div className="min-w-[440px] flex flex-col items-center gap-6 py-4">
            <div className="relative w-full max-w-sm h-16 flex justify-between items-center px-4">
              <NodeCircle label="T1" kind="tx" dimmed={state.victim === 'T1'} />
              <div className="flex-1 relative h-10 mx-2">
                <AnimatePresence>
                  {waitT1toT2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute top-1 left-0 right-0 text-center text-[10px] font-bold ${state.cycle ? 'text-rose-600' : 'text-amber-600'}`}
                    >
                      T1 waits for T2 →
                    </motion.div>
                  )}
                  {waitT2toT1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold ${state.cycle ? 'text-rose-600' : 'text-amber-600'}`}
                    >
                      ← T2 waits for T1
                    </motion.div>
                  )}
                </AnimatePresence>
                {(waitT1toT2 || waitT2toT1) && (
                  <motion.div
                    animate={state.cycle ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.5 }}
                    transition={{ duration: 1.2, repeat: state.cycle ? Infinity : 0 }}
                    className={`absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 ${state.cycle ? 'bg-rose-400' : 'bg-amber-300'}`}
                  />
                )}
              </div>
              <NodeCircle label="T2" kind="tx" dimmed={state.victim === 'T2' && state.phase !== 'abort'} />
            </div>

            <div className="w-full max-w-sm flex justify-between px-4">
              <div className="flex flex-col items-center gap-1">
                <NodeCircle label="A" kind="res" />
                <span className="text-[10px] text-slate-400">
                  {state.holds.A ? `held by ${state.holds.A}` : 'free'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <NodeCircle label="B" kind="res" />
                <span className="text-[10px] text-slate-400">
                  {state.holds.B ? `held by ${state.holds.B}` : 'free'}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {state.cycle && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <StatusBadge tone="danger">Cycle detected — DEADLOCK</StatusBadge>
                </motion.div>
              )}
              {state.victim && state.phase === 'abort' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <StatusBadge tone="warning">{state.victim} aborted (rolled back)</StatusBadge>
                </motion.div>
              )}
              {state.phase === 'resolved' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <StatusBadge tone="success">T1 acquired everything — resolved</StatusBadge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={deadlockNotes} />
    </>
  )
}

export default DeadlockVisualizer
