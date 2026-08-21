import SortingVisualizer from '../SortingVisualizer'
import { quickSortTrace } from '../../algorithms/quickSort'

function getBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (index === step.pivotIndex) return 'bg-pink-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.range && index >= step.range[0] && index <= step.range[1]) return 'bg-sky-200'
  return 'bg-slate-300'
}

function QuickSortVisualizer() {
  return (
    <SortingVisualizer
      title="Quick Sort"
      initialArray={[8, 3, 6, 1, 9, 4, 2]}
      traceFn={quickSortTrace}
      getBarColor={getBarColor}
    />
  )
}

export default QuickSortVisualizer