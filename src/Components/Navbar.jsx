import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        Algo<span className="text-blue-400">Vision</span>
      </Link>
      <div className="flex gap-5 text-sm text-slate-300">
        <Link to="/dsa" className="hover:text-white">
          DSA
        </Link>
        <Link to="/os" className="hover:text-white">
          OS
        </Link>
        <Link to="/cn" className="hover:text-white">
          CN
        </Link>
        <Link to="/dbms" className="hover:text-white">
          DBMS
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
