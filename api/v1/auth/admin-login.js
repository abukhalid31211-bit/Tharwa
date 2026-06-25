import { supabase } from '../../_lib/supabase.js'
import { signToken } from '../../_lib/auth.js'
import { handleCors } from '../../_lib/cors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
  }

  // Check admins table first
  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, name, email, password_hash, role, status')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error || !admin) {
    // Check sub_admins table
    const { data: sub } = await supabase
      .from('sub_admins')
      .select('id, name, email, password_hash, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (!sub) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
    }

    if (sub.status !== 'active') {
      return res.status(403).json({ error: 'الحساب موقوف. تواصل مع المدير.' })
    }

    const valid = await bcrypt.compare(password, sub.password_hash)
    if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

    const token = signToken({ id: sub.id, email: sub.email, name: sub.name, role: 'sub' })
    return res.json({ token, user: { id: sub.id, name: sub.name, email: sub.email, role: 'sub' } })
  }

  if (admin.status !== 'active') {
    return res.status(403).json({ error: 'الحساب موقوف. تواصل مع المدير.' })
  }

  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

  // Audit log
  await supabase.from('audit_logs').insert({
    actor_id: admin.id,
    actor_type: 'admin',
    actor_email: admin.email,
    action: 'admin_login',
    details: { ip: req.headers['x-forwarded-for'] || 'unknown' },
  })

  const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role })
  return res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } })
}
