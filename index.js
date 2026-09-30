const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const app = express()
app.get('/', (req, res) => { res.send('Bot Grow a Garden Aktif - Update 03:30') })
app.listen(process.env.PORT || 3000, () => console.log('Server jalan'))
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const from = msg.key.remoteJid
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase()
    if (text === '!stok') {
      await sock.sendMessage(from, { text: '🌱 STOK GROW A GARDEN 🌱\n⏰ Update tiap jam :30 WIB\n🔗 https://growagarden.gg/stocks' })
    }
  })
  setInterval(() => {
    const now = new Date()
    const jam = (now.getUTCHours() + 7) % 24
    const menit = now.getUTCMinutes()
    if (menit === 30) console.log(`AUTO UPDATE ${jam}:30 WIB - Kirim stok`)
  }, 60000)
}
startBot()
