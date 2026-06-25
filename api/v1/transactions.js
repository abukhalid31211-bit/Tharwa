import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError, NotFoundError } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return

  try {
    if (req.method === 'GET') {
      const { id, client_id, type, status, limit = 50, offset = 0 } = req.query
      if (id) {
        const tx = await queryOne('SELECT * FROM transactions WHERE id = $1', [id])
        if (!tx) {
          logger.warn('Transaction not found', { transactionId: id })
          return sendError(res, new NotFoundError('المعاملة'))
        }
        logger.debug('Transaction retrieved', { transactionId: id })
        return sendSuccess(res, { transaction: tx })
      }
      let sql = 'SELECT t.*, c.name AS client_name FROM transactions t LEFT JOIN clients c ON c.id = t.client_id WHERE 1=1'
      const params = []
      if (client_id){ params.push(client_id); sql += ` AND t.client_id = $${params.length}` }
      if (type)     { params.push(type);      sql += ` AND t.type = $${params.length}` }
      if (status)   { params.push(status);    sql += ` AND t.status = $${params.length}` }
      sql += ` ORDER BY t.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`
      params.push(Number(limit), Number(offset))
      const transactions = await query(sql, params)
      logger.info('Transactions listed', { count: transactions.length, filter: { client_id, type, status } })
      return sendSuccess(res, { transactions })
    }

    if (req.method === 'POST') {
      const { client_id, type, amount, currency = 'SAR', notes, status = 'pending' } = req.body || {}
      if (!client_id || !type || !amount) {
        return sendError(res, new ValidationError('الحقول المطلوبة: client_id, type, amount'))
      }
      const ref = 'TXN-' + Date.now()
      const tx = await queryOne(
        `INSERT INTO transactions (client_id, type, amount, currency, reference, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [client_id, type, amount, currency, ref, notes || null, status]
      )
      logger.info('Transaction created', { transactionId: tx.id, clientId: client_id, amount })
      return sendSuccess(res, { transaction: tx }, 201)
    }

    if (req.method === 'PATCH') {
      const { id, status, notes } = req.body || {}
      if (!id) {
        return sendError(res, new ValidationError('معرف المعاملة مطلوب'))
      }
      const sets = []; const params = []
      if (status){ params.push(status); sets.push(`status = $${params.length}`) }
      if (notes !== undefined){ params.push(notes); sets.push(`notes = $${params.length}`) }
      if (!sets.length) {
        return sendError(res, new ValidationError('لا توجد حقول للتحديث'))
      }
      params.push(id)
      const tx = await queryOne(
        `UPDATE transactions SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
        params
      )
      if (!tx) {
        logger.warn('Transaction not found for update', { transactionId: id })
        return sendError(res, new NotFoundError('المعاملة'))
      }
      logger.info('Transaction updated', { transactionId: id, newStatus: status })
      return sendSuccess(res, { transaction: tx })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return sendError(res, new ValidationError('معرف المعاملة مطلوب'))
      }
      await query('DELETE FROM transactions WHERE id = $1', [id])
      logger.info('Transaction deleted', { transactionId: id })
      return sendSuccess(res, { success: true })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'transactions' })
  }
}
