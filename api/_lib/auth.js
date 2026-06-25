import jwt from 'jsonwebtoken'
import logger from './logger.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = '8h'

// Validate JWT_SECRET on module load
if (!JWT_SECRET) {
  logger.error('JWT_SECRET not configured', new Error('Missing JWT_SECRET'))
  throw new Error('JWT_SECRET environment variable is required for authentication')
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    logger.debug('Token verification failed', { error: err.message })
    return null
  }
}

export function extractToken(req) {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

export function requireAdmin(req, res) {
  const token = extractToken(req)
  if (!token) {
    res.status(401).json({ error: 'Unauthorized — missing token' })
    return null
  }
  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized — invalid or expired token' })
    return null
  }
  return payload
}
