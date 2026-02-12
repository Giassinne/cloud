import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

type HealthPayload = {
  status: string
  timestamp: string
  uptime: number
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const HEALTH_ENDPOINT = `${API_BASE_URL}/health`

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'medium',
})

const formatInstant = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

const formatDuration = (totalSeconds: number) => {
  if (!Number.isFinite(totalSeconds)) {
    return '—'
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const parts = [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    `${seconds}s`,
  ].filter(Boolean)

  return parts.join(' ')
}

function App() {
  const [payload, setPayload] = useState<HealthPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const fetchHealth = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(HEALTH_ENDPOINT)
      if (!response.ok) {
        throw new Error(`Requête échouée (${response.status})`)
      }

      const body: HealthPayload = await response.json()
      setPayload(body)
      setLastRefreshed(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inattendue'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    const interval = window.setInterval(fetchHealth, 15000)
    return () => window.clearInterval(interval)
  }, [fetchHealth])

  const uptimeLabel = useMemo(() => (payload ? formatDuration(payload.uptime) : '—'), [payload])
  const apiTimestamp = useMemo(() => (payload ? formatInstant(payload.timestamp) : '—'), [payload])
  const refreshedAt = useMemo(() => (lastRefreshed ? formatInstant(lastRefreshed) : '—'), [lastRefreshed])
  const statusTone = payload?.status === 'ok' ? 'healthy' : 'warning'

  return (
    <div className="page">
      <header className="app-header">
        <p className="eyebrow">Cloud Run · Frontend</p>
        <h1>Suivi en temps réel de l’API</h1>
        <p className="lede">
          Cette interface interroge en continu l’endpoint santé exposé par votre API NestJS déployée sur
          Cloud Run. Utilisez-la pendant la démo pour prouver que les push Git mettent à jour l’API et
          l’interface.
        </p>
      </header>

      <section className="status-card">
        <div className="status-chip-wrapper">
          <span className={`status-chip ${statusTone}`}>{payload?.status ?? 'en attente'}</span>
          <span className="endpoint-label">Endpoint monitoré · {HEALTH_ENDPOINT}</span>
        </div>
        <div className="meta-grid">
          <article>
            <p className="eyebrow">Dernière réponse API</p>
            <p className="metric">{apiTimestamp}</p>
          </article>
          <article>
            <p className="eyebrow">Rafraîchi par le front</p>
            <p className="metric">{refreshedAt}</p>
          </article>
          <article>
            <p className="eyebrow">Uptime serveur</p>
            <p className="metric">{uptimeLabel}</p>
          </article>
        </div>
        <div className="actions">
          <button className="primary" onClick={fetchHealth} disabled={loading}>
            {loading ? 'Chargement…' : 'Rafraîchir maintenant'}
          </button>
          <p className="hint">Mise à jour automatique toutes les 15 secondes</p>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="data-section">
        <article className="panel">
          <div>
            <p className="eyebrow">Payload brut</p>
            <p className="hint">
              Comparez cette sortie avec la version Git pour prouver qu’un push côté API se répercute sur
              le front.
            </p>
          </div>
          <pre className="json-block">
            {payload ? JSON.stringify(payload, null, 2) : 'En attente de la première réponse...'}
          </pre>
        </article>
        <article className="panel notes">
          <p className="eyebrow">Checklist de démo</p>
          <ol>
            <li>Push sur main → Cloud Build déploie l’API (Cloud Run `monProjet`).</li>
            <li>Push sur main → Cloud Build déploie ce front (`monFront`).</li>
            <li>Rechargez la page publique https://monFront.region.run.app.</li>
            <li>Vérifiez que les données ci-dessus reflètent la nouvelle release API.</li>
          </ol>
        </article>
      </section>
    </div>
  )
}

export default App
