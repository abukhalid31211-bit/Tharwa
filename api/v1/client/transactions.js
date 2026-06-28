import { supabase } from '../../_lib/supabase.js'
import { handleCors } from '../../_lib/cors.js'
import { requireClient } from '../../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const decoded = requireClient(req, res)
  if (!decoded) return

  try {
    const { limit = 20, offset = 0 } = req.query
    const { data, error } = await supabase
      .from('transactions')
      .select('id, type, amount, currency, reference, notes, status, created_at')
      .eq('client_id', decoded.id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ transactions: data || [] })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
