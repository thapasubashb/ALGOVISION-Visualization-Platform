import { useParams, Link } from 'react-router-dom'
import BubbleSortVisualizer from '../components/visualizers/BubbleSortVisualizer'
import SelectionSortVisualizer from '../components/visualizers/SelectionSortVisualizer'

function AlgorithmPage() {
  const { algorithmId } = useParams()

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <Link to="/dsa" className="text-sm text-blue-600 hover:underline">
        ← Back to all algorithms
      </Link>

      <div className="mt-4">
        {algorithmId === 'bubble-sort' && <BubbleSortVisualizer />}
        {algorithmId === 'selection-sort' && <SelectionSortVisualizer />}
        {algorithmId !== 'bubble-sort' && algorithmId !== 'selection-sort' && (
          <p className="text-slate-500 mt-8">This visualizer isn't built yet — coming soon.</p>
        )}
      </div>
    </main>
  )
}

export default AlgorithmPage