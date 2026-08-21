import SearchVisualizer from '../SearchVisualizer'
import { binarySearchTrace } from '../../algorithms/binarySearch'

function renderVisual(step) {
  const count = step.array.length

  return (
    <div>
      <div className="flex justify-center items-center gap-3 mb-6">
        <p className="text-xs text-slate-400">Searching for</p>
        <div className="w-14 h-14 rounded-lg border-2 border-dashed border-pink-400 bg-pink-50 flex items-center justify-center font-bold text-lg text-pink-600">
          {step.target}
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-2 text-center">Sorted array</p>
      <div className="flex justify-center overflow-x-auto py-2">
        <div
          className="inline-grid gap-2 max-w-full"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 56px))` }}
        >
          {step.array.map((_, index) => {
            const label = index === step.mid ? 'mid' : index === step.low ? 'low' : index === step.high ? 'high' : null
            if (!label) return null
            return (
              <span
                key={`label-${index}`}
                style={{ gridColumn: index + 1, gridRow: 1 }}
                className={`text-xs font-semibold text-center whitespace-nowrap ${label === 'mid' ? 'text-amber-600' : 'text-sky-500'}`}
              >
                {label}
              </span>
            )
          })}

          {step.array.map((value, index) => {
            let boxStyle = 'bg-slate-50 border-slate-200 text-slate-300'
            if (index === step.found) boxStyle = 'bg-green-100 border-green-400 text-green-700'
            else if (index === step.mid) boxStyle = 'bg-amber-100 border-amber-400 text-amber-700'
            else if (index >= step.low && index <= step.high) boxStyle = 'bg-sky-50 border-sky-300 text-slate-700'

            return (
              <div key={index} style={{ gridColumn: index + 1, gridRow: 2 }} className="flex flex-col items-center">
                <div className={`w-full aspect-square max-w-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-colors duration-300 ${boxStyle}`}>
                  {value}
                </div>
                <span className="text-xs text-slate-400 mt-1">{index}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BinarySearchVisualizer() {
  return (
    <SearchVisualizer
      title="Binary Search"
      initialArray={[8, 3, 6, 1, 9, 4]}
      initialTarget={9}
      traceFn={binarySearchTrace}
      renderVisual={renderVisual}
      note="Binary search needs sorted data — your input will be sorted automatically first."
    />
  )
}

export default BinarySearchVisualizer