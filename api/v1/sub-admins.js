import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return
  if (decoded.role !== 'super') return res.status(403).json({ error: 'صلاحيات المدير الرئيسي مطلوبة' })

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('sub_admins').select('id, name, email, status, permissions, created_at').order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ subAdmins: data })
    }

    if (req.method === 'POST') {
      const { name, email, password, permissions } = req.body || {}
      if (!name || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
      if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور 6 أحرف على الأقل' })
      const { data: existing } = await supabase.from('sub_admins').select('id').eq('email', email.toLowerCase()).single()
      if (existing) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم' })
      const hash = await bcrypt.hash(password, 10)
      const { data, error } = await supabase.from('sub_admins').insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: hash,
        permissions: permissions || [],
      }).select('id, name, email, status, permissions, created_at').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ subAdmin: data })
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      if (updates.password) { updates.password_hash = await bcrypt.hash(updates.password, 10); delete updates.password }
      const { data, error } = await supabase.from('sub_admins').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('id, name, email, status, permissions, created_at').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ subAdmin: data })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { error } = await supabase.from('sub_admins').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
