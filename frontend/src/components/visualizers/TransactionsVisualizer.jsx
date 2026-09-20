import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildTransactionsSteps, transactionsNotes } from '../../simulation-data/transactions'

function AccountCard({ label, committedValue, pendingValue, phase }) {
  const isPending = pendingValue !== undefined && pendingValue !== committedValue
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 w-40 text-center">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Account {label}</p>
      <motion.p
        key={committedValue}
        initial={{ scale: 1.2, color: '#0d9488' }}
        animate={{ scale: 1, color: '#1e293b' }}
        className="text-2xl font-bold"
      >
        {committedValue}
      </motion.p>
      <p className="text-[10px] text-slate-400 mt-0.5">committed</p>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-2 text-sm font-bold px-2 py-1 rounded-md border-2 border-dashed ${
              phase === 'error' ? 'text-rose-600 border-rose-300 bg-rose-50 av-glow-danger' : 'text-amber-600 border-amber-300 bg-amber-50'
            }`}
          >
            → {pendingValue} (pending)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ACID_LETTERS = [
  { letter: 'A', word: 'Atomicity' },
  { letter: 'C', word: 'Consistency' },
  { letter: 'I', word: 'Isolation' },
  { letter: 'D', word: 'Durability' },
]

function TransactionsVisualizer() {
  const steps = useMemo(() => buildTransactionsSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const activeLetter = state.phase === 'committed' ? 'D' : state.phase === 'rolledback' ? 'A' : state.phase?.startsWith('write') ? 'I' : state.phase === 'committed' ? 'C' : null

  return (
    <>
      <VisualizationShell
        title="Transactions & ACID"
        subtitle="A committed transfer, followed by one that fails and rolls back"
        engine={engine}
        legend={[
          { label: 'Committed', color: 'bg-slate-700' },
          { label: 'Pending / uncommitted', color: 'bg-amber-400' },
          { label: 'Error → rollback', color: 'bg-rose-400' },
        ]}
        canvas={
          <div className="min-w-[440px] flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              {state.txLabel && (
                <StatusBadge tone={state.badge}>
                  {state.txLabel} — {state.phase === 'committed' ? 'COMMITTED' : state.phase === 'rolledback' ? 'ROLLED BACK' : state.phase === 'error' ? 'ERROR' : 'IN PROGRESS'}
                </StatusBadge>
              )}
            </div>
            <div className="flex gap-6">
              <AccountCard label="A" committedValue={state.committed.A} pendingValue={state.pending?.A} phase={state.phase} />
              <AccountCard label="B" committedValue={state.committed.B} pendingValue={state.pending?.B} phase={state.phase} />
            </div>
            <div className="flex gap-2">
              {ACID_LETTERS.map((a) => (
                <div
                  key={a.letter}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    activeLetter === a.letter ? 'bg-blue-600 text-white border-blue-600 av-glow' : 'bg-white text-slate-400 border-slate-200'
                  }`}
                  title={a.word}
                >
                  {a.letter}
                </div>
              ))}
            </div>
          </div>
        }
      />
      <TopicNotes notes={transactionsNotes} />
    </>
  )
}

export default TransactionsVisualizer
