import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildSelectionSortSteps, selectionSortNotes, SELECTION_SORT_ARRAY } from '../../simulation-data/selectionSort'

function SelectionSortVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const steps = useMemo(() => buildSelectionSortSteps(customArray), [customArray])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="Selection Sort"
        subtitle="Repeatedly find the minimum of the unsorted portion and swap it into place"
        engine={engine}
        legend={[
          { label: 'Current minimum', color: 'bg-indigo-400' },
          { label: 'Comparing', color: 'bg-amber-400' },
          { label: 'Sorted', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Sorted boundary', value: state.boundary },
          { label: 'Comparisons', value: state.comparisons },
          { label: 'Swaps', value: state.swaps },
        ]}
        canvas={<BarArray3D values={state.array} states={state.states} />}
        customInput={<ArrayInput defaultValues={SELECTION_SORT_ARRAY} onApply={setCustomArray} />}
      />
      <TopicNotes notes={selectionSortNotes} />
    </>
  )
}

export default SelectionSortVisualizer
