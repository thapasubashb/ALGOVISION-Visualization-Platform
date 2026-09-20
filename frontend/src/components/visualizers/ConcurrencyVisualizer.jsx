import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Clock } from 'lucide-react'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildConcurrencySteps, concurrencyNotes } from '../../simulation-data/concurrency'

function TxBox({ label, status }) {
  const tone = {
    idle: 'bg-white border-slate-200 text-slate-400',
    locked: 'bg-blue-50 border-blue-400 text-blue-700 av-glow',
    writing: 'bg-amber-50 border-amber-400 text-amber-700',
    waiting: 'bg-rose-50 border-rose-300 text-rose-600 av-glow-danger',
    done: 'bg-teal-50 border-teal-300 text-teal-700',
  }[status]

  return (
    <div className={`flex flex-col items-center gap-1.5 w-28 h-24 justify-center rounded-xl border-2 ${tone}`}>
      <p className="font-bold text-sm">{label}</p>
      <div className="flex items-center gap-1 text-[11px] font-semibold">
        {status === 'waiting' && <Clock size={13} />}
        {(status === 'locked' || status === 'writing') && <Lock size={13} />}
        <span className="capitalize">{status}</span>
      </div>
    </div>
  )
}

function ConcurrencyVisualizer() {
  const steps = useMemo(() => buildConcurrencySteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Concurrency Control"
        subtitle="Two transactions racing to update the same row, coordinated with locking"
        engine={engine}
        legend={[
          { label: 'Holds the lock', color: 'bg-blue-400' },
          { label: 'Waiting', color: 'bg-rose-300' },
          { label: 'Done', color: 'bg-teal-400' },
        ]}
        canvas={
          <div className="min-w-[460px] flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <TxBox label="T1" status={state.t1} />

              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: state.lockOwner ? 1.05 : 1 }}
                  className="bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-center w-32"
                >
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">Account row</p>
                  <p className="text-xl font-bold text-slate-800">{state.balance}</p>
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.lockOwner || 'free'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Lock size={13} className={state.lockOwner ? 'text-blue-500' : 'text-slate-300'} />
                    <StatusBadge tone={state.lockOwner ? 'info' : 'default'}>
                      {state.lockOwner ? `Locked by ${state.lockOwner}` : 'Unlocked'}
                    </StatusBadge>
                  </motion.div>
                </AnimatePresence>
              </div>

              <TxBox label="T2" status={state.t2} />
            </div>

            <div className="w-full bg-slate-50 rounded-lg border border-slate-100 p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Event log</p>
              <ul className="text-xs text-slate-600 space-y-0.5">
                <AnimatePresence initial={false}>
                  {state.log.map((entry, i) => (
                    <motion.li key={entry} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      {i + 1}. {entry}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        }
      />
      <TopicNotes notes={concurrencyNotes} />
    </>
  )
}

export default ConcurrencyVisualizer
