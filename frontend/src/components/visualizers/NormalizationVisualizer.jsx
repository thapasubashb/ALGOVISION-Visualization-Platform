import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildNormalizationSteps, normalizationNotes } from '../../simulation-data/normalization'

function MiniTable({ title, rows, highlightCol, columns }) {
  const cols = columns || (rows[0] ? Object.keys(rows[0]) : [])
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">{title}</div>
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="text-left text-slate-400">
            {cols.map((c) => (
              <th key={c} className={`px-3 py-1.5 font-semibold ${c === highlightCol ? 'text-amber-600' : ''}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {cols.map((c) => (
                <td key={c} className={`px-3 py-1.5 text-slate-700 ${c === highlightCol ? 'bg-amber-50 font-semibold text-amber-700' : ''}`}>
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

function NormalizationVisualizer() {
  const steps = useMemo(() => buildNormalizationSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Normalization"
        subtitle="UNF → 1NF → 2NF → 3NF, decomposing a StudentCourse table to remove duplication"
        engine={engine}
        legend={[
          { label: 'Duplicated / anomalous column', color: 'bg-amber-400' },
        ]}
        canvas={
          <div className="min-w-[520px] flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {state.unf && (
                <motion.div key="unf" exit={{ opacity: 0 }}>
                  <MiniTable title="StudentCourse (UNF)" rows={state.unf} />
                </motion.div>
              )}
              {state.firstNF && (
                <motion.div key="1nf" exit={{ opacity: 0 }}>
                  <MiniTable title="StudentCourse (1NF)" rows={state.firstNF} highlightCol={state.highlightCol} />
                </motion.div>
              )}
              {state.secondNF && (
                <motion.div key="2nf" exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-4">
                  <MiniTable title="Student" rows={state.secondNF.student} />
                  <MiniTable title="Enrollment" rows={state.secondNF.enrollment} highlightCol={state.highlightCol} />
                </motion.div>
              )}
              {state.thirdNF && (
                <motion.div key="3nf" exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-4 flex-wrap">
                  <MiniTable title="Student" rows={state.thirdNF.student} />
                  <MiniTable title="Course" rows={state.thirdNF.course} />
                  <MiniTable title="Enrollment" rows={state.thirdNF.enrollment} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={normalizationNotes} />
    </>
  )
}

export default NormalizationVisualizer
