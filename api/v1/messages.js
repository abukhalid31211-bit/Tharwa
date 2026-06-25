import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError, NotFoundError } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return

  // Public POST — submit contact form
  if (req.method === 'POST' && !req.headers.authorization) {
    const { name, email, phone, service, message, source = 'contact' } = req.body || {}
    if (!name || !email || !message) {
      return sendError(res, new ValidationError('الاسم والبريد والرسالة مطلوبة'))
    }
    try {
      const msg = await queryOne(
        `INSERT INTO contact_messages (name, email, phone, service, message, source)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
        [name, email, phone || null, service || null, message, source]
      )
      logger.info('Contact message submitted', { messageId: msg.id, email, service })
      return sendSuccess(res, { success: true, id: msg.id }, 201)
    } catch (e) {
      return sendError(res, e, { endpoint: 'messages-public' })
    }
  }

  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { status, limit = 50, offset = 0 } = req.query
      let sql = 'SELECT * FROM contact_messages WHERE 1=1'
      const params = []
      if (status){ params.push(status); sql += ` AND status = $${params.length}` }
      sql += ` ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`
      params.push(Number(limit), Number(offset))
      const messages = await query(sql, params)
      logger.info('Messages listed', { count: messages.length, filter: { status } })
      return sendSuccess(res, { messages })
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body || {}
      if (!id || !status) {
        return sendError(res, new ValidationError('معرف الرسالة والحالة مطلوبان'))
      }
      const msg = await queryOne(
        'UPDATE contact_messages SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      )
      if (!msg) {
        logger.warn('Message not found for update', { messageId: id })
        return sendError(res, new NotFoundError('الرسالة'))
      }
      logger.info('Message updated', { messageId: id, newStatus: status })
      return sendSuccess(res, { message: msg })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return sendError(res, new ValidationError('معرف الرسالة مطلوب'))
      }
      await query('DELETE FROM contact_messages WHERE id = $1', [id])
      logger.info('Message deleted', { messageId: id })
      return sendSuccess(res, { success: true })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'messages' })
  }
}
