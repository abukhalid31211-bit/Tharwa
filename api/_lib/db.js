import pg from 'pg'
import logger from './logger.js'

const { Pool } = pg

// Create pool with proper error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
})

// Log pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client in pool', err, { context: 'db-pool' })
})

export { pool }

/**
 * Helper: run a query and return rows
 */
export async function query(text, params) {
  if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL not configured', new Error('Missing DATABASE_URL'))
    throw new Error('Database connection not configured')
  }

  let client
  try {
    client = await pool.connect()
    const res = await client.query(text, params)
    return res.rows
  } catch (err) {
    logger.error('Database query failed', err, { query: text, params })
    throw err
  } finally {
    if (client) client.release()
  }
}

/**
 * Helper: run a query and return first row or null
 */
export async function queryOne(text, params) {
  const rows = await query(text, params)
  return rows[0] || null
}
