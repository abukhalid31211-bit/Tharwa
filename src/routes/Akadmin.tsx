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
    const meta = document.querySelector('meta[name="viewport"]')
    const original = meta?.getAttribute('content') ?? 'width=device-width, initial-scale=1'
    meta?.setAttribute('content', 'width=1280, initial-scale=1')
    const stored = localStorage.getItem('admin_auth')
    setAuthed(stored === 'true')
    return () => { meta?.setAttribute('content', original) }
  }, [])

  const handleLogin = () => setAuthed(true)
  const handleLogout = () => { localStorage.removeItem('admin_auth'); setAuthed(false) }

  if (authed === null) return <div style={{ minHeight: '100vh', background: '#F0F4F8' }} />

  return authed
    ? <AdminLayout onLogout={handleLogout} />
    : <AdminLogin onLogin={handleLogin} />
}
