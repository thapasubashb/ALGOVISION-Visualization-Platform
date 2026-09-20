import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { REFERENCE_STRING, FRAME_COUNT, buildFifoSteps, fifoPageReplacementNotes } from '../../simulation-data/fifoPageReplacement'

function RefChip({ page, isCurrent, isFault }) {
  return (
    <motion.div
      animate={{ scale: isCurrent ? 1.15 : 1 }}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border-2 shrink-0 ${
        isCurrent ? (isFault ? 'bg-rose-50 border-rose-400 text-rose-700 av-glow-danger' : 'bg-teal-50 border-teal-400 text-teal-700 av-glow-success') : 'bg-white border-slate-200 text-slate-400'
      }`}
    >
      {page}
    </motion.div>
  )
}

function FifoPageReplacementVisualizer() {
  const steps = useMemo(() => buildFifoSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="FIFO Page Replacement"
        subtitle={`Reference string ${REFERENCE_STRING.join(', ')} with ${FRAME_COUNT} frames`}
        engine={engine}
        legend={[{ label: 'Fault', color: 'bg-rose-400' }, { label: 'Hit', color: 'bg-teal-400' }]}
        metrics={[
          { label: 'Page faults', value: state.faults, accent: 'text-rose-600' },
          { label: 'Hits', value: state.hits, accent: 'text-teal-600' },
        ]}
        canvas={
          <div className="min-w-[480px] flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Reference string</p>
              <div className="flex gap-1.5 flex-wrap">
                {REFERENCE_STRING.map((p, i) => (
                  <RefChip key={i} page={p} isCurrent={state.refIndex === i} isFault={state.isFault} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Physical frames (FIFO order, oldest first)</p>
              <div className="flex gap-3">
                {Array.from({ length: FRAME_COUNT }).map((_, i) => {
                  const page = state.frames[i]
                  const justEvicted = state.evicted === page
                  return (
                    <motion.div
                      key={i}
                      layout
                      className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-lg font-bold ${
                        page === undefined ? 'border-dashed border-slate-200 text-slate-300' : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span key={page ?? 'empty'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                          {page ?? '—'}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
              {state.evicted !== null && (
                <p className="text-xs text-rose-500 mt-1.5">Evicted page {state.evicted} (oldest resident)</p>
              )}
            </div>
          </div>
        }
      />
      <TopicNotes notes={fifoPageReplacementNotes} />
    </>
  )
}

export default FifoPageReplacementVisualizer
