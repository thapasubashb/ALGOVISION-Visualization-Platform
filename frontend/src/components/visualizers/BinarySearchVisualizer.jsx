import { useMemo, useState } from 'react'
import { VisualizationShell, TopicNotes, BarArray3D, ArrayInput, useSimulationEngine } from '../../simulation'
import { buildBinarySearchSteps, BINARY_SEARCH_ARRAY, BINARY_SEARCH_TARGET, binarySearchNotes } from '../../simulation-data/binarySearch'

function BinarySearchVisualizer() {
  const [customArray, setCustomArray] = useState(null)
  const [target, setTarget] = useState(BINARY_SEARCH_TARGET)
  const array = customArray ? [...customArray].sort((a, b) => a - b) : BINARY_SEARCH_ARRAY
  const steps = useMemo(() => buildBinarySearchSteps(customArray, target), [customArray, target])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  const states = array.map((_, i) => {
    if (i === state.found) return 'sorted'
    if (i === state.mid) return 'compare'
    if (i < state.lo || i > state.hi) return 'default'
    return 'active'
  })

  const handleApply = (values) => {
    const sorted = [...values].sort((a, b) => a - b)
    setCustomArray(values)
    setTarget(sorted[Math.floor(sorted.length / 2)])
  }

  return (
    <>
      <VisualizationShell
        title="Binary Search"
        subtitle={`Searching for ${target} in a sorted array by halving the range`}
        engine={engine}
        legend={[
          { label: 'In range', color: 'bg-indigo-400' },
          { label: 'Checking (mid)', color: 'bg-amber-400' },
          { label: 'Found', color: 'bg-teal-400' },
        ]}
        metrics={[
          { label: 'Range', value: state.lo <= state.hi ? `[${state.lo}, ${state.hi}]` : '—' },
          { label: 'Comparisons', value: state.comparisons },
        ]}
        canvas={<BarArray3D values={array} states={states} />}
        customInput={<ArrayInput defaultValues={BINARY_SEARCH_ARRAY} onApply={handleApply} />}
        footnote="Your numbers are automatically sorted first, since Binary Search requires sorted input."
      />
      <TopicNotes notes={binarySearchNotes} />
    </>
  )
}

export default BinarySearchVisualizer
