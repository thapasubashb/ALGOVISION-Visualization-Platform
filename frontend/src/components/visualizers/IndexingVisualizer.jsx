import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { VisualizationShell, TopicNotes, MetricPanel, useSimulationEngine } from '../../simulation'
import { buildIndexingSteps, TABLE_DATA, TARGET, indexingNotes } from '../../simulation-data/indexing'

function RowChip({ row, active, matched }) {
  return (
    <motion.div
      animate={{ scale: active ? 1.12 : 1 }}
      className={`w-14 h-12 rounded-lg flex flex-col items-center justify-center text-[11px] font-bold border-2 shrink-0 ${
        matched ? 'bg-teal-50 border-teal-400 text-teal-700 av-glow-success' : active ? 'bg-blue-50 border-blue-400 text-blue-700 av-glow' : 'bg-white border-slate-200 text-slate-500'
      }`}
    >
      <span>id {row.id}</span>
      <span className="opacity-70 font-normal">{row.name}</span>
    </motion.div>
  )
}

function IndexingVisualizer() {
  const steps = useMemo(() => buildIndexingSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const isIndexPhase = state.mode === 'index' || state.mode === 'index-intro' || state.mode === 'summary'

  return (
    <>
      <VisualizationShell
        title="Indexing"
        subtitle={`SELECT * FROM Users WHERE id = ${TARGET} — with vs without an index`}
        engine={engine}
        legend={[
          { label: 'Currently checking', color: 'bg-blue-400' },
          { label: 'Match found', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Mode', value: isIndexPhase ? 'Index lookup' : 'Full scan' },
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Found', value: state.found ? 'Yes' : 'Not yet', accent: state.found ? 'text-teal-600' : undefined },
        ]}
        canvas={
          <div className="min-w-[520px] flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Users table (unsorted disk order)</p>
              <div className="flex flex-wrap gap-2">
                {TABLE_DATA.map((row, i) => (
                  <RowChip key={row.id} row={row} active={!isIndexPhase && state.scanIndex === i} matched={!isIndexPhase && state.found && state.scanIndex === i} />
                ))}
              </div>
            </div>

            {(isIndexPhase) && (
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Index on id (sorted)</p>
                <div className="flex flex-wrap gap-2">
                  {TABLE_DATA.map((row, i) => {
                    const isHop = state.indexHops?.includes(i)
                    const isLastHop = state.indexHops && state.indexHops[state.indexHops.length - 1] === i
                    return (
                      <RowChip key={row.id} row={row} active={isLastHop && !state.found} matched={isLastHop && state.found} />
                    )
                  })}
                </div>
              </div>
            )}

            {state.mode === 'summary' && (
              <div className="mt-2">
                <MetricPanel metrics={[
                  { label: 'Full scan comparisons', value: state.scanComparisons },
                  { label: 'Index comparisons', value: state.indexComparisons, accent: 'text-teal-600' },
                ]} />
              </div>
            )}
          </div>
        }
      />
      <TopicNotes notes={indexingNotes} />
    </>
  )
}

export default IndexingVisualizer
