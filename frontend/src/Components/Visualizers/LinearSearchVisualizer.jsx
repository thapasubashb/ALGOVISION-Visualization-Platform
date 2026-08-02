import { motion } from 'framer-motion'
import SearchVisualizer from '../SearchVisualizer'
import { linearSearchTrace } from '../../algorithms/linearSearch'

function renderVisual(step) {
  const pointerIndex = step.found !== null ? step.found : (step.comparing[0] ?? null)
  const count = step.array.length

  return (
    <div className="flex justify-center overflow-x-auto py-2">
      <div
        className="inline-grid gap-2 max-w-full"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 56px))` }}
      >
        {pointerIndex !== null && (
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ gridColumn: pointerIndex + 1, gridRow: 1 }}
            className="flex flex-col items-center mb-3"
          >
            <div className="w-full aspect-square max-w-14 rounded-lg border-2 border-dashed border-pink-400 bg-pink-50 flex items-center justify-center font-bold text-lg text-pink-600">
              {step.target}
            </div>
            <span className="text-xs text-pink-500 mt-1 whitespace-nowrap">↓ target</span>
          </motion.div>
        )}

        {step.array.map((value, index) => {
          let boxStyle = 'bg-white border-slate-300 text-slate-700'
          if (index === step.found) boxStyle = 'bg-green-100 border-green-400 text-green-700'
          else if (step.comparing.includes(index)) boxStyle = 'bg-amber-100 border-amber-400 text-amber-700'
          else if (step.checked.includes(index)) boxStyle = 'bg-slate-100 border-slate-200 text-slate-400'

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
  )
}

function LinearSearchVisualizer() {
  return (
    <SearchVisualizer
      title="Linear Search"
      initialArray={[8, 3, 6, 1, 9, 4]}
      initialTarget={9}
      traceFn={linearSearchTrace}
      renderVisual={renderVisual}
    />
  )
}

export default LinearSearchVisualizer