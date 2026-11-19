const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-fablab-2026';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// MIDDLEWARE DE SEGURANÇA (RBAC) E AUDITORIA (FASE 3)

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1] || authHeader;

  jwt.verify(token, JWT_SECRET, (err, decodificado) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
    req.usuario = decodificado;
    next();
  });
};

// Grava trilha imutável na tabela logs_auditoria (Fase 3)
async function registrarAuditoria(client, { ator_id, acao, entidade_tipo, entidade_id, estado_anterior, estado_novo, motivo, detalhes }) {
  const db = client || pool;
  await db.query(
    `INSERT INTO logs_auditoria 
     (ator_id, acao, entidade_tipo, entidade_id, estado_anterior, estado_novo, motivo, detalhes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      ator_id || null,
      acao,
      entidade_tipo,
      entidade_id || null,
      estado_anterior || null,
      estado_novo || null,
      motivo || null,
      detalhes ? JSON.stringify(detalhes) : null
    ]
  );
}

// FASE 1: AUTENTICAÇÃO E USUÁRIOS

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = $1 AND senha_hash = $2',
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const usuario = result.rows[0];
    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Usuário desativado.' });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

app.post('/api/usuarios', verificarToken, async (req, res) => {
  if (req.usuario.perfil !== 'administrador') {
    return res.status(403).json({ erro: 'Apenas administradores podem cadastrar usuários.' });
  }
  const { nome, email, senha, perfil } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil) 
       VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil, ativo`,
      [nome, email, senha, perfil || 'aluno']
    );
    await registrarAuditoria(null, {
      ator_id: req.usuario.id,
      acao: 'usuario.criado',
      entidade_tipo: 'usuarios',
      entidade_id: result.rows[0].id,
      estado_novo: perfil || 'aluno'
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// FASE 1: PROJETOS

app.get('/api/projetos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome AS criador_nome, t.nome AS turma_nome
      FROM projetos p
      JOIN usuarios u ON p.criado_por = u.id
      LEFT JOIN turmas t ON p.turma_id = t.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/projetos', verificarToken, async (req, res) => {
  const { codigo, titulo, descricao, turma_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projetos (codigo, titulo, descricao, turma_id, criado_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo, titulo, descricao || null, turma_id || null, req.usuario.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// FASE 1: EQUIPAMENTOS E RESERVAS (Bloqueio GIST)

app.get('/api/equipamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipamentos ORDER BY nome ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/reservas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, e.nome AS equipamento_nome, u.nome AS usuario_nome, p.titulo AS projeto_titulo
      FROM reservas r
      JOIN equipamentos e ON r.equipamento_id = e.id
      JOIN usuarios u ON r.usuario_id = u.id
      LEFT JOIN projetos p ON r.projeto_id = p.id
      ORDER BY r.inicio DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/reservas', verificarToken, async (req, res) => {
  const { equipamento_id, projeto_id, turma_id, finalidade, inicio, fim } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO reservas (equipamento_id, usuario_id, projeto_id, turma_id, finalidade, inicio, fim)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [equipamento_id, req.usuario.id, projeto_id || null, turma_id || null, finalidade, inicio, fim]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23P01') {
      return res.status(409).json({
        erro: 'Conflito de horário: este equipamento já está reservado neste período.'
      });
    }
    res.status(400).json({ erro: err.message });
  }
});

app.patch('/api/reservas/:id/cancelar', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { motivo_cancelamento } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reservas SET status = 'cancelada', motivo_cancelamento = $1 
       WHERE id = $2 RETURNING *`,
      [motivo_cancelamento || 'Cancelada pelo usuário', id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Reserva não encontrada.' });

    await registrarAuditoria(null, {
      ator_id: req.usuario.id,
      acao: 'reserva.cancelada',
      entidade_tipo: 'reservas',
      entidade_id: id,
      estado_novo: 'cancelada',
      motivo: motivo_cancelamento
    });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// FASE 1 & 2: INVENTÁRIO E MOVIMENTAÇÕES DE ESTOQUE

app.get('/api/inventario', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, codigo, nome, categoria, descricao, unidade,
        quantidade_total,
        quantidade_reservada,
        (quantidade_total - quantidade_reservada) AS quantidade_livre,
        estoque_minimo,
        ativo
      FROM insumos
      WHERE ativo = true
      ORDER BY nome ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/inventario', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Sem permissão para cadastrar insumos.' });
  }
  const { codigo, nome, categoria, descricao, unidade, quantidade_total, estoque_minimo } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO insumos (codigo, nome, categoria, descricao, unidade, quantidade_total, estoque_minimo)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [codigo, nome, categoria, descricao || null, unidade, quantidade_total || 0, estoque_minimo || 0]
    );
    const insumo = result.rows[0];

    if (quantidade_total > 0) {
      await client.query(
        `INSERT INTO movimentacoes_estoque (insumo_id, tipo, quantidade, motivo, realizado_por)
         VALUES ($1, 'entrada', $2, 'Cadastro inicial de estoque', $3)`,
        [insumo.id, quantidade_total, req.usuario.id]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(insumo);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// FASE 1 & 2: REQUISIÇÕES (Solicitar, Avaliar e Entregar)

app.get('/api/requisicoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        req.id, req.finalidade, req.status, req.comentario_avaliador, req.criado_em,
        u.nome AS solicitante,
        p.titulo AS projeto,
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', ri.id,
              'insumo_id', i.id,
              'insumo_nome', i.nome,
              'unidade', i.unidade,
              'qtd_solicitada', ri.qtd_solicitada,
              'qtd_entregue', ri.qtd_entregue
            )
          ) FILTER (WHERE ri.id IS NOT NULL), '[]'
        ) AS itens
      FROM requisicoes req
      JOIN usuarios u ON req.usuario_id = u.id
      JOIN projetos p ON req.projeto_id = p.id
      LEFT JOIN requisicao_itens ri ON req.id = ri.requisicao_id
      LEFT JOIN insumos i ON ri.insumo_id = i.id
      GROUP BY req.id, u.nome, p.titulo
      ORDER BY req.criado_em DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/requisicoes', verificarToken, async (req, res) => {
  const { projeto_id, finalidade, itens } = req.body;
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'Informe pelo menos um insumo na requisição.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const reqResult = await client.query(
      `INSERT INTO requisicoes (usuario_id, projeto_id, finalidade)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.usuario.id, projeto_id, finalidade]
    );
    const novaRequisicao = reqResult.rows[0];

    for (const item of itens) {
      await client.query(
        `INSERT INTO requisicao_itens (requisicao_id, insumo_id, qtd_solicitada)
         VALUES ($1, $2, $3)`,
        [novaRequisicao.id, item.insumo_id, item.qtd_solicitada]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ mensagem: 'Requisição criada com sucesso', requisicao: novaRequisicao });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// Avaliar (Aprovar ou Recusar)
app.post('/api/requisicoes/:id/avaliar', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Apenas instrutores ou administradores podem avaliar requisições.' });
  }

  const { id } = req.params;
  const { status, comentario_avaliador } = req.body;
  if (!['aprovada', 'recusada'].includes(status)) {
    return res.status(400).json({ erro: 'Status inválido. Use "aprovada" ou "recusada".' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updateReq = await client.query(
      `UPDATE requisicoes 
       SET status = $1, avaliador_id = $2, comentario_avaliador = $3, decidida_em = NOW()
       WHERE id = $4 RETURNING *`,
      [status, req.usuario.id, comentario_avaliador || null, id]
    );

    if (updateReq.rows.length === 0) throw new Error('Requisição não encontrada.');

    if (status === 'aprovada') {
      const itens = await client.query(
        'SELECT insumo_id, qtd_solicitada FROM requisicao_itens WHERE requisicao_id = $1',
        [id]
      );
      for (const item of itens.rows) {
        await client.query(
          `UPDATE insumos SET quantidade_reservada = quantidade_reservada + $1 WHERE id = $2`,
          [item.qtd_solicitada, item.insumo_id]
        );
      }
    }

    await registrarAuditoria(client, {
      ator_id: req.usuario.id,
      acao: `requisicao.${status}`,
      entidade_tipo: 'requisicoes',
      entidade_id: id,
      estado_anterior: 'pendente',
      estado_novo: status,
      motivo: comentario_avaliador
    });

    await client.query('COMMIT');
    res.json({ mensagem: `Requisição ${status} com sucesso!`, requisicao: updateReq.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// Entregar material fisicamente (Baixa real no estoque + Movimentação)
app.post('/api/requisicoes/:id/entregar', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Apenas instrutores ou administradores registram entregas.' });
  }

  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const reqCheck = await client.query('SELECT status FROM requisicoes WHERE id = $1', [id]);
    if (reqCheck.rows.length === 0) throw new Error('Requisição não encontrada.');
    if (reqCheck.rows[0].status !== 'aprovada') {
      throw new Error('Apenas requisições aprovadas podem ser entregues.');
    }

    const itens = await client.query(
      'SELECT id, insumo_id, qtd_solicitada FROM requisicao_itens WHERE requisicao_id = $1',
      [id]
    );

    for (const item of itens.rows) {
      await client.query(
        `UPDATE requisicao_itens SET qtd_entregue = $1 WHERE id = $2`,
        [item.qtd_solicitada, item.id]
      );

      await client.query(
        `UPDATE insumos 
         SET quantidade_total = quantidade_total - $1,
             quantidade_reservada = quantidade_reservada - $1
         WHERE id = $2`,
        [item.qtd_solicitada, item.insumo_id]
      );

      await client.query(
        `INSERT INTO movimentacoes_estoque (insumo_id, requisicao_id, tipo, quantidade, motivo, realizado_por)
         VALUES ($1, $2, 'entrega', $3, 'Entrega de requisição aprovada', $4)`,
        [item.insumo_id, id, item.qtd_solicitada, req.usuario.id]
      );
    }

    const updated = await client.query(
      `UPDATE requisicoes SET status = 'entregue' WHERE id = $1 RETURNING *`,
      [id]
    );

    await registrarAuditoria(client, {
      ator_id: req.usuario.id,
      acao: 'requisicao.entregue',
      entidade_tipo: 'requisicoes',
      entidade_id: id,
      estado_anterior: 'aprovada',
      estado_novo: 'entregue'
    });

    await client.query('COMMIT');
    res.json({ mensagem: 'Materiais entregues e estoque atualizado!', requisicao: updated.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// FASE 2: TURMAS (Painel do Instrutor)

app.get('/api/turmas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM turmas ORDER BY criado_em DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/turmas', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Alunos não podem criar turmas.' });
  }
  const { codigo, nome, curso, periodo_letivo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO turmas (codigo, nome, curso, periodo_letivo, criado_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo, nome, curso, periodo_letivo, req.usuario.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.post('/api/turmas/:id/matricular', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Sem permissão para matricular alunos.' });
  }
  const { id } = req.params;
  const { aluno_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO turma_matriculas (turma_id, aluno_id) VALUES ($1, $2) RETURNING *`,
      [id, aluno_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// FASE 2: MANUTENÇÃO E CHECKLISTS

app.get('/api/manutencoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, e.nome AS equipamento_nome
      FROM manutencoes m
      JOIN equipamentos e ON m.equipamento_id = e.id
      ORDER BY m.criado_em DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/manutencoes', verificarToken, async (req, res) => {
  const { equipamento_id, tipo, descricao, agendada_para } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO manutencoes (equipamento_id, tipo, status, descricao, agendada_para, reportada_por, criada_por)
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
      [
        equipamento_id,
        tipo || 'corretiva',
        tipo === 'preventiva' ? 'agendada' : 'aberta',
        descricao,
        agendada_para || null,
        req.usuario.id
      ]
    );

    if (tipo === 'corretiva') {
      await pool.query(`UPDATE equipamentos SET status = 'manutencao' WHERE id = $1`, [equipamento_id]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.patch('/api/manutencoes/:id/concluir', verificarToken, async (req, res) => {
  if (req.usuario.perfil === 'aluno') {
    return res.status(403).json({ erro: 'Apenas instrutores ou administradores concluem manutenções.' });
  }
  const { id } = req.params;
  const { resultado, resumo, executor } = req.body; // resultado: 'liberado' ou 'mantido_indisponivel'

  try {
    const result = await pool.query(
      `UPDATE manutencoes 
       SET status = 'concluida', concluida_em = NOW(), resultado = $1, resumo = $2, executor = $3
       WHERE id = $4 RETURNING *`,
      [resultado || 'liberado', resumo || null, executor || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Manutenção não encontrada.' });

    const manutencao = result.rows[0];
    if (resultado === 'liberado') {
      await pool.query(
        `UPDATE equipamentos SET status = 'disponivel', ultima_manutencao_em = NOW() WHERE id = $1`,
        [manutencao.equipamento_id]
      );
    }

    await registrarAuditoria(null, {
      ator_id: req.usuario.id,
      acao: 'manutencao.concluida',
      entidade_tipo: 'manutencoes',
      entidade_id: id,
      estado_novo: resultado || 'liberado',
      motivo: resumo
    });

    res.json(manutencao);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// FASE 2 & 3: ALERTAS (VIEWS) E NOTIFICAÇÕES

app.get('/api/alertas', verificarToken, async (req, res) => {
  try {
    const insumosCriticos = await pool.query('SELECT * FROM insumos_criticos');
    const manutencoesAtrasadas = await pool.query('SELECT * FROM manutencoes_atrasadas');
    const notificacoes = await pool.query(
      'SELECT * FROM notificacoes WHERE usuario_id = $1 ORDER BY criado_em DESC LIMIT 20',
      [req.usuario.id]
    );

    res.json({
      insumos_criticos: insumosCriticos.rows,
      manutencoes_atrasadas: manutencoesAtrasadas.rows,
      notificacoes: notificacoes.rows
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// FASE 3: AUDITORIA AVANÇADA (Logs Imutáveis)

app.get('/api/auditoria', verificarToken, async (req, res) => {
  if (req.usuario.perfil !== 'administrador') {
    return res.status(403).json({ erro: 'Acesso restrito aos administradores.' });
  }
  try {
    const result = await pool.query(`
      SELECT l.*, u.nome AS ator_nome
      FROM logs_auditoria l
      LEFT JOIN usuarios u ON l.ator_id = u.id
      ORDER BY l.ocorrido_em DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// FASE 4: PRIVACIDADE / LGPD

// Registrar ciência do termo de privacidade pelo usuário
app.post('/api/privacidade/ciencia', verificarToken, async (req, res) => {
  const { versao_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO avisos_privacidade_ciencias (versao_id, usuario_id)
       VALUES ($1, $2) ON CONFLICT (versao_id, usuario_id) DO NOTHING RETURNING *`,
      [versao_id, req.usuario.id]
    );
    res.status(201).json({ mensagem: 'Ciência registrada com sucesso.', registro: result.rows[0] });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Criar pedido do titular (acesso, correção, exclusão)
app.post('/api/privacidade/solicitacoes', verificarToken, async (req, res) => {
  const { tipo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO solicitacoes_titular (usuario_id, tipo)
       VALUES ($1, $2) RETURNING *`,
      [req.usuario.id, tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar pedidos LGPD (Admin)
app.get('/api/privacidade/solicitacoes', verificarToken, async (req, res) => {
  if (req.usuario.perfil !== 'administrador') {
    return res.status(403).json({ erro: 'Acesso restrito aos administradores.' });
  }
  try {
    const result = await pool.query(`
      SELECT s.*, u.nome AS titular_nome, u.email AS titular_email
      FROM solicitacoes_titular s
      LEFT JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY s.recebida_em DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Reportar incidente de privacidade
app.post('/api/privacidade/incidentes', verificarToken, async (req, res) => {
  const { resumo, categorias_afetadas, acoes_contencao } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO incidentes_privacidade (resumo, categorias_afetadas, acoes_contencao, reportado_por)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [resumo, categorias_afetadas || null, acoes_contencao || null, req.usuario.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// INICIALIZAÇÃO DO SERVIDOR

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor FabLab Manager (Fases 1 a 4) rodando na porta ${PORT}`);
});

module.exports = app;