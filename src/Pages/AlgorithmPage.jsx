import { useParams, Link } from 'react-router-dom'
import BubbleSortVisualizer from '../components/visualizers/BubbleSortVisualizer'
import SelectionSortVisualizer from '../components/visualizers/SelectionSortVisualizer'
import InsertionSortVisualizer from '../components/visualizers/InsertionSortVisualizer'
import MergeSortVisualizer from '../components/visualizers/MergeSortVisualizer'
import QuickSortVisualizer from '../components/visualizers/QuickSortVisualizer'
import LinearSearchVisualizer from '../components/visualizers/LinearSearchVisualizer'
import BinarySearchVisualizer from '../components/visualizers/BinarySearchVisualizer'
import LinkedListVisualizer from '../components/visualizers/LinkedListVisualizer'
import StackQueueVisualizer from '../components/visualizers/StackQueueVisualizer'
import BSTVisualizer from '../components/visualizers/BSTVisualizer'
const visualizers = {
  'bubble-sort': BubbleSortVisualizer,
  'selection-sort': SelectionSortVisualizer,
  'insertion-sort': InsertionSortVisualizer,
  'merge-sort': MergeSortVisualizer,
  'quick-sort': QuickSortVisualizer,
  'linear-search': LinearSearchVisualizer,
  'binary-search': BinarySearchVisualizer,
  'linked-list': LinkedListVisualizer,
  'stack-queue': StackQueueVisualizer,
  'bst': BSTVisualizer,
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