import SearchVisualizer from '../SearchVisualizer'
import { linearSearchTrace } from '../../algorithms/linearSearch'

function getBarColor(step, index) {
  if (index === step.found) return 'bg-green-400'
  if (step.comparing.includes(index)) return 'bg-amber-400'
  if (step.checked.includes(index)) return 'bg-slate-200'
  return 'bg-slate-300'
}

function LinearSearchVisualizer() {
  return (
    <SearchVisualizer
      title="Linear Search"
      initialArray={[8, 3, 6, 1, 9, 4]}
      initialTarget={9}
      traceFn={linearSearchTrace}
      getBarColor={getBarColor}
    />
  )
}

export default LinearSearchVisualizer