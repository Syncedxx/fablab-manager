const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const router = express.Router()

router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' })
  }
  if (senha.length < 8) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 8 caracteres.' })
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10)
    const resultado = await pool.query(
      `insert into usuarios (nome, email, senha_hash)
       values ($1, $2, $3)
       returning id, nome, email, perfil`,
      [nome, email.toLowerCase(), senhaHash]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
    }
    console.error(err)
    res.status(500).json({ erro: 'Erro ao cadastrar.' })
  }
})

router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' })
  }

  try {
    const resultado = await pool.query(
      'select id, nome, email, senha_hash, perfil, ativo from usuarios where email = $1',
      [email.toLowerCase()]
    )
    const usuario = resultado.rows[0]
    const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senha_hash))

    if (!senhaOk || !usuario.ativo) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao entrar.' })
  }
})

module.exports = router