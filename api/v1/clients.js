import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { method, query, body } = req

  // GET /api/v1/clients — list all clients
  if (method === 'GET' && !query.id) {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, nationality, id_number, category, status, portfolio_code, risk_profile, investment_goal, kyc_status, notes, initial, created_at')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ clients: data })
  }

  // GET /api/v1/clients?id=xxx — single client
  if (method === 'GET' && query.id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', query.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Client not found' })
    return res.json({ client: data })
  }

  // POST /api/v1/clients — create client
  if (method === 'POST') {
    const { name, email, phone, nationality, id_number, category, password, risk_profile, investment_goal, notes } = body || {}
    if (!name || !email) return res.status(400).json({ error: 'الاسم والبريد الإلكتروني مطلوبان' })

    const password_hash = password ? await bcrypt.hash(password, 10) : null

    // Generate portfolio code
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true })
    const code = `PF-${String((count || 0) + 1).padStart(3, '0')}`
    const initial = name.charAt(0)

    const { data, error } = await supabase
      .from('clients')
      .insert({ name, email: email.toLowerCase(), phone, nationality, id_number, category: category || 'standard', password_hash, portfolio_code: code, risk_profile, investment_goal, notes, initial, kyc_status: 'pending', status: 'pending' })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })

    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'create_client', target_table: 'clients', target_id: data.id })
    return res.status(201).json({ client: data })
  }

  // PATCH /api/v1/clients?id=xxx — update client
  if (method === 'PATCH' && query.id) {
    const { password, ...rest } = body || {}
    const updates = { ...rest, updated_at: new Date().toISOString() }
    if (password) updates.password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', query.id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'update_client', target_table: 'clients', target_id: query.id, details: rest })
    return res.json({ client: data })
  }

  // DELETE /api/v1/clients?id=xxx
  if (method === 'DELETE' && query.id) {
    const { error } = await supabase.from('clients').delete().eq('id', query.id)
    if (error) return res.status(400).json({ error: error.message })
    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'delete_client', target_table: 'clients', target_id: query.id })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
