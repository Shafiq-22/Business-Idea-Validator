import { useState, useEffect } from 'react'

const PHASES = [
  { label: 'Scanning Pain Points', icon: '⚡', desc: 'Reddit, YouTube, forums' },
  { label: 'Mapping Market',       icon: '🔭', desc: 'Competitors & gaps' },
  { label: 'Scoring & Verdict',    icon: '⚖️', desc: 'Viability analysis' },
]

export default function LoadingScreen({ idea }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setActivePhaseIndex(1), 5000)
    const t2 = setTimeout(() => setActivePhaseIndex(2), 11000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div style={{
      maxWidth: 620,
      margin: '0 auto',
      padding: '80px 24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 16, height: 1, background: 'var(--red)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,59,92,0.7)' }}>
            Analysis in progress
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.5 }}>
          Researching: <span style={{ color: 'var(--text)', fontStyle: 'italic' }}>"{idea}"</span>
        </p>
      </div>

      {/* Phase list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {PHASES.map((phase, i) => {
          const isDone = i < activePhaseIndex
          const isActive = i === activePhaseIndex
          const isPending = i > activePhaseIndex

          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 16px',
              borderRadius: 4,
              background: isActive ? 'rgba(255,59,92,0.04)' : 'transparent',
              border: isActive ? '1px solid rgba(255,59,92,0.12)' : '1px solid transparent',
              transition: 'all 0.3s',
            }}>
              {/* Icon box */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isDone ? 14 : 18,
                background: isDone
                  ? 'rgba(0,232,122,0.08)'
                  : isActive
                    ? 'rgba(255,59,92,0.08)'
                    : 'rgba(255,255,255,0.02)',
                border: isDone
                  ? '1px solid rgba(0,232,122,0.2)'
                  : isActive
                    ? '1px solid rgba(255,59,92,0.2)'
                    : '1px solid var(--border)',
                flexShrink: 0,
                transition: 'all 0.3s',
              }}>
                {isDone ? '✓' : phase.icon}
              </div>

              {/* Labels */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  color: isDone ? 'var(--green)' : isActive ? 'var(--text)' : 'var(--text-dim)',
                  marginBottom: 2,
                  transition: 'color 0.3s',
                }}>
                  {phase.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {phase.desc}
                </div>
              </div>

              {/* Status text */}
              <div style={{
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: isDone ? 'var(--green)' : isActive ? 'var(--red)' : 'var(--text-dim)',
                animation: isActive ? 'pulse 1.4s ease-in-out infinite' : 'none',
                flexShrink: 0,
              }}>
                {isDone ? 'done' : isActive ? 'working' : 'queued'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <p style={{
        marginTop: 40,
        fontSize: 11,
        color: 'var(--text-dim)',
        textAlign: 'center',
      }}>
        This typically takes 20–40 seconds
      </p>
    </div>
  )
}
