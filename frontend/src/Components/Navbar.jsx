import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg shadow-sky-200/40 rounded-full px-6 py-3">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent shrink-0"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          AlgoVision
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          <Link to="/dsa" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">DSA</Link>
          <Link to="/os" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">OS</Link>
          <Link to="/cn" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">CN</Link>
          <Link to="/dbms" className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">DBMS</Link>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="hidden sm:inline text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/about" className="hidden sm:inline text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">About Us</Link>
          
          {/* Fixed the missing opening tag <a right here */}
          <a
            href="https://github.com/thapasubashb/ALGOVISION-Visualization-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-blue-600 transition-colors"
            aria-label="View source on GitHub"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar