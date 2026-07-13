import SortingVisualizer from '../SortingVisualizer'
import { insertionSortTrace } from '../../algorithms/insertionSort'

function getBarColor(step, index) {
  if (index === step.keyIndex) return 'bg-purple-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  return 'bg-slate-300'
}

function InsertionSortVisualizer() {
  return (
    <SortingVisualizer
      title="Insertion Sort"
      initialArray={[8, 3, 6, 1, 9, 4]}
      traceFn={insertionSortTrace}
      getBarColor={getBarColor}
    />
  )
}

export default InsertionSortVisualizer