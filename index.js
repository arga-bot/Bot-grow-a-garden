const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req,res) => res.send('Bot Grow a Garden Active! Update jam 03:30 WIB'))
app.listen(PORT, () => console.log('Server jalan di port', PORT))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['Bot Grow a Garden', 'Chrome', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if(connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if(shouldReconnect) startBot()
    } else if(connection === 'open') {
      console.log('✅ BOT TERHUBUNG KE WHATSAPP!')
    }
  })

  // AUTO UPDATE JAM 03:30 WIB
  setInterval(async () => {
    const now = new Date()
    const wib = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const jam = wib.getHours()
    const menit = wib.getMinutes()
    console.log(`Cek waktu: ${jam}:${menit} WIB`)

    if(jam === 3 && menit === 30) {
      console.log('⏰ KIRIM UPDATE 03:30 WIB!')
      // ganti nomor target di bawah ini
      // contoh: const target = '628xxxx@s.whatsapp.net'
      // await sock.sendMessage(target, { text: '🌱 Update Grow a Garden jam 03:30 WIB!' })
    }
  }, 60000) // cek tiap 1 menit
}

startBot()
