import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { method, query, body } = req

  if (method === 'GET') {
    if (query.client_id) {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('client_id', query.client_id)
        .order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ portfolios: data })
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*, clients(name, email, portfolio_code)')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ portfolios: data })
  }

  if (method === 'POST') {
    const { client_id, name, type, total_value, initial_investment, currency, assets, notes } = body || {}
    if (!client_id || !name) return res.status(400).json({ error: 'معرف العميل والاسم مطلوبان' })

    const profit_loss = (total_value || 0) - (initial_investment || 0)
    const profit_loss_pct = initial_investment ? (profit_loss / initial_investment) * 100 : 0

    const { data, error } = await supabase
      .from('portfolios')
      .insert({ client_id, name, type, total_value: total_value || 0, initial_investment: initial_investment || 0, profit_loss, profit_loss_pct, currency: currency || 'USD', assets: assets || [], notes })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    await supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'create_portfolio', target_table: 'portfolios', target_id: data.id })
    return res.status(201).json({ portfolio: data })
  }

  if (method === 'PATCH' && query.id) {
    const updates = { ...body, updated_at: new Date().toISOString() }
    if (updates.total_value !== undefined && updates.initial_investment !== undefined) {
      updates.profit_loss = updates.total_value - updates.initial_investment
      updates.profit_loss_pct = updates.initial_investment ? (updates.profit_loss / updates.initial_investment) * 100 : 0
    }

    const { data, error } = await supabase
      .from('portfolios')
      .update(updates)
      .eq('id', query.id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    return res.json({ portfolio: data })
  }

  if (method === 'DELETE' && query.id) {
    const { error } = await supabase.from('portfolios').delete().eq('id', query.id)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
