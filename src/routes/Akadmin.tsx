import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import AdminLayout from '../components/admin/AdminLayout'
import { getAdminSession, clearAdminSession } from '../lib/auth'

export const Route = createFileRoute('/Akadmin')({
  component: AkadminPage,
})

function AkadminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [role, setRole] = useState<'super' | 'sub'>('super')

  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    const original = meta?.getAttribute('content') ?? 'width=device-width, initial-scale=1'
    meta?.setAttribute('content', 'width=1280, initial-scale=1')
    const session = getAdminSession()
    setAuthed(!!session)
    if (session) setRole(session.role)
    return () => { meta?.setAttribute('content', original) }
  }, [])

  const handleLogin = (r: 'super' | 'sub') => {
    setRole(r)
    setAuthed(true)
  }

  const handleLogout = () => {
    clearAdminSession()
    setAuthed(false)
  }

  if (authed === null) return <div style={{ minHeight: '100vh', background: '#F0F4F8' }} />

  return authed
    ? <AdminLayout onLogout={handleLogout} role={role} />
    : <AdminLogin onLogin={handleLogin} />
}
