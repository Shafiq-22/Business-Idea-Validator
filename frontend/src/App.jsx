import { useState } from 'react'
import InputScreen from './components/InputScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'

export default function App() {
  const [idea, setIdea] = useState('')
  const [phase, setPhase] = useState(null) // null | "running" | "done"
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (idea.trim().length < 10) return
    setError('')
    setPhase('running')

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Validation failed. Please try again.')
      }

      setResult(data)
      setPhase('done')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase(null)
    }
  }

  function handleReset() {
    setIdea('')
    setPhase(null)
    setResult(null)
    setError('')
  }

  return (
    <>
      <div className="grid-bg" />

      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b5c', display: 'inline-block' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e87a', display: 'inline-block' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c542', display: 'inline-block' }} />
        <span style={{ fontSize: 11, color: 'rgba(232,230,240,0.2)', marginLeft: 8, letterSpacing: 1 }}>
          FORGE / VALIDATOR v1.0
        </span>
      </header>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {phase === null && (
          <InputScreen
            idea={idea}
            setIdea={setIdea}
            onSubmit={handleSubmit}
            error={error}
          />
        )}
        {phase === 'running' && (
          <LoadingScreen idea={idea} />
        )}
        {phase === 'done' && result && (
          <ResultScreen
            result={result}
            idea={idea}
            onReset={handleReset}
          />
        )}
      </main>
    </>
  )
}
