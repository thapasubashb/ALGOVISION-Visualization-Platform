import { useParams, Link } from 'react-router-dom'
import BubbleSortVisualizer from '../components/visualizers/BubbleSortVisualizer'
import SelectionSortVisualizer from '../components/visualizers/SelectionSortVisualizer'
import InsertionSortVisualizer from '../components/visualizers/InsertionSortVisualizer'

const visualizers = {
  'bubble-sort': BubbleSortVisualizer,
  'selection-sort': SelectionSortVisualizer,
  'insertion-sort': InsertionSortVisualizer,
}

function AlgorithmPage() {
  const { algorithmId } = useParams()
  const Visualizer = visualizers[algorithmId]

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <Link to="/dsa" className="text-sm text-blue-600 hover:underline">
        ← Back to all algorithms
      </Link>

      <div className="mt-4">
        {Visualizer ? <Visualizer /> : (
          <p className="text-slate-500 mt-8">This visualizer isn't built yet — coming soon.</p>
        )}
      </div>
    </main>
  )
}

export default AlgorithmPage