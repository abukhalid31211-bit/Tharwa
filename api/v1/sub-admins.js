import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  // Only super admin can manage sub-admins
  if (admin.role !== 'super') {
    return res.status(403).json({ error: 'غير مصرح — هذا الإجراء للمدير الرئيسي فقط' })
  }

  const { method, query, body } = req

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('sub_admins')
      .select('id, name, email, status, created_at')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ subAdmins: data })
  }

  if (method === 'POST') {
    const { name, email, password } = body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور مطلوبة' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('sub_admins')
      .insert({ name, email: email.toLowerCase(), password_hash, status: 'active', created_by: admin.id })
      .select('id, name, email, status, created_at')
      .single()

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' })
      return res.status(400).json({ error: error.message })
    }
    return res.status(201).json({ subAdmin: data })
  }

  if (method === 'PATCH' && query.id) {
    const { status } = body || {}
    const { data, error } = await supabase
      .from('sub_admins')
      .update({ status })
      .eq('id', query.id)
      .select('id, name, email, status')
      .single()
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ subAdmin: data })
  }

  if (method === 'DELETE' && query.id) {
    const { error } = await supabase.from('sub_admins').delete().eq('id', query.id)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
