import { useState } from 'react'
import { Link } from 'react-router-dom'

const TIPOS_NOTIFICACAO = {
  estoque: {
    icone: '📦',
    cor: 'bg-rose-50 text-rose-700',
    link: '/inventario',
    textoLink: 'Ver inventário'
  },
  conflito: {
    icone: '📅',
    cor: 'bg-amber-50 text-amber-700',
    link: '/reservas',
    textoLink: 'Ver reservas'
  }
}

function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: 'estoque',
      titulo: 'Estoque crítico: PLA Branco 1.75mm',
      texto: 'Restam apenas 120 g. Solicite reposição.',
      hora: 'Há 10 min',
      lida: false
    },
    {
      id: 2,
      tipo: 'conflito',
      titulo: 'Conflito de reserva: Ender 5 Plus',
      texto: 'Dois agendamentos para hoje às 14h. Ajuste um dos horários.',
      hora: 'Há 1 h',
      lida: false
    },
    {
      id: 3,
      tipo: 'estoque',
      titulo: 'Estoque crítico: Placa MDF 3mm',
      texto: 'Restam apenas 2 un.',
      hora: 'Há 3 h',
      lida: false
    },
    {
      id: 4,
      tipo: 'conflito',
      titulo: 'Conflito de reserva: Laser Cutter K40',
      texto: 'Existe uma reserva em uma máquina em manutenção.',
      hora: 'Ontem',
      lida: true
    }
  ])

  const [filtro, setFiltro] = useState('')

  const naoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length

  const notificacoesFiltradas = notificacoes.filter(
    (notificacao) => filtro === '' || notificacao.tipo === filtro
  )

  function marcarTodasComoLidas() {
    setNotificacoes((notificacoesAtuais) =>
      notificacoesAtuais.map((notificacao) => ({
        ...notificacao,
        lida: true
      }))
    )
  }

  return (
    <div className="w-full min-h-screen p-8 flex flex-col gap-6 bg-slate-50 text-slate-800 antialiased font-sans">

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            ALERTAS DO SISTEMA
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Notificações
          </h1>

          <p role="status" className="text-xs text-slate-500">
            {naoLidas === 0
              ? 'Tudo em dia.'
              : `${naoLidas} alerta(s) não lido(s).`}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={marcarTodasComoLidas}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
          >
            Marcar todas como lidas
          </button>
        </div>
      </header>

      {/* Filtro */}
      <div className="flex gap-3">
        <select
          aria-label="Filtrar por tipo de alerta"
          value={filtro}
          onChange={(event) => setFiltro(event.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Todos os alertas</option>
          <option value="estoque">Estoque crítico</option>
          <option value="conflito">Conflito de reserva</option>
        </select>
      </div>

      {/* Lista de notificações */}
      <div className="flex flex-col gap-3">
        {notificacoesFiltradas.length > 0 ? (
          notificacoesFiltradas.map((notificacao) => {
            const tipo = TIPOS_NOTIFICACAO[notificacao.tipo]

            return (
              <div
                key={notificacao.id}
                className={`border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 ${
                  notificacao.lida ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className={`w-10 h-10 rounded-lg ${tipo.cor} flex items-center justify-center shrink-0`}
                  >
                    {tipo.icone}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-slate-800">
                      {!notificacao.lida && (
                        <span className="sr-only">Não lida: </span>
                      )}

                      {notificacao.titulo}

                      {!notificacao.lida && (
                        <span
                          aria-hidden="true"
                          className="inline-block w-2 h-2 rounded-full bg-blue-600 ml-2"
                        />
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      {notificacao.texto}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {notificacao.hora}
                    </p>
                  </div>
                </div>

                <Link
                  to={tipo.link}
                  aria-label={`${tipo.textoLink}: ${notificacao.titulo}`}
                  className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
                >
                  {tipo.textoLink}
                </Link>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-slate-500 text-center py-10">
            Nenhum alerta por aqui.
          </p>
        )}
      </div>

    </div>
  )
}

export default Notificacoes