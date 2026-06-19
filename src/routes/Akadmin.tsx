import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import AdminLayout from '../components/admin/AdminLayout'

export const Route = createFileRoute('/Akadmin')({
  component: AkadminPage,
})

function AkadminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('admin_auth')
    setAuthed(stored === 'true')
  }, [])

  const handleLogin = () => {
    setAuthed(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setAuthed(false)
  }

  if (authed === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#060E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1A2E4A', borderTop: '3px solid #C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminLayout onLogout={handleLogout} />
}
