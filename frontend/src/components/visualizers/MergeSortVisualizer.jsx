import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildMergeSortSteps, mergeSortNotes, MERGE_SORT_ARRAY } from '../../simulation-data/mergeSort'

function MergeSortVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const steps = useMemo(() => buildMergeSortSteps(customArray), [customArray])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const states = state.array.map((_, i) => {
    if (state.done) return 'sorted'
    if (state.compareIndices?.includes(i)) return 'compare'
    if (state.activeRange && i >= state.activeRange[0] && i < state.activeRange[1]) return 'active'
    return 'default'
  })

  return (
    <>
      <VisualizationShell
        title="Merge Sort"
        subtitle="Recursively split in half, then merge sorted halves back together"
        engine={engine}
        legend={[
          { label: 'Active range', color: 'bg-indigo-400' },
          { label: 'Comparing', color: 'bg-amber-400' },
          { label: 'Sorted', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Active range', value: state.activeRange ? `[${state.activeRange[0]}, ${state.activeRange[1] - 1}]` : '—' },
        ]}
        canvas={<BarArray3D values={state.array} states={states} />}
        customInput={<ArrayInput defaultValues={MERGE_SORT_ARRAY} onApply={setCustomArray} />}
      />
      <TopicNotes notes={mergeSortNotes} />
    </>
  )
}

export default MergeSortVisualizer
