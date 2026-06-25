import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Parallel queries for dashboard KPIs
  const [
    { count: totalClients },
    { count: pendingClients },
    { count: todayTx },
    { count: pendingTx },
    { count: newMessages },
    { data: recentTx },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('transactions').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('transactions').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return res.json({
    kpis: {
      totalClients: totalClients || 0,
      pendingClients: pendingClients || 0,
      todayTransactions: todayTx || 0,
      pendingTransactions: pendingTx || 0,
      newMessages: newMessages || 0,
    },
    recentTransactions: recentTx || [],
    recentMessages: recentMessages || [],
  })
}
