function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold tracking-tight">
        Algo<span className="text-blue-400">Vision</span>
      </h1>
      <p className="text-sm text-slate-400 hidden sm:block">
        Visualize. Understand. Master.
      </p>
    </nav>
  );
}

export default Navbar;
