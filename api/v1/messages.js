import { supabase } from '../_lib/supabase.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  const { method, query, body } = req

  // POST — public, contact form submission (no auth needed)
  if (method === 'POST' && !query.action) {
    const { name, email, phone, service, message, source } = body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'الاسم والبريد والرسالة مطلوبة' })
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone, service, message, source: source || 'contact', status: 'new' })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    // TODO: Send notification email via Resend (stub ready)
    // await sendEmail({ to: 'info@tharwahcapital.com', subject: `رسالة جديدة من ${name}`, text: message })

    return res.status(201).json({ success: true, id: data.id })
  }

  // All below require admin auth
  const admin = requireAdmin(req, res)
  if (!admin) return

  // GET — list messages (admin)
  if (method === 'GET') {
    let q = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (query.status && query.status !== 'all') q = q.eq('status', query.status)
    if (query.limit) q = q.limit(Number(query.limit))

    const { data, error } = await q
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ messages: data })
  }

  // PATCH — update status (mark as read / replied)
  if (method === 'PATCH' && query.id) {
    const { status } = body || {}
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', query.id)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    return res.json({ message: data })
  }

  // DELETE
  if (method === 'DELETE' && query.id) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', query.id)
    if (error) return res.status(400).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
