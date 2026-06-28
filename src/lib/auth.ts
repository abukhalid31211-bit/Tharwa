import type { AdminUser, ClientUser } from './api'

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export function saveAdminSession(token: string, user: AdminUser) {
  localStorage.setItem('admin_token', token)
  localStorage.setItem('admin_auth', 'true')
  localStorage.setItem('admin_role', user.role)
  localStorage.setItem('admin_email', user.email)
  localStorage.setItem('admin_name', user.name)
  localStorage.setItem('admin_id', user.id)
  if (user.permissions) {
    localStorage.setItem('admin_permissions', JSON.stringify(user.permissions))
  }
}

export function clearAdminSession() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_auth')
  localStorage.removeItem('admin_role')
  localStorage.removeItem('admin_email')
  localStorage.removeItem('admin_name')
  localStorage.removeItem('admin_id')
  localStorage.removeItem('admin_permissions')
}

export function getAdminSession(): { token: string; role: 'super' | 'sub'; email: string; name: string; permissions: string[] } | null {
  const token = localStorage.getItem('admin_token')
  const auth  = localStorage.getItem('admin_auth')
  const role  = localStorage.getItem('admin_role') as 'super' | 'sub' | null
  if (!token || auth !== 'true' || !role) return null
  let permissions: string[] = []
  try {
    const raw = localStorage.getItem('admin_permissions')
    if (raw) permissions = JSON.parse(raw)
  } catch { /* ignore */ }
  return {
    token,
    role,
    email: localStorage.getItem('admin_email') || '',
    name:  localStorage.getItem('admin_name')  || '',
    permissions,
  }
}

export function isAdminAuthed(): boolean {
  return !!localStorage.getItem('admin_token') && localStorage.getItem('admin_auth') === 'true'
}

// ─── Client Auth ──────────────────────────────────────────────────────────────
export function saveClientSession(token: string, user: ClientUser) {
  localStorage.setItem('client_token', token)
  localStorage.setItem('tharwah_client_auth', JSON.stringify(user))
}

export function clearClientSession() {
  localStorage.removeItem('client_token')
  localStorage.removeItem('tharwah_client_auth')
}

export function getClientSession(): ClientUser | null {
  const raw = localStorage.getItem('tharwah_client_auth')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function isClientAuthed(): boolean {
  return !!localStorage.getItem('client_token') && !!localStorage.getItem('tharwah_client_auth')
}
