import { Router } from 'express'
import { getSettings, updateSetting } from './db.js'

const router = Router()

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'

function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  if (!authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString()
  const [login, password] = credentials.split(':')
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return next()
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}

// POST /api/auth — validate login/password
router.post('/auth', (req, res) => {
  const { login, password } = req.body
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.json({ ok: true })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

// GET /api/settings — get all settings
router.get('/settings', basicAuth, async (req, res) => {
  try {
    const settings = await getSettings()
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/settings/:key — update a setting
router.put('/settings/:key', basicAuth, async (req, res) => {
  try {
    const { key } = req.params
    const { value } = req.body
    if (!value) return res.status(400).json({ error: 'value is required' })
    await updateSetting(key, value)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
