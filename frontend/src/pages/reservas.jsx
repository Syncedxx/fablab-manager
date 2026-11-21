import { useEffect, useRef, useState } from 'react'
import { Icone } from '../icones.jsx'

function obterDataHoje() {
  const data = new Date()
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function formatarData(data) {
  return data.split('-').reverse().join('/')
}

function Reservas() {
  const [hoje] = useState(() => obterDataHoje())

  const [reservas, setReservas] = useState([
    {
      id: 1,
      maquina: 'Bambu Lab X1 Carbon',
      nomeMaquina: 'Bambu Lab X1',
      aluno: 'Higor Cardoso',
      inicio: '09:00',
      fim: '11:00',
      data: null
    },
    {
      id: 2,
      maquina: 'Ender 5 Plus',
      nomeMaquina: 'Ender 5 Plus',
      aluno: 'João Pedro',
      inicio: '13:00',
      fim: '15:00',
      data: null
    }
  ])

  const [modalAberto, setModalAberto] = useState(false)
  const [avisoConflito, setAvisoConflito] = useState('')

  const [maquina, setMaquina] = useState('Bambu Lab X1 Carbon')
  const [data, setData] = useState(hoje)
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [aluno, setAluno] = useState('')

  const proximoId = useRef(3)

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

  function abrirModal() {
    setAvisoConflito('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function mostrarAviso(texto) {
    setAvisoConflito(texto)
  }

  function acharConflito(
    maquinaSelecionada,
    dataSelecionada,
    horarioInicio,
    horarioFim
  ) {
    return reservas.find((reserva) => {
      if (reserva.maquina !== maquinaSelecionada) {
        return false
      }

      const dataReserva = reserva.data || hoje

      if (dataReserva !== dataSelecionada) {
        return false
      }

      return horarioInicio < reserva.fim && horarioFim > reserva.inicio
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (fim <= inicio) {
      mostrarAviso('O horário final precisa ser depois do inicial.')
      return
    }

    const conflito = acharConflito(maquina, data, inicio, fim)

    if (conflito) {
      mostrarAviso(
        `Conflito: ${maquina} já está reservada das ${conflito.inicio} às ${conflito.fim}.`
      )
      return
    }

    const novaReserva = {
      id: proximoId.current++,
      maquina,
      nomeMaquina: maquina,
      aluno,
      inicio,
      fim,
      data
    }

    setReservas((reservasAtuais) => [...reservasAtuais, novaReserva])

    // Restaura os valores iniciais do formulário
    setMaquina('Bambu Lab X1 Carbon')
    setData(hoje)
    setInicio('')
    setFim('')
    setAluno('')

    fecharModal()
  }

  function cancelarReserva(id) {
    if (window.confirm('Cancelar esta reserva?')) {
      setReservas((reservasAtuais) =>
        reservasAtuais.filter((reserva) => reserva.id !== id)
      )
    }
  }

  return (
    <div className="h-screen overflow-y-auto p-8 space-y-6 bg-slate-50 text-slate-800 font-sans antialiased">

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            AGENDA DO LABORATÓRIO
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Reservas de Equipamentos
          </h1>

          <p className="text-xs text-slate-500">
            Agendamentos do laboratório.
          </p>
        </div>

        <button
          type="button"
          ref={botaoAbrirRef}
          onClick={abrirModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Icone nome="mais" className="w-4 h-4" />
          Nova Reserva
        </button>
      </header>

      {/* Status rápido das máquinas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">
            Bambu Lab X1 Carbon
          </p>

          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">
            Livre
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">
            Ender 5 Plus
          </p>

          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-full text-[10px]">
            Em uso até 15h
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">
            Laser Cutter K40
          </p>

          <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-full text-[10px]">
            Manutenção
          </span>
        </div>

      </div>

      {/* Tabela de agendamentos */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">Agendamentos do laboratório</caption>

          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th scope="col" className="p-4">Horário</th>
              <th scope="col" className="p-4">Máquina</th>
              <th scope="col" className="p-4">Aluno</th>
              <th scope="col" className="p-4">Ação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {reservas.map((reserva) => (
              <tr
                key={reserva.id}
                data-maquina={reserva.maquina}
                data-data={reserva.data || hoje}
                data-inicio={reserva.inicio}
                data-fim={reserva.fim}
              >
                <td className="p-4 font-bold">
                  {reserva.inicio} - {reserva.fim}

                  {reserva.data && reserva.data !== hoje && (
                    <span className="block text-[10px] font-normal text-slate-500">
                      {formatarData(reserva.data)}
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {reserva.nomeMaquina}
                </td>

                <td className="p-4">
                  {reserva.aluno}
                </td>

                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => cancelarReserva(reserva.id)}
                    aria-label={`Cancelar reserva de ${reserva.nomeMaquina} das ${reserva.inicio} às ${reserva.fim}`}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Popup: nova reserva */}
      <div
        className={`${modalAberto ? 'flex' : 'hidden'} fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 items-center justify-center p-4`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalReserva"
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
        >

          {/* Cabeçalho do modal */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3
                id="tituloModalReserva"
                className="font-bold text-slate-900 text-sm"
              >
                Nova reserva
              </h3>

              <p className="text-[11px] text-slate-500">
                Escolha a máquina, a data e o horário.
              </p>
            </div>

            <button
              type="button"
              onClick={fecharModal}
              aria-label="Fechar"
              className="text-slate-500 hover:text-slate-700 text-sm font-bold p-2"
            >
              <Icone nome="fechar" className="w-4 h-4" />
            </button>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoMaquina"
                className="text-xs font-semibold text-slate-700"
              >
                Máquina
              </label>

              <select
                id="campoMaquina"
                ref={campoMaquinaRef}
                value={maquina}
                onChange={(event) => setMaquina(event.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Bambu Lab X1 Carbon">
                  Bambu Lab X1 Carbon
                </option>

                <option value="Ender 5 Plus">
                  Ender 5 Plus
                </option>

                <option value="Laser Cutter K40" disabled>
                  Laser Cutter K40 (em manutenção)
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoData"
                className="text-xs font-semibold text-slate-700"
              >
                Data
              </label>

              <input
                id="campoData"
                type="date"
                min={hoje}
                value={data}
                onChange={(event) => setData(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="campoInicio"
                  className="text-xs font-semibold text-slate-700"
                >
                  Início
                </label>

                <input
                  id="campoInicio"
                  type="time"
                  value={inicio}
                  onChange={(event) => setInicio(event.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="campoFim"
                  className="text-xs font-semibold text-slate-700"
                >
                  Fim
                </label>

                <input
                  id="campoFim"
                  type="time"
                  value={fim}
                  onChange={(event) => setFim(event.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoAluno"
                className="text-xs font-semibold text-slate-700"
              >
                Aluno
              </label>

              <input
                id="campoAluno"
                type="text"
                value={aluno}
                onChange={(event) => setAluno(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Aviso de conflito ou erro de horário */}
            <div role="alert" className="empty:hidden">
              {avisoConflito && (
                <p className="text-xs font-semibold text-rose-700 bg-rose-50 rounded-lg p-2">
                  {avisoConflito}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">

              <button
                type="button"
                onClick={fecharModal}
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
  )
}

export default Reservas