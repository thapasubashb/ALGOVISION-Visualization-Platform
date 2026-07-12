import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-sky-200 text-slate-800 px-6 py-14">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-10">
        <div className="max-w-xs">
          <p className="text-slate-900 text-lg font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
            Algo<span className="text-blue-600">Vision</span>
          </p>
          <p className="text-sm text-slate-700">
            An interactive platform for learning CS concepts by watching them happen, one step at a time.
          </p>
        </div>

        <div className="flex gap-16 flex-wrap">
          <div>
            <p className="text-slate-900 text-sm font-semibold mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link to="/dsa" className="hover:text-blue-600 transition-colors">DSA</Link></li>
              <li><Link to="/os" className="hover:text-blue-600 transition-colors">OS</Link></li>
              <li><Link to="/cn" className="hover:text-blue-600 transition-colors">CN</Link></li>
              <li><Link to="/dbms" className="hover:text-blue-600 transition-colors">DBMS</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-slate-900 text-sm font-semibold mb-3">Connect</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <a
                  href="https://github.com/thapasubashb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  🐙 github.com/thapasubashb
                </a>
              </li>
              <li>
                <a
                  href="mailto:thapasubash9072@gmail.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  ✉️ thapasubash9072@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/subash-b-2829a1354/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  🌐 LinkedIn of B.Subash
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer