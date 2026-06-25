import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const admin = requireAdmin(req, res)
  if (!admin) return

  const { method, query, body } = req

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('target', 'admin')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ notifications: data, unread: data.filter(n => !n.read).length })
  }

  // Mark as read
  if (method === 'PATCH' && query.id) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', query.id)
      .select()
      .single()
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ notification: data })
  }

  // Mark all as read
  if (method === 'PATCH' && query.action === 'mark_all_read') {
    await supabase.from('notifications').update({ read: true }).eq('target', 'admin')
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
