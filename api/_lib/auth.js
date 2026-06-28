import jwt from 'jsonwebtoken'

const getSecret = () => process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || null

const JWT_EXPIRES = '8h'

export function signToken(payload) {
  const secret = getSecret()
  if (!secret) throw new Error('JWT secret not configured')
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  const secret = getSecret()
  if (!secret) return null
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return null
  }
}

export function extractToken(req) {
  const auth = req.headers['authorization'] || ''
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

export function requireClient(req, res) {
  const token = extractToken(req)
  if (!token) {
    res.status(401).json({ error: 'Unauthorized — missing token' })
    return null
  }
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'client') {
    res.status(401).json({ error: 'Unauthorized — client token required' })
    return null
  }
  return payload
}
