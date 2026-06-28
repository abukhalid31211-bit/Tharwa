import { createClient } from '@supabase/supabase-js'
  import jwt from 'jsonwebtoken'
  import bcrypt from 'bcryptjs'

  // ── Supabase ──────────────────────────────────────────────────
  let _client = null
  function getClient() {
    if (_client) return _client
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
    if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    _client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    return _client
  }
  const supabase = new Proxy({}, { get(_, prop) { return getClient()[prop] } })

  // ── CORS ──────────────────────────────────────────────────────
  function handleCors(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') { res.status(204).end(); return true }
    return false
  }

  // ── Auth helpers ──────────────────────────────────────────────
  const getSecret = () => process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || null
  function signToken(payload) {
    const secret = getSecret()
    if (!secret) throw new Error('JWT secret not configured')
    return jwt.sign(payload, secret, { expiresIn: '8h' })
  }
  function verifyToken(token) {
    const secret = getSecret()
    if (!secret) return null
    try { return jwt.verify(token, secret) } catch { return null }
  }
  function extractToken(req) {
    const auth = req.headers['authorization'] || ''
    return auth.startsWith('Bearer ') ? auth.slice(7) : null
  }
  function requireAdmin(req, res) {
    const token = extractToken(req)
    if (!token) { res.status(401).json({ error: 'Unauthorized — missing token' }); return null }
    const payload = verifyToken(token)
    if (!payload) { res.status(401).json({ error: 'Unauthorized — invalid or expired token' }); return null }
    return payload
  }
  function requireClient(req, res) {
    const token = extractToken(req)
    if (!token) { res.status(401).json({ error: 'Unauthorized — missing token' }); return null }
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'client') { res.status(401).json({ error: 'Unauthorized — client token required' }); return null }
    return payload
  }

  // ── Handlers ──────────────────────────────────────────────────

  async function handleHealth(req, res) {
    const url = process.env.SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
    const jwtOk = !!(process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET)
    let tables = {}
    try {
      const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      const [admins, clients, settings] = await Promise.all([
        sb.from('admins').select('*', { count: 'exact', head: true }),
        sb.from('clients').select('*', { count: 'exact', head: true }),
        sb.from('site_settings').select('*', { count: 'exact', head: true }),
      ])
      tables = {
        admins:        { count: admins.count,   error: admins.error?.message   || null },
        clients:       { count: clients.count,  error: clients.error?.message  || null },
        site_settings: { count: settings.count, error: settings.error?.message || null },
      }
    } catch (e) { tables = { error: e.message } }
    res.json({ ok: true, supabaseProject: url ? url.replace('https://', '').split('.')[0] : 'missing', hasServiceKey: !!key, hasJwtSecret: jwtOk, tables, nodeVersion: process.version })
  }

  async function handleAdminLogin(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
    async function checkPassword(plain, hash) {
      if (!hash) return false
      return bcrypt.compare(plain, hash.replace(/^\$2a\$/, '$2b$'))
    }
    try {
      const { data: admin, error: adminErr } = await supabase.from('admins').select('id,name,email,password_hash,role,status').eq('email', email.toLowerCase().trim()).maybeSingle()
      if (adminErr) return res.status(500).json({ error: 'DB error: ' + adminErr.message })
      if (admin) {
        if (admin.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف' })
        if (!await checkPassword(password, admin.password_hash)) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })
        supabase.from('audit_logs').insert({ actor_id: admin.id, actor_type: 'admin', actor_email: admin.email, action: 'admin_login', details: { ip: req.headers['x-forwarded-for'] || 'unknown' } }).then(null, () => {})
        const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role })
        return res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, permissions: [] } })
      }
      const { data: sub, error: subErr } = await supabase.from('sub_admins').select('id,name,email,password_hash,status,permissions').eq('email', email.toLowerCase().trim()).maybeSingle()
      if (subErr) return res.status(500).json({ error: 'DB error: ' + subErr.message })
      if (!sub) return res.status(401).json({ error: 'البريد الإلكتروني غير مسجل' })
      if (sub.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف' })
      if (!await checkPassword(password, sub.password_hash)) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })
      const token = signToken({ id: sub.id, email: sub.email, name: sub.name, role: 'sub' })
      return res.json({ token, user: { id: sub.id, name: sub.name, email: sub.email, role: 'sub', permissions: Array.isArray(sub.permissions) ? sub.permissions : ['clients','portfolios','transactions'] } })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleClientLogin(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
    try {
      const { data: client } = await supabase.from('clients').select('id,name,email,password_hash,status,phone,avatar_url,account_number,join_date,risk_profile').eq('email', email.toLowerCase().trim()).single()
      if (!client) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
      if (client.status !== 'active') return res.status(403).json({ error: 'الحساب موقوف. تواصل مع المدير.' })
      if (!await bcrypt.compare(password, client.password_hash)) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })
      const token = signToken({ id: client.id, email: client.email, name: client.name, role: 'client' })
      const { password_hash, ...safeClient } = client
      return res.json({ token, client: safeClient })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  const CLIENT_FIELDS = 'id,name,email,phone,status,account_number,join_date,risk_profile,avatar_url,notes,created_at,membership_level,portfolio_code,initial_investment'
  async function handleClients(req, res) {
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
        const { data, error } = await supabase.from('clients').insert({ name, email: email.toLowerCase(), phone, password_hash: hash, account_number: 'TH' + Date.now().toString().slice(-8), risk_profile: risk_profile || 'moderate', notes, membership_level: membership_level || 'عادي', portfolio_code, initial_investment }).select(CLIENT_FIELDS).single()
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
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleTransactions(req, res) {
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    try {
      if (req.method === 'GET') {
        const { id, client_id, type, status, limit = 50, offset = 0 } = req.query
        if (id) {
          const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single()
          if (error || !data) return res.status(404).json({ error: 'المعاملة غير موجودة' })
          return res.json({ transaction: data })
        }
        let q = supabase.from('transactions').select('*, clients(name)', { count: 'exact' })
        if (client_id) q = q.eq('client_id', client_id)
        if (type) q = q.eq('type', type)
        if (status) q = q.eq('status', status)
        q = q.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1)
        const { data, error } = await q
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ transactions: data })
      }
      if (req.method === 'POST') {
        const { client_id, type, amount, currency = 'SAR', notes, status = 'pending' } = req.body || {}
        if (!client_id || !type || !amount) return res.status(400).json({ error: 'client_id و type و amount مطلوبة' })
        const { data, error } = await supabase.from('transactions').insert({ client_id, type, amount, currency, reference: 'TXN-' + Date.now(), notes, status }).select('*').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.status(201).json({ transaction: data })
      }
      if (req.method === 'PATCH') {
        const { id, ...updates } = req.body || {}
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { data, error } = await supabase.from('transactions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ transaction: data })
      }
      if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ success: true })
      }
      return res.status(405).json({ error: 'Method not allowed' })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handlePortfolios(req, res) {
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    try {
      if (req.method === 'GET') {
        const { client_id, id } = req.query
        if (id) {
          const { data, error } = await supabase.from('portfolios').select('*, clients(name,email,membership_level)').eq('id', id).single()
          if (error || !data) return res.status(404).json({ error: 'المحفظة غير موجودة' })
          return res.json({ portfolio: data })
        }
        let q = supabase.from('portfolios').select('*, clients(name,email,membership_level)')
        if (client_id) q = q.eq('client_id', client_id)
        const { data, error } = await q.order('created_at', { ascending: false })
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ portfolios: data })
      }
      if (req.method === 'POST') {
        const { client_id, name, type, initial_value, currency = 'SAR', notes, portfolio_data } = req.body || {}
        if (!client_id) return res.status(400).json({ error: 'client_id مطلوب' })
        const { data, error } = await supabase.from('portfolios').insert({ client_id, name: name || 'المحفظة الاستثمارية', type: type || 'mixed', initial_value: initial_value || 0, current_value: initial_value || 0, currency, notes, portfolio_data: portfolio_data || {} }).select('*, clients(name,email,membership_level)').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.status(201).json({ portfolio: data })
      }
      if (req.method === 'PATCH') {
        const { id, ...updates } = req.body || {}
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { data, error } = await supabase.from('portfolios').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*, clients(name,email,membership_level)').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ portfolio: data })
      }
      if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { error } = await supabase.from('portfolios').delete().eq('id', id)
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ success: true })
      }
      return res.status(405).json({ error: 'Method not allowed' })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleSettings(req, res) {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('key,value,type,label').order('key')
      if (error) return res.status(500).json({ error: error.message })
      const settings = {}
      for (const row of data || []) settings[row.key] = row.value
      return res.json({ settings, rows: data })
    }
    if (req.method === 'POST') {
      const decoded = verifyToken(extractToken(req))
      if (!decoded) return res.status(401).json({ error: 'غير مصرح' })
      const { settings } = req.body || {}
      if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'settings object required' })
      const upserts = Object.entries(settings).map(([key, value]) => ({ key, value: String(value), updated_at: new Date().toISOString() }))
      const { error } = await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' })
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ success: true, updated: upserts.length })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  }

  async function handleMessages(req, res) {
    if (req.method === 'POST' && !req.headers.authorization) {
      const { name, email, phone, service, message, source = 'contact' } = req.body || {}
      if (!name || !email || !message) return res.status(400).json({ error: 'الاسم والبريد والرسالة مطلوبة' })
      const { data, error } = await supabase.from('contact_messages').insert({ name, email, phone, service, message, source }).select('id,created_at').single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json({ success: true, id: data.id })
    }
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    try {
      if (req.method === 'GET') {
        const { status, limit = 50, offset = 0 } = req.query
        let q = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (status) q = q.eq('status', status)
        q = q.range(Number(offset), Number(offset) + Number(limit) - 1)
        const { data, error } = await q
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ messages: data })
      }
      if (req.method === 'PATCH') {
        const { id, status } = req.body || {}
        if (!id || !status) return res.status(400).json({ error: 'id و status مطلوبان' })
        const { data, error } = await supabase.from('contact_messages').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ message: data })
      }
      if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ success: true })
      }
      return res.status(405).json({ error: 'Method not allowed' })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleSubAdmins(req, res) {
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    if (decoded.role !== 'super') return res.status(403).json({ error: 'صلاحيات المدير الرئيسي مطلوبة' })
    try {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('sub_admins').select('id,name,email,status,permissions,created_at').order('created_at', { ascending: false })
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ subAdmins: data })
      }
      if (req.method === 'POST') {
        const { name, email, password, permissions } = req.body || {}
        if (!name || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
        if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور 6 أحرف على الأقل' })
        const { data: existing } = await supabase.from('sub_admins').select('id').eq('email', email.toLowerCase()).single()
        if (existing) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم' })
        const hash = await bcrypt.hash(password, 10)
        const { data, error } = await supabase.from('sub_admins').insert({ name: name.trim(), email: email.toLowerCase().trim(), password_hash: hash, permissions: permissions || [] }).select('id,name,email,status,permissions,created_at').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.status(201).json({ subAdmin: data })
      }
      if (req.method === 'PATCH') {
        const { id, ...updates } = req.body || {}
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        if (updates.password) { updates.password_hash = await bcrypt.hash(updates.password, 10); delete updates.password }
        const { data, error } = await supabase.from('sub_admins').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('id,name,email,status,permissions,created_at').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ subAdmin: data })
      }
      if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { error } = await supabase.from('sub_admins').delete().eq('id', id)
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ success: true })
      }
      return res.status(405).json({ error: 'Method not allowed' })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleNotifications(req, res) {
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    try {
      if (req.method === 'GET') {
        const { limit = 20 } = req.query
        const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(Number(limit))
        if (error) return res.status(500).json({ error: error.message })
        const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('is_read', false)
        return res.json({ notifications: data, unreadCount: count || 0 })
      }
      if (req.method === 'PATCH') {
        const { id, all } = req.body || {}
        if (all) { await supabase.from('notifications').update({ is_read: true }).eq('is_read', false); return res.json({ success: true, marked: 'all' }) }
        if (!id) return res.status(400).json({ error: 'id مطلوب' })
        const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).select('*').single()
        if (error) return res.status(500).json({ error: error.message })
        return res.json({ notification: data })
      }
      return res.status(405).json({ error: 'Method not allowed' })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleOverview(req, res) {
    const decoded = requireAdmin(req, res)
    if (!decoded) return
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    try {
      const [{ data: clients }, { data: txs }, { data: msgs }, { data: recentClients }, { data: recentTx }] = await Promise.all([
        supabase.from('clients').select('status'),
        supabase.from('transactions').select('type,amount,status'),
        supabase.from('contact_messages').select('status'),
        supabase.from('clients').select('id,name,email,status,join_date').order('created_at', { ascending: false }).limit(5),
        supabase.from('transactions').select('*, clients(name)').order('created_at', { ascending: false }).limit(5),
      ])
      const totalDeposits = (txs || []).filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0)
      const totalWithdrawals = (txs || []).filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0)
      return res.json({
        kpis: { activeClients: (clients||[]).filter(c=>c.status==='active').length, inactiveClients: (clients||[]).filter(c=>c.status==='inactive').length, totalClients: (clients||[]).length, totalDeposits, totalWithdrawals, netAssets: totalDeposits - totalWithdrawals, pendingTransactions: (txs||[]).filter(t=>t.status==='pending').length, totalTransactions: (txs||[]).length, newMessages: (msgs||[]).filter(m=>m.status==='new').length, totalMessages: (msgs||[]).length },
        recentClients: recentClients || [],
        recentTransactions: recentTx || [],
      })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleClientProfile(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const decoded = requireClient(req, res)
    if (!decoded) return
    try {
      const { data, error } = await supabase.from('clients').select('id,name,email,phone,status,account_number,join_date,risk_profile,avatar_url,membership_level,portfolio_code,initial_investment').eq('id', decoded.id).single()
      if (error || !data) return res.status(404).json({ error: 'العميل غير موجود' })
      return res.json({ client: data })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleClientPortfolio(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const decoded = requireClient(req, res)
    if (!decoded) return
    try {
      const { data, error } = await supabase.from('portfolios').select('*').eq('client_id', decoded.id).order('created_at', { ascending: false }).limit(1).single()
      if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
      return res.json({ portfolio: data || null })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  async function handleClientTransactions(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const decoded = requireClient(req, res)
    if (!decoded) return
    try {
      const { limit = 20, offset = 0 } = req.query
      const { data, error } = await supabase.from('transactions').select('id,type,amount,currency,reference,notes,status,created_at').eq('client_id', decoded.id).order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1)
      if (error) return res.status(500).json({ error: error.message })
      return res.json({ transactions: data || [] })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }

  // ── Router ────────────────────────────────────────────────────
  const routes = {
    '/api/v1/health':              handleHealth,
    '/api/v1/auth/admin-login':    handleAdminLogin,
    '/api/v1/auth/client-login':   handleClientLogin,
    '/api/v1/clients':             handleClients,
    '/api/v1/transactions':        handleTransactions,
    '/api/v1/portfolios':          handlePortfolios,
    '/api/v1/settings':            handleSettings,
    '/api/v1/messages':            handleMessages,
    '/api/v1/sub-admins':          handleSubAdmins,
    '/api/v1/notifications':       handleNotifications,
    '/api/v1/overview':            handleOverview,
    '/api/v1/client/profile':      handleClientProfile,
    '/api/v1/client/portfolio':    handleClientPortfolio,
    '/api/v1/client/transactions': handleClientTransactions,
  }

  export default async function handler(req, res) {
    if (handleCors(req, res)) return
    const path = (req.url || '').split('?')[0].replace(/\/$/, '')
    const routeHandler = routes[path]
    if (routeHandler) return routeHandler(req, res)
    return res.status(404).json({ error: 'Route not found', path })
  }
  