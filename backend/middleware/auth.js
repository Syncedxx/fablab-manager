const jwt = require('jsonwebtoken')

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || ''
  const [tipo, token] = cabecalho.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' })
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ erro: 'Sessão inválida ou expirada.' })
  }
}

function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'Você não tem permissão para isso.' })
    }
    next()
  }
}

module.exports = { autenticar, exigirPerfil }