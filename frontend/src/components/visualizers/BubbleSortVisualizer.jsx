import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildBubbleSortSteps, bubbleSortNotes, BUBBLE_SORT_ARRAY } from '../../simulation-data/bubbleSort'

function BubbleSortVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const steps = useMemo(() => buildBubbleSortSteps(customArray), [customArray])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Bubble Sort"
        subtitle="Repeatedly swap adjacent out-of-order pairs until the array is sorted"
        engine={engine}
        legend={[
          { label: 'Comparing', color: 'bg-amber-400' },
          { label: 'Swapping', color: 'bg-rose-400' },
          { label: 'Sorted', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Pass', value: state.pass },
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Swaps', value: state.swaps },
        ]}
        canvas={<BarArray3D values={state.array} states={state.states} />}
        customInput={<ArrayInput defaultValues={BUBBLE_SORT_ARRAY} onApply={setCustomArray} />}
      />
      <TopicNotes notes={bubbleSortNotes} />
    </>
  )
}

export default BubbleSortVisualizer
