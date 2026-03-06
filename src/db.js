// node-service/src/db.js
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function getSettings() {
  const result = await pool.query('SELECT key, value FROM tgbot_settings')
  return Object.fromEntries(result.rows.map(r => [r.key, r.value]))
}

export async function getSetting(key) {
  const result = await pool.query(
    'SELECT value FROM tgbot_settings WHERE key = $1',
    [key]
  )
  return result.rows[0]?.value ?? null
}

export async function updateSetting(key, value) {
  await pool.query(
    `INSERT INTO tgbot_settings (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value]
  )
}
