import SortingVisualizer from '../SortingVisualizer'
import { mergeSortTrace } from '../../algorithms/mergeSort'

function getBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (index === step.placed) return 'bg-teal-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.range && index >= step.range[0] && index <= step.range[1]) return 'bg-sky-200'
  return 'bg-slate-300'
}

function MergeSortVisualizer() {
  return (
    <SortingVisualizer
      title="Merge Sort"
      initialArray={[8, 3, 6, 1, 9, 4, 2]}
      traceFn={mergeSortTrace}
      getBarColor={getBarColor}
    />
  )
}

export default MergeSortVisualizer