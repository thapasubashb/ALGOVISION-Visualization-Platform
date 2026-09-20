const SECTION_ORDER = [
  ['what', 'What is this?'],
  ['why', 'Why is it needed?'],
  ['how', 'How does it work?'],
  ['observe', 'What to watch for in the animation'],
  ['outcome', 'Final outcome'],
  ['points', 'Important points'],
  ['complexity', 'Complexity / performance'],
  ['realWorld', 'Real-world relevance'],
]

/**
 * Renders the required teaching write-up for a topic: what/why/how,
 * what to observe, outcome, key points, complexity, real-world relevance.
 * `notes.points` may be a string or an array of strings (rendered as a list).
 */
function TopicNotes({ notes }) {
  if (!notes) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Concept notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {SECTION_ORDER.filter(([key]) => notes[key]).map(([key, heading]) => (
          <div key={key}>
            <h4 className="text-sm font-bold text-blue-700 mb-1">{heading}</h4>
            {Array.isArray(notes[key]) ? (
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {notes[key].map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{notes[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopicNotes
