import { useMemo } from 'react'
import { VisualizationShell, TopicNotes, Scene3D, Box3D, Edge3D, useSimulationEngine } from '../../simulation'
import { buildGraphTraversalSteps, GRAPH_NODES, GRAPH_EDGES, graphTraversalNotes } from '../../simulation-data/graphTraversal'

function GraphVisualizer() {
  const steps = useMemo(() => buildGraphTraversalSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep
  const { mode, visited, frontier, current, order } = state

  return (
    <>
      <VisualizationShell
        title="Graph Traversal (BFS & DFS)"
        subtitle="The same graph, explored two different ways — in real 3D"
        engine={engine}
        legend={[
          { label: 'Visited', color: 'bg-teal-500' },
          { label: 'Current', color: 'bg-amber-500' },
          { label: 'Unvisited', color: 'bg-blue-500' },
        ]}
        metrics={[
          { label: 'Algorithm', value: mode.toUpperCase() },
          { label: mode === 'bfs' ? 'Queue' : 'Stack', value: frontier.length ? `[${frontier.join(', ')}]` : '—' },
        ]}
        canvas={
          <Scene3D height={340}>
            <div style={{ position: 'relative', width: 380, height: 260 }}>
              {GRAPH_EDGES.map(([a, b]) => (
                <Edge3D key={`${a}-${b}`} from={GRAPH_NODES[a]} to={GRAPH_NODES[b]} />
              ))}
              {Object.entries(GRAPH_NODES).map(([id, pos]) => {
                const color = id === current ? 'amber' : visited.includes(id) ? 'teal' : 'blue'
                return (
                  <Box3D
                    key={id}
                    animateKey={id}
                    x={pos.x}
                    y={pos.y}
                    z={pos.z}
                    width={48}
                    height={48}
                    depth={34}
                    color={color}
                    label={id}
                  />
                )
              })}
            </div>
          </Scene3D>
        }
        footnote={order.length > 0 ? `Visit order so far: ${order.join(' → ')}` : 'Drag the scene to rotate.'}
      />
      <TopicNotes notes={graphTraversalNotes} />
    </>
  )
}

export default GraphVisualizer
