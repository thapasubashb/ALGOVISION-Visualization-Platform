function ComingSoonPage({ title, description }) {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
        <span className="inline-block mt-6 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          Coming soon
        </span>
      </div>
    </main>
  )
}

export default ComingSoonPage