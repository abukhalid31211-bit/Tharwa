import { query, queryOne } from '../_lib/db.js'
import { handleCors } from '../_lib/cors.js'
import { requireAdmin } from '../_lib/auth.js'
import logger from '../_lib/logger.js'
import { sendError, sendSuccess, ValidationError } from '../_lib/errors.js'

export default async function handler(req, res) {
  if (handleCors(req, res)) return
  const decoded = requireAdmin(req, res)
  if (!decoded) return
  if (req.method !== 'GET') {
    return sendError(res, new ValidationError('Method not allowed'))
  }

  try {
    const [
      clientStats,
      txStats,
      msgStats,
      recentClients,
      recentTx,
    ] = await Promise.all([
      query(`SELECT
               COUNT(*) FILTER (WHERE status='active') AS active,
               COUNT(*) FILTER (WHERE status='inactive') AS inactive,
               COUNT(*) AS total
             FROM clients`, []),
      query(`SELECT
               COALESCE(SUM(amount) FILTER (WHERE type='deposit' AND status='completed'), 0) AS total_deposits,
               COALESCE(SUM(amount) FILTER (WHERE type='withdrawal' AND status='completed'), 0) AS total_withdrawals,
               COUNT(*) FILTER (WHERE status='pending') AS pending_count,
               COUNT(*) AS total
             FROM transactions`, []),
      query(`SELECT
               COUNT(*) FILTER (WHERE status='new') AS new_count,
               COUNT(*) AS total
             FROM contact_messages`, []),
      query(`SELECT id, name, email, status, join_date FROM clients ORDER BY created_at DESC LIMIT 5`, []),
      query(`SELECT t.*, c.name AS client_name FROM transactions t
             LEFT JOIN clients c ON c.id = t.client_id
             ORDER BY t.created_at DESC LIMIT 5`, []),
    ])

    const cs = clientStats[0]
    const ts = txStats[0]
    const ms = msgStats[0]

    logger.info('Overview dashboard loaded')

    return sendSuccess(res, {
      kpis: {
        activeClients:     Number(cs.active),
        inactiveClients:   Number(cs.inactive),
        totalClients:      Number(cs.total),
        totalDeposits:     Number(ts.total_deposits),
        totalWithdrawals:  Number(ts.total_withdrawals),
        netAssets:         Number(ts.total_deposits) - Number(ts.total_withdrawals),
        pendingTransactions: Number(ts.pending_count),
        totalTransactions: Number(ts.total),
        newMessages:       Number(ms.new_count),
        totalMessages:     Number(ms.total),
      },
      recentClients,
      recentTransactions: recentTx,
    })
  } catch (e) {
    return sendError(res, e, { endpoint: 'overview' })
  }
}
