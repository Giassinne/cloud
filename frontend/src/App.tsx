import { useCallback, useEffect, useState } from 'react'
import './App.css'

type UserRecord = {
  id: number
  name: string
  role: string
  location: string
  joinedAt: string
}

type SyncState = 'idle' | 'loading' | 'ready' | 'error'

function App() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [status, setStatus] = useState<SyncState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState('')

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'

  const syncUsers = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(`${apiBase}/users`)

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`)
      }

      const payload = await response.json()
      setUsers(Array.isArray(payload?.items) ? payload.items : [])
      setLastSyncedAt(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      )
      setStatus('ready')
    } catch (error) {
      setUsers([])
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected error')
    }
  }, [apiBase])

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`${apiBase}/users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user ${id}`)
      }

      // Refresh the user list after deletion
      await syncUsers()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete user')
      setStatus('error')
    }
  }

  useEffect(() => {
    syncUsers()
  }, [syncUsers])

  const formatJoinDate = (isoDate: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoDate))

  const syncLabel = () => {
    if (status === 'loading') return 'Syncing live roster…'
    if (status === 'error') return 'Sync failed'
    if (lastSyncedAt) return `Synced ${lastSyncedAt}`
    return 'Awaiting first sync'
  }

  return (
    <main className="hero-shell">
      <div className="glow halo"></div>
      <section className="hero-message">
        <p className="stamp">crafted · 2026</p>
        <h1 className="yass">Yassine Kaddouri</h1>
        <p className="subtitle">bold. minimal. unapologetic.</p>
        <div className="divider" aria-hidden></div>
        <p className="note">Always shipping with style.</p>
      </section>

      <section className="data-shell" aria-live="polite">
        <header className="data-head">
          <div>
            <p className="eyebrow">live roster</p>
            <h2>People manifest</h2>
          </div>
          <div className="head-meta">
            <span className={`sync-pill ${status}`}>{syncLabel()}</span>
            <button type="button" className="refresh" onClick={syncUsers} disabled={status === 'loading'}>
              refresh
            </button>
          </div>
        </header>

        {status === 'error' && <p className="error-copy">Unable to reach the API — {errorMessage}</p>}

        <div className="table-shell" role="table" aria-label="team roster">
          <div className="table-row table-head" role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Role</span>
            <span role="columnheader">Location</span>
            <span role="columnheader">Joined</span>
            <span role="columnheader">Actions</span>
          </div>

          {status === 'loading' && (
            <div className="table-row placeholder" role="row">
              <span role="cell">pulling telemetry…</span>
            </div>
          )}

          {status !== 'loading' && users.length === 0 && (
            <div className="table-row placeholder" role="row">
              <span role="cell">No operators available</span>
            </div>
          )}

          {users.map((user) => (
            <div className="table-row" role="row" key={user.id}>
              <span role="cell" className="cell-primary">
                {user.name}
              </span>
              <span role="cell">
                <span className="role-pill">{user.role}</span>
              </span>
              <span role="cell">
                <span className="location-pill">{user.location}</span>
              </span>
              <span role="cell">{formatJoinDate(user.joinedAt)}</span>
              <span role="cell">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                  title={`Delete ${user.name}`}
                >
                  delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
