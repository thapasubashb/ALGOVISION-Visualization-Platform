import SearchVisualizer from '../SearchVisualizer'
import { binarySearchTrace } from '../../algorithms/binarySearch'

function getBarColor(step, index) {
  if (index === step.found) return 'bg-green-400'
  if (index === step.mid) return 'bg-amber-400'
  if (index >= step.low && index <= step.high) return 'bg-sky-200'
  return 'bg-slate-300'
}

function BinarySearchVisualizer() {
  return (
    <SearchVisualizer
      title="Binary Search"
      initialArray={[8, 3, 6, 1, 9, 4]}
      initialTarget={9}
      traceFn={binarySearchTrace}
      getBarColor={getBarColor}
      note="Binary search needs sorted data — your input will be sorted automatically first."
    />
  )
}

export default BinarySearchVisualizer