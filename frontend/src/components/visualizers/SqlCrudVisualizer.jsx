import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildSqlCrudSteps, sqlCrudNotes } from '../../simulation-data/sqlCrud'

const COLUMNS = ['id', 'name', 'dept', 'salary']

function SqlCrudVisualizer() {
  const steps = useMemo(() => buildSqlCrudSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="SQL Queries & CRUD"
        subtitle="CREATE, INSERT, SELECT, UPDATE and DELETE against a live Employees table"
        engine={engine}
        legend={[
          { label: 'Matched by SELECT', color: 'bg-blue-500' },
          { label: 'Just changed', color: 'bg-amber-400' },
          { label: 'Being deleted', color: 'bg-rose-400' },
        ]}
        canvas={
          <div className="min-w-[440px]">
            <div className="bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm rounded-lg px-4 py-3 mb-4 overflow-x-auto av-glow">
              {state.sql}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2">Employees</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs">
                    {COLUMNS.map((c) => <th key={c} className="px-3 py-1.5 font-semibold">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {state.rows.map((row) => {
                      const isHighlighted = state.highlightIds.includes(row.id)
                      const isDeleting = state.deletingId === row.id
                      return (
                        <motion.tr
                          key={row.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: isDeleting ? 0.3 : 1, y: 0, x: isDeleting ? 6 : 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.35 }}
                          className={`border-t ${isHighlighted ? 'bg-blue-50' : isDeleting ? 'bg-rose-50' : 'bg-white'}`}
                        >
                          {COLUMNS.map((col) => {
                            const flashing = state.flashCell && state.flashCell.id === row.id && state.flashCell.col === col
                            return (
                              <td key={col} className="px-3 py-1.5 text-slate-700">
                                <motion.span
                                  animate={flashing ? { backgroundColor: ['#fde68a', '#fde68a', 'transparent'] } : {}}
                                  transition={{ duration: 1.2 }}
                                  className="inline-block px-1.5 py-0.5 rounded"
                                >
                                  {row[col]}
                                </motion.span>
                              </td>
                            )
                          })}
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                  {state.rows.length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-3 text-slate-400 italic text-xs">Table is empty</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        }
      />
      <TopicNotes notes={sqlCrudNotes} />
    </>
  )
}

export default SqlCrudVisualizer
