const VERDICT_CONFIG = {
  PROMISING: { color: '#00e87a', bg: 'rgba(0,232,122,0.08)', label: 'PROMISING' },
  NICHE:     { color: '#f5c542', bg: 'rgba(245,197,66,0.08)', label: 'NICHE PLAY' },
  RISKY:     { color: '#ff8c42', bg: 'rgba(255,140,66,0.08)', label: 'RISKY' },
  AVOID:     { color: '#ff3b5c', bg: 'rgba(255,59,92,0.08)', label: 'AVOID' },
}

const SCORE_LABELS = {
  painSeverity: 'Pain Severity',
  marketSize:   'Market Size',
  competition:  'Blue Ocean',
  feasibility:  'Feasibility',
  monetization: 'Monetization',
}

function scoreColor(val) {
  if (val >= 7) return '#00e87a'
  if (val >= 5) return '#f5c542'
  return '#ff3b5c'
}

function overallColor(val) {
  if (val >= 70) return '#00e87a'
  if (val >= 50) return '#f5c542'
  return '#ff3b5c'
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    }}>
      <span style={{
        fontSize: 9,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'rgba(255,59,92,0.6)',
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '20px 22px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SeverityBadge({ severity }) {
  const styles = {
    high:   { bg: 'rgba(255,59,92,0.12)',   color: '#ff3b5c' },
    medium: { bg: 'rgba(245,197,66,0.12)',   color: '#f5c542' },
    low:    { bg: 'rgba(0,232,122,0.12)',    color: '#00e87a' },
  }
  const s = styles[severity] || styles.low
  return (
    <span style={{
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
      borderRadius: 2,
      padding: '3px 7px',
      flexShrink: 0,
    }}>
      {severity}
    </span>
  )
}

export default function ResultScreen({ result, idea, onReset }) {
  const verdict = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.RISKY
  const oColor = overallColor(result.overallScore)

  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '40px 24px 80px',
    }}>
      {/* Idea title */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 16, height: 1, background: 'var(--red)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,59,92,0.7)' }}>
            Validation Report
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>"{idea}"</p>
      </div>

      {/* 1. Score hero row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Score circle */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 160, flex: '0 0 auto', padding: '28px 36px' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 64,
            color: oColor,
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {result.overallScore}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
            Score / 100
          </div>
        </Card>

        {/* Verdict box */}
        <div style={{
          flex: 1,
          minWidth: 220,
          background: verdict.bg,
          border: `1px solid ${verdict.color}30`,
          borderRadius: 4,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>
            Verdict
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: verdict.color,
            marginBottom: 12,
          }}>
            {verdict.label}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {result.verdictReason}
          </p>
        </div>
      </div>

      {/* 2. Summary */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Summary</SectionLabel>
        <div style={{
          borderLeft: '2px solid var(--red)',
          paddingLeft: 16,
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.7,
        }}>
          {result.summary}
        </div>
      </div>

      {/* 3. Score bars */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Scores</SectionLabel>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const val = result.scores?.[key] ?? 0
              const color = scoreColor(val)
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontSize: 12, color, fontWeight: 600 }}>{val}/10</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{
                      height: '100%',
                      width: `${(val / 10) * 100}%`,
                      background: color,
                      borderRadius: 2,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* 4. Highlight row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'rgba(0,232,122,0.04)',
          border: '1px solid rgba(0,232,122,0.12)',
          borderRadius: 4,
          padding: '18px 20px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(0,232,122,0.6)', marginBottom: 10 }}>
            Key Opportunity
          </div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            {result.keyOpportunity}
          </p>
        </div>
        <div style={{
          background: 'rgba(255,59,92,0.04)',
          border: '1px solid rgba(255,59,92,0.12)',
          borderRadius: 4,
          padding: '18px 20px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,59,92,0.6)', marginBottom: 10 }}>
            Biggest Risk
          </div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            {result.biggestRisk}
          </p>
        </div>
      </div>

      {/* 5. Pain Points */}
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Pain Points Found</SectionLabel>
        <Card style={{ padding: 0 }}>
          {(result.painPoints || []).map((pt, i) => (
            <div key={i} style={{
              padding: '14px 22px',
              borderBottom: i < result.painPoints.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                  {pt.source}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{pt.quote}"
                </p>
              </div>
              <SeverityBadge severity={pt.severity} />
            </div>
          ))}
        </Card>
      </div>

      {/* 6. Two-column grid: solutions + insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        {/* Existing Solutions */}
        <div>
          <SectionLabel>Existing Solutions</SectionLabel>
          <Card style={{ padding: 0 }}>
            {(result.existingSolutions || []).map((sol, i) => (
              <div key={i} style={{
                padding: '14px 20px',
                borderBottom: i < result.existingSolutions.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                  {sol.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>
                  {sol.url}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Gap: </span>{sol.weakness}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Market Insights */}
        <div>
          <SectionLabel>Market Insights</SectionLabel>
          <Card style={{ padding: 0 }}>
            {(result.marketInsights || []).map((insight, i) => (
              <div key={i} style={{
                padding: '14px 20px',
                borderBottom: i < result.marketInsights.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontSize: 10,
                  color: 'rgba(255,59,92,0.5)',
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {insight}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* 7. Reset button */}
      <button
        onClick={onReset}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          color: 'var(--text-muted)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          padding: '12px 24px',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          e.currentTarget.style.color = 'var(--text)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        ← Validate Another Idea
      </button>
    </div>
  )
}
