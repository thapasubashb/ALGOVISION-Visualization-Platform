import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildLinearSearchSteps, LINEAR_SEARCH_ARRAY, LINEAR_SEARCH_TARGET, linearSearchNotes } from '../../simulation-data/linearSearch'

function LinearSearchVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const [target, setTarget] = useState(LINEAR_SEARCH_TARGET)
  const array = customArray || LINEAR_SEARCH_ARRAY
  const steps = useMemo(() => buildLinearSearchSteps(customArray, target), [customArray, target])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const states = array.map((_, i) => {
    if (i === state.found) return 'sorted'
    if (i === state.current) return 'compare'
    return 'default'
  })

  const handleApply = (values) => {
    setCustomArray(values)
    setTarget(values[Math.floor(values.length / 2)])
  }

  return (
    <>
      <VisualizationShell
        title="Linear Search"
        subtitle={`Searching for ${target} by checking every element in order`}
        engine={engine}
        legend={[
          { label: 'Checking now', color: 'bg-amber-400' },
          { label: 'Found', color: 'bg-teal-400' },
        ]}
        metrics={[{ label: 'Comparisons', value: state.comparisons }, { label: 'Target', value: target }]}
        canvas={<BarArray3D values={array} states={states} />}
        customInput={<ArrayInput defaultValues={LINEAR_SEARCH_ARRAY} onApply={handleApply} />}
      />
      <TopicNotes notes={linearSearchNotes} />
    </>
  )
}

export default LinearSearchVisualizer
