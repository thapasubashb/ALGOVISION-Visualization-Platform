import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, useSimulationEngine } from '../../simulation'
import { buildBPlusTreeSteps, bPlusTreeNotes } from '../../simulation-data/bPlusTree'

function NodeBox({ node, focusNodeId, searchKey, found }) {
  const isFocused = node.id === focusNodeId
  const showFoundGlow = isFocused && node.leaf && found === true

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`flex gap-1 px-2 py-1.5 rounded-md border-2 shrink-0 ${
        showFoundGlow ? 'bg-teal-50 border-teal-400 av-glow-success' : isFocused ? 'bg-blue-50 border-blue-400 av-glow' : node.leaf ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-400'
      }`}
    >
      <AnimatePresence initial={false}>
        {node.keys.map((k) => (
          <motion.span
            key={k}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${searchKey === k && found ? 'bg-teal-500 text-white' : 'text-slate-700'}`}
          >
            {k}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

function TreeLevel({ node, focusNodeId, searchKey, found }) {
  if (!node) return <p className="text-xs text-slate-400 italic">empty tree</p>

  if (node.leaf) {
    return <NodeBox node={node} focusNodeId={focusNodeId} searchKey={searchKey} found={found} />
  }

  return (
    <div className="flex flex-col items-center">
      <NodeBox node={node} focusNodeId={focusNodeId} searchKey={searchKey} found={found} />
      <div className="w-full h-3 border-b-2 border-slate-200 mt-2" style={{ maxWidth: node.children.length * 90 }} />
      <div className="flex items-start gap-4 mt-0">
        {node.children.map((child, i) => (
          <div key={child.id} className="flex flex-col items-center">
            <div className="w-px h-3 bg-slate-200" />
            <TreeLevel node={child} focusNodeId={focusNodeId} searchKey={searchKey} found={found} />
            {i < node.children.length - 1 && node.children[i].leaf && (
              <span className="absolute translate-x-[52px] translate-y-[14px] text-slate-300 text-xs">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BPlusTreeVisualizer() {
  const steps = useMemo(() => buildBPlusTreeSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="B+ Tree"
        subtitle="Order-3 B+ tree — inserting 10, 20, 5, 6, 12, 30, then searching for 12"
        engine={engine}
        legend={[
          { label: 'Being modified', color: 'bg-blue-400' },
          { label: 'Found', color: 'bg-teal-400' },
          { label: 'Internal (routing) node', color: 'bg-slate-400' },
        ]}
        canvas={
          <div className="min-w-[480px] flex justify-center py-4 relative">
            <TreeLevel node={state.tree} focusNodeId={state.focusNodeId} searchKey={state.searchKey} found={state.found} />
          </div>
        }
        footnote="Order 3 (max 2 keys/node) is used here purely so splits happen often enough to see — real indexes use a much higher order."
      />
      <TopicNotes notes={bPlusTreeNotes} />
    </>
  )
}

export default BPlusTreeVisualizer
