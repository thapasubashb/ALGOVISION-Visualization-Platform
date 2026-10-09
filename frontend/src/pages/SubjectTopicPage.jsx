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
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-10">
        <Link to={basePath} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← {backLabel}
        </Link>

        <div className="mt-4">
          {topic && <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{topic.name}</h1>}

          {Visualizer ? (
            <Visualizer />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 mt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                {topic ? `${topic.name} isn't built yet — coming soon.` : "This topic isn't built yet — coming soon."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default SubjectTopicPage
