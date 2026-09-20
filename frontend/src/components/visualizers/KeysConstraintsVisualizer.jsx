import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildKeysConstraintsSteps, keysConstraintsNotes } from '../../simulation-data/keysConstraints'

function StageBox({ label, index, activeIndex, verdict }) {
  const isActive = index === activeIndex
  const isPast = activeIndex > index || (activeIndex === index && verdict === 'accept')
  const failed = isActive && verdict === 'reject'

  let tone = 'bg-white border-slate-200 text-slate-400'
  if (isPast && !failed) tone = 'bg-teal-50 border-teal-300 text-teal-700'
  if (isActive && !failed) tone = 'bg-blue-50 border-blue-400 text-blue-700 av-glow'
  if (failed) tone = 'bg-rose-50 border-rose-400 text-rose-700 av-glow-danger'

  return (
    <div className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg border-2 text-xs font-bold transition-colors ${tone}`}>
      {failed ? <X size={16} className="mb-1" /> : isPast ? <Check size={16} className="mb-1" /> : null}
      {label}
    </div>
  )
}

function KeysConstraintsVisualizer() {
  const steps = useMemo(() => buildKeysConstraintsSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Keys & Constraints"
        subtitle="Every INSERT must pass PRIMARY KEY → NOT NULL → UNIQUE → CHECK before it's written"
        engine={engine}
        legend={[
          { label: 'Passed', color: 'bg-teal-400' },
          { label: 'Currently checking', color: 'bg-blue-400' },
          { label: 'Rejected here', color: 'bg-rose-400' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <AnimatePresence>
                {state.attemptRow && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-800 text-white text-[11px] font-mono rounded-lg px-3 py-2 mr-2"
                  >
                    id={String(state.attemptRow.id)}, name={state.attemptRow.name === null ? 'NULL' : state.attemptRow.name}, age={String(state.attemptRow.age)}
                  </motion.div>
                )}
              </AnimatePresence>
              {state.stages.map((stage, i) => (
                <div key={stage} className="flex items-center gap-2">
                  <StageBox label={stage} index={i} activeIndex={state.activeStageIndex} verdict={state.verdict} />
                  {i < state.stages.length - 1 && <ArrowRight size={16} className="text-slate-300 shrink-0" />}
                </div>
              ))}
              {state.verdict && (
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="ml-2">
                  <StatusBadge tone={state.verdict === 'accept' ? 'success' : state.verdict === 'reject' ? 'danger' : 'info'}>
                    {state.verdict === 'accept' ? 'INSERTED' : state.verdict === 'reject' ? 'REJECTED' : 'checking…'}
                  </StatusBadge>
                </motion.div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">Students</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs">
                    <th className="px-3 py-1.5 font-semibold">id (PK)</th>
                    <th className="px-3 py-1.5 font-semibold">name (NOT NULL)</th>
                    <th className="px-3 py-1.5 font-semibold">email (UNIQUE)</th>
                    <th className="px-3 py-1.5 font-semibold">age (CHECK ≥ 0)</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {state.rows.map((r) => (
                      <motion.tr key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t">
                        <td className="px-3 py-1.5 text-slate-700">{r.id}</td>
                        <td className="px-3 py-1.5 text-slate-700">{r.name}</td>
                        <td className="px-3 py-1.5 text-slate-700">{r.email}</td>
                        <td className="px-3 py-1.5 text-slate-700">{r.age}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        }
      />
      <TopicNotes notes={keysConstraintsNotes} />
    </>
  )
}

export default KeysConstraintsVisualizer
