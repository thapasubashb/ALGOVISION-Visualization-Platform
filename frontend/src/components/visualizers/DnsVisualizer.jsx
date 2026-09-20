import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationShell, TopicNotes, StatusBadge, useSimulationEngine } from '../../simulation'
import { buildDnsSteps, dnsChain, dnsDomain, dnsNotes } from '../../simulation-data/dns'

function ChainNode({ label, index, activeIndex, skipped }) {
  const isActive = index === activeIndex
  return (
    <motion.div
      animate={{ scale: isActive ? 1.08 : 1 }}
      className={`flex flex-col items-center justify-center w-24 h-16 rounded-lg border-2 text-[11px] font-bold text-center px-1 shrink-0 ${
        isActive ? 'border-blue-400 bg-blue-50 text-blue-700 av-glow' : skipped ? 'border-slate-100 bg-slate-50 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {label}
    </motion.div>
  )
}

function DnsVisualizer() {
  const steps = useMemo(() => buildDnsSteps(), [])
  const engine = useSimulationEngine(steps)
  const { state } = engine.currentStep

  return (
    <>
      <VisualizationShell
        title="DNS Resolution"
        subtitle={`Resolving ${dnsDomain} — with and without a warm cache`}
        engine={engine}
        legend={[
          { label: 'Currently querying', color: 'bg-blue-400' },
          { label: 'Skipped (cached)', color: 'bg-slate-200' },
        ]}
        metrics={[
          { label: 'Mode', value: state.cached ? 'Cached (fast path)' : 'Cold lookup' },
          { label: 'Resolved IP', value: state.resolvedIp || '—' },
        ]}
        canvas={
          <div className="min-w-[520px] flex flex-col items-center gap-4 py-2">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {dnsChain.map((label, i) => {
                const skipped = state.mode === 'cached' && i >= 2
                return (
                  <div key={label} className="flex items-center gap-2">
                    <ChainNode label={label} index={i} activeIndex={state.activeIndex} skipped={skipped} />
                    {i < dnsChain.length - 1 && <span className="text-slate-300">→</span>}
                  </div>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              {state.resolvedIp && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                  <StatusBadge tone="success">{dnsDomain} → {state.resolvedIp}</StatusBadge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />
      <TopicNotes notes={dnsNotes} />
    </>
  )
}

export default DnsVisualizer
