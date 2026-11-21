import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icone } from '../icones.jsx'

function DashboardAluno() {
  const [modalAberto, setModalAberto] = useState(false)

  // Guardam o botão que abre o popup e o primeiro campo dele.
  const botaoAbrirRef = useRef(null)
  const campoMaquinaRef = useRef(null)

  // Com o popup aberto: foca o primeiro campo e fecha com Esc.
  // Ao fechar, o foco volta para o botão que abriu.
  useEffect(() => {
    if (!modalAberto) return

    const botaoQueAbriu = botaoAbrirRef.current

    campoMaquinaRef.current.focus()

    function aoApertarTecla(event) {
      if (event.key === 'Escape') {
        setModalAberto(false)
      }
    }

    window.addEventListener('keydown', aoApertarTecla)

    return () => {
      window.removeEventListener('keydown', aoApertarTecla)
      botaoQueAbriu.focus()
    }
  }, [modalAberto])

  const maquinas = [
    {
      nome: 'Bambu Lab X1 Carbon',
      tipo: 'Impressão 3D',
      status: 'Livre',
      estilo: 'text-emerald-700 bg-emerald-50'
    },
    {
      nome: 'Ender 5 Plus',
      tipo: 'Impressão 3D',
      status: 'Em uso até 15h',
      estilo: 'text-amber-700 bg-amber-50'
    },
    {
      nome: 'Laser Cutter K40',
      tipo: 'Corte a laser',
      status: 'Manutenção',
      estilo: 'text-red-700 bg-red-50'
    },
    {
      nome: 'CNC Router 3018',
      tipo: 'Usinagem CNC',
      status: 'Livre',
      estilo: 'text-emerald-700 bg-emerald-50'
    }
  ]

  const acoesRapidas = [
    {
      icone: 'calendario',
      titulo: 'Reservar máquina',
      descricao: 'Escolha uma data e horário',
      destino: '/reservas'
    },
    {
      icone: 'pacote',
      titulo: 'Solicitar material',
      descricao: 'Crie um novo pedido',
      destino: '/inventario'
    },
    {
      icone: 'busca',
      titulo: 'Consultar estoque',
      descricao: 'Confira saldos disponíveis',
      destino: '/inventario'
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 p-8 flex flex-col gap-6">

        {/* Header principal */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              VISÃO GERAL
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Olá, João
            </h1>

            <p className="text-xs text-slate-500">
              Aqui está o resumo do laboratório hoje.
            </p>
          </div>

          {/* Avatar do usuário */}
          <div
            aria-hidden="true"
            className="size-9 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center"
          >
            JP
          </div>
        </header>

        {/* Banner principal */}
        <div className="bg-[#1b437c] text-white p-6 rounded-2xl flex justify-between items-center relative overflow-hidden">
          <div className="flex flex-col gap-2 z-10">
            <span className="inline-flex items-center gap-2 text-[11px] bg-emerald-500/20 text-emerald-300 font-medium px-2.5 py-0.5 rounded-full w-fit">
              <span className="size-1.5 rounded-full bg-emerald-400"></span>
              Laboratório aberto
            </span>

            <h2 className="text-xl font-bold">
              Pronto para criar?
            </h2>

            <p className="text-xs text-blue-100">
              Há 4 máquinas disponíveis e nenhum conflito na sua agenda de hoje.
            </p>
          </div>

          <button
            type="button"
            ref={botaoAbrirRef}
            onClick={() => setModalAberto(true)}
            className="bg-blue-400 hover:bg-blue-300 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors z-10 flex items-center gap-1.5 cursor-pointer"
          >
            <Icone nome="mais" className="w-4 h-4" /> Nova reserva
          </button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col items-center text-center gap-1">
            <Icone nome="calendario" className="w-4 h-4 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900 mt-1">12</span>
            <span className="text-xs font-semibold text-slate-800">Reservas hoje</span>
            <span className="text-[10px] text-slate-500">4 ainda disponíveis</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col items-center text-center gap-1">
            <Icone nome="prancheta" className="w-4 h-4 text-amber-500" />
            <span className="text-2xl font-bold text-slate-900 mt-1">5</span>
            <span className="text-xs font-semibold text-slate-800">Pedidos abertos</span>
            <span className="text-[10px] text-slate-500">2 são seus</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col items-center text-center gap-1">
            <Icone nome="impressora" className="w-4 h-4 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-900 mt-1">4</span>
            <span className="text-xs font-semibold text-slate-800">Máquinas livres</span>
            <span className="text-[10px] text-slate-500">de 7 equipamentos</span>
          </div>

        </div>

        {/* Seção inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Status das máquinas */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col gap-4">

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Status das máquinas
                </h2>

                <p className="text-[11px] text-slate-500">
                  Atualizado agora
                </p>
              </div>

              <Link
                to="/reservas"
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Ver agenda
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {maquinas.map((maquina) => (
                <div
                  key={maquina.nome}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="p-2 bg-slate-50 rounded-lg text-slate-500"
                    >
                      <Icone nome="impressora" className="w-4 h-4" />
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {maquina.nome}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {maquina.tipo}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${maquina.estilo}`}>
                    {maquina.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col gap-4">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ações rápidas
              </h2>

              <p className="text-[11px] text-slate-500">
                Acesse o que mais usa
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {acoesRapidas.map((acao) => (
                <Link
                  key={acao.titulo}
                  to={acao.destino}
                  className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Icone nome={acao.icone} className="w-4 h-4" />
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {acao.titulo}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {acao.descricao}
                      </p>
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-slate-300 text-xs group-hover:translate-x-0.5 transition-transform"
                  >
                    <Icone nome="seta" className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal de nova reserva */}
      <div
        className={`${modalAberto ? 'flex' : 'hidden'} fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 items-center justify-center p-4`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalReservaAluno"
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
        >

          {/* Cabeçalho */}
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2
                  id="tituloModalReservaAluno"
                  className="font-bold text-slate-900 text-sm"
                >
                  Nova reserva
                </h2>

                <p className="text-[11px] text-slate-500">
                  Escolha o equipamento, data e horário.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="text-slate-500 hover:text-slate-700 text-sm font-bold p-2"
                aria-label="Fechar modal"
              >
                <Icone nome="fechar" className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário Modal */}
            <form
              className="flex flex-col gap-3"
              onSubmit={(evento) => evento.preventDefault()}
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="campoMaquinaAluno"
                  className="text-xs font-semibold text-slate-700"
                >
                  Máquina
                </label>

                <select
                  id="campoMaquinaAluno"
                  ref={campoMaquinaRef}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Bambu Lab X1 Carbon</option>
                  <option>Ender 5 Plus</option>
                  <option>CNC Router 3018</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="campoDataAluno"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Data
                  </label>

                  <input
                    id="campoDataAluno"
                    type="date"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="campoHorarioAluno"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Horário
                  </label>

                  <input
                    id="campoHorarioAluno"
                    type="time"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardAluno