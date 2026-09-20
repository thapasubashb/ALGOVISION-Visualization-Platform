import { useParams, Link } from 'react-router-dom'

/**
 * Shared detail route for DBMS / CN / OS topics — mirrors AlgorithmPage's
 * layout and "not built yet" fallback so every subject behaves the same way.
 */
function SubjectTopicPage({ topics, visualizers, basePath, backLabel }) {
  const { topicId } = useParams()
  const topic = topics.find((t) => t.id === topicId)
  const Visualizer = visualizers[topicId]

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <Link to={basePath} className="text-sm text-blue-600 hover:underline">
        ← {backLabel}
      </Link>

      <div className="mt-4">
        {topic && <h1 className="text-2xl font-bold text-slate-800">{topic.name}</h1>}

        {Visualizer ? (
          <Visualizer />
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 mt-6 text-center">
            <p className="text-slate-500">
              {topic ? `${topic.name} isn't built yet — coming soon.` : "This topic isn't built yet — coming soon."}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default SubjectTopicPage
