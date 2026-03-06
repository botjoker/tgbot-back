import 'dotenv/config'
import express from 'express'
import apiRouter from './api.js'
import bot from './bot.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// CORS for vue-service
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

bot.launch()
console.log('Telegram bot started')

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
