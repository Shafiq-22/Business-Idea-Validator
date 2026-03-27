export default function InputScreen({ idea, setIdea, onSubmit, error }) {
  const MAX_CHARS = 500

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (idea.trim().length >= 10) onSubmit()
    }
  }

  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      {/* Tag line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 24, height: 1, background: 'var(--red)' }} />
        <span style={{
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(255,59,92,0.8)',
        }}>
          Business Intelligence
        </span>
      </div>

      {/* H1 */}
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(36px, 6vw, 60px)',
        lineHeight: 1.05,
        marginBottom: 20,
        letterSpacing: '-1px',
      }}>
        Validate your<br />
        <span style={{ color: 'var(--red)' }}>idea.</span> Brutally.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 13,
        color: 'var(--text-muted)',
        fontWeight: 300,
        lineHeight: 1.7,
        maxWidth: 600,
        marginBottom: 40,
      }}>
        Drop your business idea below. The engine searches Reddit, YouTube, and social media for real pain
        points, maps existing solutions, and scores viability — no fluff.
      </p>

      {/* Textarea box */}
      <div style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        borderRadius: 4,
        marginBottom: 12,
        transition: 'border-color 0.15s',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
        onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKey}
          placeholder="e.g. An app that helps freelancers track time and automatically generate invoices with one click..."
          rows={5}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14,
            lineHeight: 1.6,
            padding: '20px 22px 8px',
            resize: 'vertical',
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '6px 22px 12px',
          fontSize: 11,
          color: 'var(--text-dim)',
        }}>
          {idea.length} / {MAX_CHARS}
        </div>
      </div>

      {/* Hint */}
      <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 20 }}>
        Tip: Cmd+Enter to submit
      </p>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={idea.trim().length < 10}
        style={{
          width: '100%',
          background: idea.trim().length >= 10 ? 'var(--red)' : 'rgba(255,59,92,0.15)',
          color: idea.trim().length >= 10 ? '#fff' : 'rgba(255,59,92,0.4)',
          border: 'none',
          borderRadius: 4,
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          padding: '16px',
          cursor: idea.trim().length >= 10 ? 'pointer' : 'not-allowed',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        → Run Validation
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(255,59,92,0.08)',
          border: '1px solid rgba(255,59,92,0.2)',
          borderRadius: 4,
          fontSize: 13,
          color: 'var(--red)',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
