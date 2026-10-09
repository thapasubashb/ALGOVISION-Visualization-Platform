import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildQuickSortSteps, quickSortNotes, QUICK_SORT_ARRAY } from '../../simulation-data/quickSort'

function QuickSortVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const steps = useMemo(() => buildQuickSortSteps(customArray), [customArray])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const states = state.array.map((_, i) => {
    if (state.sorted?.includes(i)) return 'sorted'
    if (i === state.pivotIndex) return 'pivot'
    if (i === state.compareIndex) return 'compare'
    if (state.range && (i < state.range[0] || i > state.range[1])) return 'default'
    return 'default'
  })

  return (
    <>
      <VisualizationShell
        title="Quick Sort"
        subtitle="Partition around a pivot, then recursively sort each side"
        engine={engine}
        legend={[
          { label: 'Pivot', color: 'bg-purple-500' },
          { label: 'Comparing', color: 'bg-amber-400' },
          { label: 'Sorted (final position)', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Swaps', value: state.swaps },
        ]}
        canvas={<BarArray3D values={state.array} states={states} />}
        customInput={<ArrayInput defaultValues={QUICK_SORT_ARRAY} onApply={setCustomArray} />}
      />
      <TopicNotes notes={quickSortNotes} />
    </>
  )
}

export default QuickSortVisualizer
