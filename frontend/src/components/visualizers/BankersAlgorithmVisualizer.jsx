import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { BANKERS_PROCESSES, RESOURCE_NAMES, ALLOCATION, MAX, buildBankersSteps, bankersAlgorithmNotes } from '../../simulation-data/bankersAlgorithm'

function BankersAlgorithmVisualizer() {
  const steps = useMemo(() => buildBankersSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Banker's Algorithm"
        subtitle="Searching for a safe execution sequence across 5 processes and 3 resource types"
        engine={engine}
        legend={[
          { label: 'Being checked', color: 'bg-blue-400' },
          { label: 'Can run (safe)', color: 'bg-teal-400' },
          { label: 'Finished', color: 'bg-slate-300' },
        ]}
        metrics={[
          { label: 'Available', value: `[${state.available.join(', ')}]` },
          { label: 'Finished', value: `${state.done.length} / ${BANKERS_PROCESSES.length}` },
        ]}
        canvas={
          <div className="min-w-[560px] overflow-x-auto">
            <table className="w-full text-xs border-separate" style={{ borderSpacing: '0 4px' }}>
              <thead>
                <tr className="text-slate-400 text-left">
                  <th className="px-2">Process</th>
                  <th className="px-2">Allocation</th>
                  <th className="px-2">Max</th>
                  <th className="px-2">Need</th>
                  <th className="px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {BANKERS_PROCESSES.map((p) => {
                  const isChecking = state.checking === p
                  const isDone = state.done.includes(p)
                  return (
                    <motion.tr
                      key={p}
                      animate={{ scale: isChecking ? 1.02 : 1 }}
                      className={`${isChecking ? 'bg-blue-50' : isDone ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      <td className={`px-2 py-1.5 font-bold rounded-l-lg ${isChecking ? 'text-blue-700' : isDone ? 'text-slate-400' : 'text-slate-700'}`}>{p}</td>
                      <td className="px-2 py-1.5 font-mono text-slate-600">[{ALLOCATION[p].join(', ')}]</td>
                      <td className="px-2 py-1.5 font-mono text-slate-600">[{MAX[p].join(', ')}]</td>
                      <td className="px-2 py-1.5 font-mono font-semibold text-slate-700">[{state.needs[p].join(', ')}]</td>
                      <td className="px-2 py-1.5 rounded-r-lg">
                        {isDone ? <StatusBadge tone="default">finished</StatusBadge> : isChecking ? (
                          <StatusBadge tone={state.result === 'ok' ? 'success' : state.result === 'blocked' ? 'danger' : 'info'}>
                            {state.result === 'ok' ? 'can run' : state.result === 'blocked' ? 'must wait' : 'checking…'}
                          </StatusBadge>
                        ) : <StatusBadge>waiting</StatusBadge>}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-slate-400 mt-2">Resources: {RESOURCE_NAMES.join(', ')} (columns, in order)</p>

            <AnimatePresence>
              {state.safeSequence.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <StatusBadge tone="success">Safe sequence so far: {state.safeSequence.join(' → ')}</StatusBadge>
                </motion.div>
              )}
              {state.final && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <StatusBadge tone={state.isSafe ? 'success' : 'danger'}>
                    {state.isSafe ? 'System is in a SAFE state' : 'System is in an UNSAFE state'}
                  </StatusBadge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={bankersAlgorithmNotes} />
    </>
  )
}

export default BankersAlgorithmVisualizer
