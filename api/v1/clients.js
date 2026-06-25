import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError, NotFoundError } from '../_lib/errors.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    // GET — list or single client
    if (req.method === 'GET') {
      const { id, search, status, limit = 50, offset = 0 } = req.query
      if (id) {
        const client = await queryOne(
          `SELECT id, name, email, phone, status, account_number, join_date,
                  risk_profile, avatar_url, notes, created_at
           FROM clients WHERE id = $1`, [id]
        )
        if (!client) {
          logger.warn('Client not found', { clientId: id })
          return sendError(res, new NotFoundError('العميل'))
        }
        logger.debug('Client retrieved', { clientId: id })
        return sendSuccess(res, { client })
      }

      let sql = `SELECT id, name, email, phone, status, account_number, join_date,
                        risk_profile, avatar_url, notes, created_at
                 FROM clients WHERE 1=1`
      const params = []
      if (status) { params.push(status); sql += ` AND status = $${params.length}` }
      if (search) { params.push(`%${search}%`); sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})` }
      sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(Number(limit), Number(offset))
      const clients = await query(sql, params)
      const [{ count }] = await query('SELECT COUNT(*) FROM clients', [])
      logger.info('Clients listed', { count, filter: { status, search } })
      return sendSuccess(res, { clients, total: Number(count) })
    }

    // POST — create client
    if (req.method === 'POST') {
      const { name, email, phone, password, risk_profile, notes } = req.body || {}
      if (!name || !email || !password) {
        return sendError(res, new ValidationError('الاسم والبريد وكلمة المرور مطلوبة'))
      }
      const existing = await queryOne('SELECT id FROM clients WHERE email = $1', [email.toLowerCase()])
      if (existing) {
        logger.warn('Duplicate email', { email })
        return sendError(res, new ValidationError('البريد الإلكتروني مستخدم'))
      }
      const hash = await bcrypt.hash(password, 10)
      const acc = 'TH' + Date.now().toString().slice(-8)
      const client = await queryOne(
        `INSERT INTO clients (name, email, phone, password_hash, account_number, risk_profile, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, email, phone, status, account_number, join_date, risk_profile, notes`,
        [name, email.toLowerCase(), phone || null, hash, acc, risk_profile || 'moderate', notes || null]
      )
      logger.info('Client created', { clientId: client.id, email })
      return sendSuccess(res, { client }, 201)
    }

    // PATCH — update client
    if (req.method === 'PATCH') {
      const { id, name, email, phone, status, risk_profile, notes, password } = req.body || {}
      if (!id) {
        return sendError(res, new ValidationError('معرف العميل مطلوب'))
      }
      const sets = []; const params = []
      if (name)        { params.push(name);                   sets.push(`name = $${params.length}`) }
      if (email)       { params.push(email.toLowerCase());    sets.push(`email = $${params.length}`) }
      if (phone)       { params.push(phone);                  sets.push(`phone = $${params.length}`) }
      if (status)      { params.push(status);                 sets.push(`status = $${params.length}`) }
      if (risk_profile){ params.push(risk_profile);           sets.push(`risk_profile = $${params.length}`) }
      if (notes !== undefined){ params.push(notes);           sets.push(`notes = $${params.length}`) }
      if (password)    { params.push(await bcrypt.hash(password, 10)); sets.push(`password_hash = $${params.length}`) }
      if (!sets.length) {
        return sendError(res, new ValidationError('لا توجد حقول للتحديث'))
      }
      params.push(id)
      const client = await queryOne(
        `UPDATE clients SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length}
         RETURNING id, name, email, phone, status, account_number, risk_profile, notes`,
        params
      )
      if (!client) {
        logger.warn('Client not found for update', { clientId: id })
        return sendError(res, new NotFoundError('العميل'))
      }
      logger.info('Client updated', { clientId: id })
      return sendSuccess(res, { client })
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return sendError(res, new ValidationError('معرف العميل مطلوب'))
      }
      await query('DELETE FROM clients WHERE id = $1', [id])
      logger.info('Client deleted', { clientId: id })
      return sendSuccess(res, { success: true })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'clients' })
  }
}
