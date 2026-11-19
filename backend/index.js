require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth')
const { autenticar, exigirPerfil } = require('./middleware/auth')

app.use('/auth', authRoutes)

// rotas só para testar o RBAC (podem ser apagadas depois)
app.get('/eu', autenticar, (req, res) => res.json(req.usuario))
app.get('/admin-teste', autenticar, exigirPerfil('administrador'), (req, res) => {
  res.json({ ok: 'Você é administrador.' })
})

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

const pool = require('./db')

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ conectado: true, hora: result.rows[0].now })
  } catch (err) {
    console.error(err)
    res.status(500).json({ conectado: false, erro: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})