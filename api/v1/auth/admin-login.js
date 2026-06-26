import { supabase } from '../../_lib/supabase.js'
import { signToken } from '../../_lib/auth.js'
import { handleCors } from '../../_lib/cors.js'
import bcrypt from 'bcryptjs'

async function checkPassword(plain, hash) {
  if (!hash) return false
  // pgcrypto generates $2a$ prefix; bcryptjs handles both $2a$ and $2b$
  // but to be safe, normalize $2a$ → $2b$
  const normalizedHash = hash.replace(/^\$2a\$/, '$2b$')
  return bcrypt.compare(plain, normalizedHash)
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })

  try {
    // Check admins table
    const { data: admin, error: adminErr } = await supabase
      .from('admins')
      .select('id, name, email, password_hash, role, status')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (adminErr) return res.status(500).json({ error: 'DB error: ' + adminErr.message })

    if (admin) {
      if (admin.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف' })
      const valid = await checkPassword(password, admin.password_hash)
      if (!valid) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })

      // Log login (non-blocking)
      supabase.from('audit_logs').insert({
        actor_id: admin.id, actor_type: 'admin', actor_email: admin.email,
        action: 'admin_login', details: { ip: req.headers['x-forwarded-for'] || 'unknown' },
      }).catch(() => {})

      const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role })
      return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } })
    }

    // Check sub_admins table
    const { data: sub, error: subErr } = await supabase
      .from('sub_admins')
      .select('id, name, email, password_hash, status')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (subErr) return res.status(500).json({ error: 'DB error: ' + subErr.message })
    if (!sub) return res.status(401).json({ error: 'البريد الإلكتروني غير مسجل' })
    if (sub.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف' })

    const valid = await checkPassword(password, sub.password_hash)
    if (!valid) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })

    const token = signToken({ id: sub.id, email: sub.email, name: sub.name, role: 'sub' })
    return res.json({ token, admin: { id: sub.id, name: sub.name, email: sub.email, role: 'sub' } })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
