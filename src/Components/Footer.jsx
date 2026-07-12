import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 mb-10">
          <div className="max-w-xs">
            <p
              className="text-white text-lg font-bold mb-2"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Algo<span className="text-blue-400">Vision</span>
            </p>
            <p
              className="text-sm text-slate-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              An interactive platform for learning CS concepts by watching them
              happen, one step at a time.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p
                className="text-white text-sm font-semibold mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/dsa"
                    className="hover:text-white transition-colors"
                  >
                    DSA
                  </Link>
                </li>
                <li>
                  <Link to="/os" className="hover:text-white transition-colors">
                    OS
                  </Link>
                </li>
                <li>
                  <Link to="/cn" className="hover:text-white transition-colors">
                    CN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dbms"
                    className="hover:text-white transition-colors"
                  >
                    DBMS
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p
                className="text-white text-sm font-semibold mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Project
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/thapasubashb/ALGOVISION-Visualization-Platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="border-t border-slate-800 pt-6 text-xs text-slate-500"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          © 2026 AlgoVision. Built as a final year engineering project.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
