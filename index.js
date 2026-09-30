const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Bot Grow a Garden Aktif 24 Jam!')
})
app.listen(PORT, () => console.log('Server aktif'))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase()
    const jid = msg.key.remoteJid

    if (text === 'menu') {
      await sock.sendMessage(jid, { text: '🌱 SELAMAT DATANG DI SALURAN GROW A GARDEN 🌱\n\nKetik:\n• stok - cek stok seed\n• cuaca - cek cuaca\n• harga - cek harga panen' })
    }
    if (text === 'stok') {
      await sock.sendMessage(jid, { text: '📦 Stok saat ini: Carrot, Strawberry, Blueberry tersedia.' })
    }
  })
}
startBot()
