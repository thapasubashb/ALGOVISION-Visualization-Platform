import SortingVisualizer from '../SortingVisualizer'
import { selectionSortTrace } from '../../algorithms/selectionSort'

function getBarColor(step, index) {
  if (step.sortedIndices.includes(index)) return 'bg-green-400'
  if (step.swapped.includes(index)) return 'bg-red-400'
  if (index === step.minIndex) return 'bg-purple-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  return 'bg-slate-300'
}

function SelectionSortVisualizer() {
  return (
    <SortingVisualizer
      title="Selection Sort"
      initialArray={[8, 3, 6, 1, 9, 4]}
      traceFn={selectionSortTrace}
      getBarColor={getBarColor}
    />
  )
}

export default SelectionSortVisualizer