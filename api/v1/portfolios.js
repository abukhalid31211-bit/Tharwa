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
      const { client_id, id } = req.query
      if (id) {
        const p = await queryOne('SELECT * FROM portfolios WHERE id = $1', [id])
        if (!p) {
          logger.warn('Portfolio not found', { portfolioId: id })
          return sendError(res, new NotFoundError('المحفظة'))
        }
        logger.debug('Portfolio retrieved', { portfolioId: id })
        return sendSuccess(res, { portfolio: p })
      }
      const params = client_id ? [client_id] : []
      const portfolios = await query(
        `SELECT p.*, c.name AS client_name FROM portfolios p
         LEFT JOIN clients c ON c.id = p.client_id
         ${client_id ? 'WHERE p.client_id = $1' : ''}
         ORDER BY p.created_at DESC`,
        params
      )
      logger.info('Portfolios listed', { count: portfolios.length, clientId: client_id })
      return sendSuccess(res, { portfolios })
    }

    if (req.method === 'POST') {
      const { client_id, name, type, initial_value, currency = 'SAR', notes } = req.body || {}
      if (!client_id || !name || !initial_value) {
        return sendError(res, new ValidationError('الحقول الأساسية مطلوبة: client_id, name, initial_value'))
      }
      const p = await queryOne(
        `INSERT INTO portfolios (client_id, name, type, initial_value, current_value, currency, notes)
         VALUES ($1, $2, $3, $4, $4, $5, $6) RETURNING *`,
        [client_id, name, type || 'mixed', initial_value, currency, notes || null]
      )
      logger.info('Portfolio created', { portfolioId: p.id, clientId: client_id })
      return sendSuccess(res, { portfolio: p }, 201)
    }

    if (req.method === 'PATCH') {
      const { id, name, type, current_value, status, notes } = req.body || {}
      if (!id) {
        return sendError(res, new ValidationError('معرف المحفظة مطلوب'))
      }
      const sets = []; const params = []
      if (name)    { params.push(name);          sets.push(`name = $${params.length}`) }
      if (type)    { params.push(type);          sets.push(`type = $${params.length}`) }
      if (current_value !== undefined){ params.push(current_value); sets.push(`current_value = $${params.length}`) }
      if (status)  { params.push(status);        sets.push(`status = $${params.length}`) }
      if (notes !== undefined){ params.push(notes); sets.push(`notes = $${params.length}`) }
      if (!sets.length) {
        return sendError(res, new ValidationError('لا توجد حقول للتحديث'))
      }
      params.push(id)
      const p = await queryOne(
        `UPDATE portfolios SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
        params
      )
      if (!p) {
        logger.warn('Portfolio not found for update', { portfolioId: id })
        return sendError(res, new NotFoundError('المحفظة'))
      }
      logger.info('Portfolio updated', { portfolioId: id })
      return sendSuccess(res, { portfolio: p })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return sendError(res, new ValidationError('معرف المحفظة مطلوب'))
      }
      await query('DELETE FROM portfolios WHERE id = $1', [id])
      logger.info('Portfolio deleted', { portfolioId: id })
      return sendSuccess(res, { success: true })
    }

    return sendError(res, new ValidationError('Method not allowed'))
  } catch (e) {
    return sendError(res, e, { endpoint: 'portfolios' })
  }
}
