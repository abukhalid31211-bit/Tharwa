import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { method, query, body } = req

  if (method === 'GET') {
    let q = supabase
      .from('transactions')
      .select('*, clients(name, email, portfolio_code)')
      .order('created_at', { ascending: false })

    if (query.status && query.status !== 'all') q = q.eq('status', query.status)
    if (query.type && query.type !== 'all')     q = q.eq('type', query.type)
    if (query.client_id)                         q = q.eq('client_id', query.client_id)
    if (query.limit)                             q = q.limit(Number(query.limit))

    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ transactions: data })
  }

  if (method === 'POST') {
    const { client_id, portfolio_id, type, asset, quantity, price, notes, client_name } = body || {}
    if (!type || !asset) return res.status(400).json({ error: 'نوع العملية والأصل مطلوبان' })

    const qty = parseFloat(quantity) || 0
    const prc = parseFloat(price) || 0
    const total = qty * prc

    const { data, error } = await supabase
      .from('transactions')
      .insert({ client_id, portfolio_id, type, asset, quantity: qty, price: prc, total, notes, client_name, status: 'pending' })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'create_transaction', target_table: 'transactions', target_id: data.id })
    return res.status(201).json({ transaction: data })
  }

  if (method === 'PATCH' && query.id) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', query.id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'update_transaction', target_table: 'transactions', target_id: query.id })
    return res.json({ transaction: data })
  }

  if (method === 'DELETE' && query.id) {
    const { error } = await supabase.from('transactions').delete().eq('id', query.id)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
