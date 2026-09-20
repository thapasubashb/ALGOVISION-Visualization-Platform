import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { LRU_REFERENCE_STRING, LRU_FRAME_COUNT, buildLruSteps, lruPageReplacementNotes } from '../../simulation-data/lruPageReplacement'

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

function LruPageReplacementVisualizer() {
  const steps = useMemo(() => buildLruSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const orderedByRecency = [...state.recency].reverse() // most recent first, for display

  return (
    <>
      <VisualizationShell
        title="LRU Page Replacement"
        subtitle={`Same reference string as FIFO: ${LRU_REFERENCE_STRING.join(', ')} with ${LRU_FRAME_COUNT} frames`}
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
                {LRU_REFERENCE_STRING.map((p, i) => (
                  <RefChip key={i} page={p} isCurrent={state.refIndex === i} isFault={state.isFault} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Frames, ordered Most → Least Recently Used</p>
              <div className="flex gap-3">
                <AnimatePresence initial={false}>
                  {orderedByRecency.map((page, i) => (
                    <motion.div
                      key={page}
                      layout
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center ${
                        i === orderedByRecency.length - 1 ? 'border-amber-300 bg-amber-50' : 'border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-lg font-bold text-slate-700">{page}</span>
                      <span className="text-[9px] text-slate-400">{i === 0 ? 'MRU' : i === orderedByRecency.length - 1 ? 'LRU' : ''}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {Array.from({ length: Math.max(0, LRU_FRAME_COUNT - orderedByRecency.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200" />
                ))}
              </div>
              {state.evicted !== null && (
                <p className="text-xs text-rose-500 mt-1.5">Evicted page {state.evicted} (least recently used)</p>
              )}
            </div>
          </div>
        }
      />
      <TopicNotes notes={lruPageReplacementNotes} />
    </>
  )
}

export default LruPageReplacementVisualizer
