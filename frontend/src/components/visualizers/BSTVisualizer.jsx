import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, Scene3D, Box3D, Edge3D, useSimulationEngine } from '../../simulation'
import { buildBstSteps, bstNotes } from '../../simulation-data/bstOps'

function BSTVisualizer() {
  const steps = useMemo(() => buildBstSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const { nodes, edges, highlightId, path } = state

  return (
    <>
      <VisualizationShell
        title="Binary Search Tree"
        subtitle="Insert, search, and see how ordering keeps every path short — in real 3D"
        engine={engine}
        legend={[
          { label: 'Node', color: 'bg-blue-500' },
          { label: 'New / current', color: 'bg-amber-500' },
          { label: 'On search path', color: 'bg-purple-500' },
        ]}
        metrics={[{ label: 'Nodes', value: nodes.length }]}
        canvas={
          <Scene3D height={320}>
            <div style={{ position: 'relative', width: 420, height: 300 }}>
              <AnimatePresence>
                {edges.map((e) => (
                  <Edge3D key={`${e.from.id}-${e.to.id}`} animateKey={`${e.from.id}-${e.to.id}`} from={e.from} to={e.to} />
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {nodes.map((n) => {
                  const color = n.id === highlightId ? 'amber' : path?.includes(n.id) ? 'purple' : 'blue'
                  return (
                    <Box3D
                      key={n.id}
                      animateKey={n.id}
                      x={n.x}
                      y={n.y}
                      z={0}
                      width={52}
                      height={52}
                      depth={36}
                      color={color}
                      label={n.value}
                    />
                  )
                })}
              </AnimatePresence>
            </div>
          </Scene3D>
        }
        footnote="Drag the scene to rotate and inspect the tree's shape from any angle."
      />
      <TopicNotes notes={bstNotes} />
    </>
  )
}

export default BSTVisualizer
