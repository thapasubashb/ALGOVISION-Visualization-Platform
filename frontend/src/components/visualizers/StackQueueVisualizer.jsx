import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, Scene3D, Box3D, useSimulationEngine } from '../../simulation'
import { buildStackQueueSteps, stackQueueNotes } from '../../simulation-data/stackQueueOps'

function StackQueueVisualizer() {
  const steps = useMemo(() => buildStackQueueSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const isStack = state.mode === 'stack'

  return (
    <>
      <VisualizationShell
        title="Stack & Queue"
        subtitle="LIFO push/pop on a stack, FIFO enqueue/dequeue on a queue — in real 3D"
        engine={engine}
        legend={[
          { label: isStack ? 'Top of stack' : 'Back (newest)', color: 'bg-amber-500' },
          { label: 'Item', color: 'bg-blue-500' },
        ]}
        metrics={[
          { label: 'Structure', value: isStack ? 'Stack' : 'Queue' },
          { label: 'Size', value: isStack ? state.items.length : state.queueItems.length },
        ]}
        canvas={
          <Scene3D height={280}>
            {isStack ? (
              <div style={{ position: 'relative', width: 100, height: 260 }}>
                <AnimatePresence>
                  {state.items.map((it, i) => (
                    <Box3D
                      key={it.id}
                      animateKey={it.id}
                      x={0}
                      y={110 - i * 56}
                      z={0}
                      width={72}
                      height={48}
                      depth={44}
                      color={i === state.highlight ? 'amber' : 'blue'}
                      label={it.value}
                      sublabel={i === state.items.length - 1 ? 'TOP' : undefined}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ position: 'relative', width: 340, height: 80 }}>
                <AnimatePresence>
                  {state.queueItems.map((it, i) => (
                    <Box3D
                      key={it.id}
                      animateKey={it.id}
                      x={i * 84 - (state.queueItems.length - 1) * 42}
                      y={0}
                      z={0}
                      width={64}
                      height={64}
                      depth={40}
                      color={i === state.highlight ? 'amber' : 'blue'}
                      label={it.value}
                      sublabel={i === 0 ? 'FRONT' : i === state.queueItems.length - 1 ? 'BACK' : undefined}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Scene3D>
        }
        footnote="Drag the scene to rotate. First the stack demo runs, then the queue demo."
      />
      <TopicNotes notes={stackQueueNotes} />
    </>
  )
}

export default StackQueueVisualizer
