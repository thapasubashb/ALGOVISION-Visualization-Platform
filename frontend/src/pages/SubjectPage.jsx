import { Link } from 'react-router-dom'
import AlgorithmCard from '../components/AlgorithmCard'

/**
 * Shared "choose a topic" grid for DBMS / CN / OS, styled identically to
 * DSAPage so every subject feels like part of the same application.
 */
function SubjectPage({ heading, topics, basePath }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 to-white px-6 pt-32 pb-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-700 mb-6">{heading}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {topics.map((topic) => (
            <Link key={topic.id} to={`${basePath}/${topic.id}`}>
              <AlgorithmCard {...topic} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export default SubjectPage
