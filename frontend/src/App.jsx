import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DSAPage from "./pages/DSAPage";
import AlgorithmPage from "./pages/AlgorithmPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import ChatWidget from "./components/ChatWidget";
import { AuthProvider } from "./context/AuthContext";
import ComparePage from "./pages/ComparePage";
import SubjectPage from "./pages/SubjectPage";
import SubjectTopicPage from "./pages/SubjectTopicPage";
import { dbmsTopics } from "./data/dbmsTopics";
import { cnTopics } from "./data/cnTopics";
import { osTopics } from "./data/osTopics";
import SqlJoinsVisualizer from "./components/visualizers/SqlJoinsVisualizer";
import SqlCrudVisualizer from "./components/visualizers/SqlCrudVisualizer";
import ErModelVisualizer from "./components/visualizers/ErModelVisualizer";
import KeysConstraintsVisualizer from "./components/visualizers/KeysConstraintsVisualizer";
import NormalizationVisualizer from "./components/visualizers/NormalizationVisualizer";
import IndexingVisualizer from "./components/visualizers/IndexingVisualizer";
import BPlusTreeVisualizer from "./components/visualizers/BPlusTreeVisualizer";
import TransactionsVisualizer from "./components/visualizers/TransactionsVisualizer";
import ConcurrencyVisualizer from "./components/visualizers/ConcurrencyVisualizer";
import DeadlockVisualizer from "./components/visualizers/DeadlockVisualizer";
import TcpHandshakeVisualizer from "./components/visualizers/TcpHandshakeVisualizer";
import OsiModelVisualizer from "./components/visualizers/OsiModelVisualizer";
import TcpIpModelVisualizer from "./components/visualizers/TcpIpModelVisualizer";
import IpAddressingVisualizer from "./components/visualizers/IpAddressingVisualizer";
import ArpVisualizer from "./components/visualizers/ArpVisualizer";
import DnsVisualizer from "./components/visualizers/DnsVisualizer";
import HttpVisualizer from "./components/visualizers/HttpVisualizer";
import RoutingVisualizer from "./components/visualizers/RoutingVisualizer";
import CongestionVisualizer from "./components/visualizers/CongestionVisualizer";
import SubnettingVisualizer from "./components/visualizers/SubnettingVisualizer";
import RoundRobinVisualizer from "./components/visualizers/RoundRobinVisualizer";
import ProcessStatesVisualizer from "./components/visualizers/ProcessStatesVisualizer";
import FcfsVisualizer from "./components/visualizers/FcfsVisualizer";
import SjfSrtfVisualizer from "./components/visualizers/SjfSrtfVisualizer";
import PrioritySchedulingVisualizer from "./components/visualizers/PrioritySchedulingVisualizer";
import FifoPageReplacementVisualizer from "./components/visualizers/FifoPageReplacementVisualizer";
import LruPageReplacementVisualizer from "./components/visualizers/LruPageReplacementVisualizer";
import MemoryAllocationVisualizer from "./components/visualizers/MemoryAllocationVisualizer";
import BankersAlgorithmVisualizer from "./components/visualizers/BankersAlgorithmVisualizer";
import DiskSchedulingVisualizer from "./components/visualizers/DiskSchedulingVisualizer";

const dbmsVisualizers = {
  "sql-joins": SqlJoinsVisualizer,
  "sql-crud": SqlCrudVisualizer,
  "er-model": ErModelVisualizer,
  "keys-constraints": KeysConstraintsVisualizer,
  "normalization": NormalizationVisualizer,
  "indexing": IndexingVisualizer,
  "b-plus-tree": BPlusTreeVisualizer,
  "transactions-acid": TransactionsVisualizer,
  "concurrency-control": ConcurrencyVisualizer,
  "deadlocks-dbms": DeadlockVisualizer,
};
const cnVisualizers = {
  "tcp-handshake": TcpHandshakeVisualizer,
  "osi-model": OsiModelVisualizer,
  "tcp-ip-model": TcpIpModelVisualizer,
  "ip-addressing": IpAddressingVisualizer,
  "arp": ArpVisualizer,
  "dns": DnsVisualizer,
  "http-https": HttpVisualizer,
  "routing": RoutingVisualizer,
  "congestion-control": CongestionVisualizer,
  "subnetting": SubnettingVisualizer,
};
const osVisualizers = {
  "round-robin": RoundRobinVisualizer,
  "process-states": ProcessStatesVisualizer,
  "fcfs": FcfsVisualizer,
  "sjf-srtf": SjfSrtfVisualizer,
  "priority-scheduling": PrioritySchedulingVisualizer,
  "fifo-page-replacement": FifoPageReplacementVisualizer,
  "lru-page-replacement": LruPageReplacementVisualizer,
  "memory-allocation": MemoryAllocationVisualizer,
  "bankers-algorithm": BankersAlgorithmVisualizer,
  "disk-scheduling": DiskSchedulingVisualizer,
};


function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/dsa" element={<DSAPage />} />
          <Route path="/dsa/compare" element={<ComparePage />} />
          <Route path="/" element={<Home />} />
          <Route path="/dsa/:algorithmId" element={<AlgorithmPage />} />

          <Route
            path="/os"
            element={<SubjectPage heading="Choose an OS topic to visualize" topics={osTopics} basePath="/os" />}
          />
          <Route
            path="/os/:topicId"
            element={<SubjectTopicPage topics={osTopics} visualizers={osVisualizers} basePath="/os" backLabel="Back to all OS topics" />}
          />
          <Route
            path="/cn"
            element={<SubjectPage heading="Choose a Computer Networks topic to visualize" topics={cnTopics} basePath="/cn" />}
          />
          <Route
            path="/cn/:topicId"
            element={<SubjectTopicPage topics={cnTopics} visualizers={cnVisualizers} basePath="/cn" backLabel="Back to all CN topics" />}
          />
          <Route
            path="/dbms"
            element={<SubjectPage heading="Choose a DBMS topic to visualize" topics={dbmsTopics} basePath="/dbms" />}
          />
          <Route
            path="/dbms/:topicId"
            element={<SubjectTopicPage topics={dbmsTopics} visualizers={dbmsVisualizers} basePath="/dbms" backLabel="Back to all DBMS topics" />}
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
        <ChatWidget />
      </div>
    </AuthProvider>
  );
}

export default App;
