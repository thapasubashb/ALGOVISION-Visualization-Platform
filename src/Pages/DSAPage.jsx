import { Link } from 'react-router-dom'
import AlgorithmCard from '../components/AlgorithmCard'
import { algorithms } from '../data/algorithms'

function DSAPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white px-6 pt-32 pb-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-700 mb-6">
          Choose an algorithm to visualize
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {algorithms.map((algo) => (
            <Link key={algo.id} to={`/dsa/${algo.id}`}>
              <AlgorithmCard {...algo} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export default DSAPage