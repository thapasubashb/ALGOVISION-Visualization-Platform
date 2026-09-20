import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { DISK_MAX_TRACK, DISK_HEAD_START, DISK_REQUESTS, buildDiskSchedulingSteps, diskSchedulingNotes } from '../../simulation-data/diskScheduling'

const ALGOS = [
  { id: 'fcfs', label: 'FCFS' },
  { id: 'sstf', label: 'SSTF' },
  { id: 'scan', label: 'SCAN' },
  { id: 'cscan', label: 'C-SCAN' },
]

function trackToPct(track) {
  return (track / DISK_MAX_TRACK) * 100
}

function DiskSchedulingVisualizer() {
  const [algorithm, setAlgorithm] = useState('fcfs')
  const steps = useMemo(() => buildDiskSchedulingSteps(algorithm), [algorithm])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Disk Scheduling"
        subtitle={`Head starts at track ${DISK_HEAD_START}, disk has tracks 0–${DISK_MAX_TRACK}`}
        engine={engine}
        legend={[
          { label: 'Serviced', color: 'bg-teal-400' },
          { label: 'Pending request', color: 'bg-slate-300' },
          { label: 'Head', color: 'bg-blue-500' },
        ]}
        metrics={[
          { label: 'Current track', value: state.head },
          { label: 'Total head movement', value: state.totalMovement },
        ]}
        canvas={
          <div className="min-w-[520px] flex flex-col gap-6 py-2">
            <div className="flex gap-2 justify-center flex-wrap">
              {ALGOS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAlgorithm(a.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${algorithm === a.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="relative h-3 bg-slate-100 rounded-full mx-2">
              {DISK_REQUESTS.map((r) => (
                <div
                  key={r}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${state.visited.includes(r) ? 'bg-teal-500' : 'bg-slate-400'}`}
                  style={{ left: `${trackToPct(r)}%` }}
                  title={`Track ${r}`}
                />
              ))}
              <motion.div
                animate={{ left: `${trackToPct(state.head)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md av-glow"
              />
              <span className="absolute -bottom-5 left-0 text-[9px] text-slate-400">0</span>
              <span className="absolute -bottom-5 right-0 text-[9px] text-slate-400">{DISK_MAX_TRACK}</span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Path so far</p>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence initial={false}>
                  {state.path.map((t, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${i === state.path.length - 1 ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {t}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        }
        footnote="Switching algorithm resets the simulation."
      />
      <TopicNotes notes={diskSchedulingNotes} />
    </>
  )
}

export default DiskSchedulingVisualizer
