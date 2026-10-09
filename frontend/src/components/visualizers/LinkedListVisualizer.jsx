import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, Scene3D, Box3D, useSimulationEngine } from '../../simulation'
import { buildLinkedListSteps, linkedListNotes } from '../../simulation-data/linkedListOps'

const SPACING = 130

function LinkedListVisualizer() {
  const steps = useMemo(() => buildLinkedListSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const { nodes, highlightIndex, found } = state

  const totalWidth = Math.max(nodes.length - 1, 0) * SPACING

  return (
    <>
      <VisualizationShell
        title="Linked List Operations"
        subtitle="Insert, search, delete, and reverse a chain of connected nodes — in real 3D"
        engine={engine}
        legend={[
          { label: 'Node', color: 'bg-blue-500' },
          { label: 'Current / traversing', color: 'bg-amber-500' },
          { label: 'Found', color: 'bg-teal-500' },
        ]}
        metrics={[{ label: 'Nodes', value: nodes.length }]}
        canvas={
          <Scene3D height={260}>
            <div style={{ position: 'relative', width: totalWidth + 80, height: 64 }}>
              <AnimatePresence>
                {nodes.map((n, i) => {
                  const color = found && i === highlightIndex ? 'teal' : i === highlightIndex ? 'amber' : 'blue'
                  return (
                    <Box3D
                      key={n.id}
                      animateKey={n.id}
                      x={i * SPACING - totalWidth / 2}
                      y={0}
                      z={0}
                      width={64}
                      height={64}
                      depth={40}
                      color={color}
                      label={n.value}
                      sublabel={i === 0 ? 'HEAD' : undefined}
                    />
                  )
                })}
              </AnimatePresence>
              <AnimatePresence>
                {nodes.slice(0, -1).map((n, i) => (
                  <Box3D
                    key={`link-${n.id}`}
                    animateKey={`link-${n.id}`}
                    x={i * SPACING - totalWidth / 2 + SPACING / 2}
                    y={0}
                    z={0}
                    width={SPACING - 64}
                    height={6}
                    depth={6}
                    color="slate"
                    label=""
                  />
                ))}
              </AnimatePresence>
            </div>
          </Scene3D>
        }
        footnote="Drag the scene to rotate and inspect the chain from any angle."
      />
      <TopicNotes notes={linkedListNotes} />
    </>
  )
}

export default LinkedListVisualizer
