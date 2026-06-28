import { supabase } from '../../_lib/supabase.js'
import { handleCors } from '../../_lib/cors.js'
import { requireClient } from '../../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const decoded = requireClient(req, res)
  if (!decoded) return

  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('client_id', decoded.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
    if (!data) return res.json({ portfolio: null })

    return res.json({ portfolio: data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
