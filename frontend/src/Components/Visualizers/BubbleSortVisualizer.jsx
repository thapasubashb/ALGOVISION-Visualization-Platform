import SortingVisualizer from '../SortingVisualizer'
import { bubbleSortTrace } from '../../algorithms/bubbleSort'

function getBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  return 'bg-slate-300'
}

function BubbleSortVisualizer() {
  return (
    <SortingVisualizer
      title="Bubble Sort"
      initialArray={[8, 3, 6, 1, 9, 4]}
      traceFn={bubbleSortTrace}
      getBarColor={getBarColor}
    />
  )
}

export default BubbleSortVisualizer