import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DSAPage from "./Pages/DSAPage";
import AlgorithmPage from "./pages/AlgorithmPage";
import ComingSoonPage from "./pages/ComingSoonPage";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dsa" element={<DSAPage />} />
        <Route path="/dsa/:algorithmId" element={<AlgorithmPage />} />

        <Route
          path="/os"
          element={
            <ComingSoonPage
              title="Operating Systems"
              description="CPU scheduling, memory management, and deadlock visualizations are on the way."
            />
          }
        />
        <Route
          path="/cn"
          element={
            <ComingSoonPage
              title="Computer Networks"
              description="Routing algorithms, TCP handshakes, and subnetting visualizations are on the way."
            />
          }
        />
        <Route
          path="/dbms"
          element={
            <ComingSoonPage
              title="Database Management"
              description="Indexing, B-trees, and query execution visualizations are on the way."
            />
          }
        />
        <Route
          path="/about"
          element={
            <ComingSoonPage
              title="About AlgoVision"
              description="A short project story is coming soon."
            />
          }
        />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </div>
  );
}

export default App;
