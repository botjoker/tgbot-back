import { Telegraf } from 'telegraf'
import { getSetting } from './db.js'
import { askAgent } from './ai.js'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.on('text', async (ctx) => {
  try {
    const prompt = await getSetting('prompt') || 'Ты полезный ассистент.'
    const userMessage = ctx.message.text
    const reply = await askAgent(prompt, userMessage)
    await ctx.reply(reply)
  } catch (err) {
    console.error('Bot error:', err)
    await ctx.reply('Произошла ошибка, попробуйте позже.')
  }
})

export default bot
