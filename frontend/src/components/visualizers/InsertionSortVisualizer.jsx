import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildInsertionSortSteps, insertionSortNotes, INSERTION_SORT_ARRAY } from '../../simulation-data/insertionSort'

function InsertionSortVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const steps = useMemo(() => buildInsertionSortSteps(customArray), [customArray])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Insertion Sort"
        subtitle="Shift each new element backward through the sorted portion until it fits"
        engine={engine}
        legend={[
          { label: 'Key being inserted', color: 'bg-indigo-400' },
          { label: 'Shifting', color: 'bg-rose-400' },
          { label: 'Sorted', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Sorted boundary', value: state.boundary },
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Shifts', value: state.shifts },
        ]}
        canvas={<BarArray3D values={state.array} states={state.states} />}
        customInput={<ArrayInput defaultValues={INSERTION_SORT_ARRAY} onApply={setCustomArray} />}
      />
      <TopicNotes notes={insertionSortNotes} />
    </>
  )
}

export default InsertionSortVisualizer
