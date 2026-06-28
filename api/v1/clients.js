import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

const CLIENT_FIELDS = 'id,name,email,phone,status,account_number,join_date,risk_profile,avatar_url,notes,created_at,membership_level,portfolio_code,initial_investment'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { id, search, status, limit = 100, offset = 0 } = req.query
      if (id) {
        const { data, error } = await supabase.from('clients').select(CLIENT_FIELDS).eq('id', id).single()
        if (error || !data) return res.status(404).json({ error: 'العميل غير موجود' })
        return res.json({ client: data })
      }
      let q = supabase.from('clients').select(CLIENT_FIELDS, { count: 'exact' })
      if (status) q = q.eq('status', status)
      if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
      q = q.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1)
      const { data, count, error } = await q
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ clients: data, total: count })
    }

    if (req.method === 'POST') {
      const { name, email, phone, password, risk_profile, notes, membership_level, portfolio_code, initial_investment } = req.body || {}
      if (!name || !email || !password) return res.status(400).json({ error: 'الاسم والبريد والكلمة مطلوبة' })
      const { data: existing } = await supabase.from('clients').select('id').eq('email', email.toLowerCase()).single()
      if (existing) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم' })
      const hash = await bcrypt.hash(password, 10)
      const acc = 'TH' + Date.now().toString().slice(-8)
      const { data, error } = await supabase.from('clients').insert({
        name,
        email: email.toLowerCase(),
        phone,
        password_hash: hash,
        account_number: acc,
        risk_profile: risk_profile || 'moderate',
        notes,
        membership_level: membership_level || 'عادي',
        portfolio_code,
        initial_investment,
      }).select(CLIENT_FIELDS).single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ client: data })
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {}
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      if (updates.password) { updates.password_hash = await bcrypt.hash(updates.password, 10); delete updates.password }
      if (updates.email) updates.email = updates.email.toLowerCase()
      const { data, error } = await supabase.from('clients').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select(CLIENT_FIELDS).single()
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ client: data })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'id مطلوب' })
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
