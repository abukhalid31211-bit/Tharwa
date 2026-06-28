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
      .from('clients')
      .select('id, name, email, phone, status, account_number, join_date, risk_profile, avatar_url, membership_level, portfolio_code, initial_investment')
      .eq('id', decoded.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'العميل غير موجود' })
    return res.json({ client: data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
