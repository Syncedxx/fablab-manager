import { useState } from 'react'
import { usePerfil } from '../perfilcontext.jsx'

const CATEGORIAS = {
  impressoras: 'Impressoras 3D',
  laser: 'Corte a laser',
  eletronica: 'Eletrônica'
}

const EQUIPAMENTOS_INICIAIS = [
  {
    id: 1,
    nome: 'Bambu Lab X1 Carbon',
    categoria: 'impressoras',
    limite: 4,
    status: 'Livre'
  },
  {
    id: 2,
    nome: 'Ender 5 Plus',
    categoria: 'impressoras',
    limite: 4,
    status: 'Em uso até 15h'
  },
  {
    id: 3,
    nome: 'Laser Cutter K40',
    categoria: 'laser',
    limite: 2,
    status: 'Manutenção'
  },
  {
    id: 4,
    nome: 'Estação de Solda',
    categoria: 'eletronica',
    limite: 3,
    status: 'Livre'
  }
]

function classeStatus(status) {
  if (status === 'Livre') {
    return 'text-emerald-600 bg-emerald-50'
  }

  if (status === 'Manutenção') {
    return 'text-rose-500 bg-rose-50'
  }

  return 'text-amber-600 bg-amber-50'
}

export default function Equipamentos() {
  const { perfil } = usePerfil()

  const [equipamentos, setEquipamentos] = useState(EQUIPAMENTOS_INICIAIS)

  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')

  const [modalAberto, setModalAberto] = useState(false)

  const [novoNome, setNovoNome] = useState('')
  const [novaCategoria, setNovaCategoria] = useState('impressoras')
  const [novoLimite, setNovoLimite] = useState('4')
  const [novoStatus, setNovoStatus] = useState('Livre')

  const [proximoId, setProximoId] = useState(5)

  const podeCadastrar =
    perfil === 'instrutor' || perfil === 'administrador'

  const equipamentosFiltrados = equipamentos.filter((equipamento) => {
    const textoBusca = busca.toLowerCase()

    const textoEquipamento = `
      ${equipamento.nome}
      ${CATEGORIAS[equipamento.categoria]}
      ${equipamento.limite}
      ${equipamento.status}
    `.toLowerCase()

    const correspondeBusca = textoEquipamento.includes(textoBusca)

    const correspondeCategoria =
      categoriaSelecionada === '' ||
      equipamento.categoria === categoriaSelecionada

    return correspondeBusca && correspondeCategoria
  })

  function cadastrarEquipamento(event) {
    event.preventDefault()

    const nome = novoNome.trim()

    if (!nome) return

    const equipamento = {
      id: proximoId,
      nome,
      categoria: novaCategoria,
      limite: Number(novoLimite),
      status: novoStatus
    }

    setEquipamentos((listaAtual) => [
      ...listaAtual,
      equipamento
    ])

    setProximoId((idAtual) => idAtual + 1)

    setNovoNome('')
    setNovaCategoria('impressoras')
    setNovoLimite('4')
    setNovoStatus('Livre')

    setModalAberto(false)
  }

  return (
    <div
      id="painelDireita"
      className="flex-1 min-h-screen p-8 flex flex-col gap-6 bg-slate-50 text-slate-800 antialiased font-sans"
    >

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            MÁQUINAS DO LABORATÓRIO
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            Equipamentos
          </h2>

          <p className="text-xs text-slate-500">
            Consulte a disponibilidade das máquinas.
          </p>
        </div>

        {podeCadastrar && (
          <div>
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
            >
              + Cadastrar equipamento
            </button>
          </div>
        )}
      </header>

      {/* Busca e filtro */}
      <div
        id="conteudoEquipamentosPrincipal"
        className="flex gap-3"
      >
        <input
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome do equipamento..."
          className="flex-1 min-w-0 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500"
        />

        <select
          value={categoriaSelecionada}
          onChange={(event) => setCategoriaSelecionada(event.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">Todas as categorias</option>
          <option value="impressoras">Impressoras 3D</option>
          <option value="laser">Corte a laser</option>
          <option value="eletronica">Eletrônica</option>
        </select>
      </div>

      {/* Tabela de Equipamentos */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Equipamento</th>

                <th className="py-4 px-6 text-center">
                  Categoria
                </th>

                <th className="py-4 px-6 text-center">
                  Limite por dia
                </th>

                <th className="py-4 px-6 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody
              id="listaEquipamentos"
              className="divide-y divide-slate-100"
            >
              {equipamentosFiltrados.map((equipamento) => (
                <tr
                  key={equipamento.id}
                  className="linha hover:bg-slate-50/50"
                >
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                        #
                      </div>

                      <span>{equipamento.nome}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center text-slate-400">
                    {CATEGORIAS[equipamento.categoria]}
                  </td>

                  <td className="py-4 px-6 text-center font-bold text-slate-800">
                    {equipamento.limite} h
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${classeStatus(equipamento.status)}`}
                    >
                      {equipamento.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup: cadastrar equipamento */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 items-center justify-center p-4 ${
          modalAberto ? 'flex' : 'hidden'
        }`}
      >
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4">

          {/* Cabeçalho */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Cadastrar equipamento
              </h3>

              <p className="text-[11px] text-slate-400">
                Informe os dados da máquina.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          {/* Formulário */}
          <form
            onSubmit={cadastrarEquipamento}
            className="flex flex-col gap-3"
          >

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoNome"
                className="text-xs font-semibold text-slate-700"
              >
                Nome
              </label>

              <input
                id="campoNome"
                type="text"
                value={novoNome}
                onChange={(event) => setNovoNome(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="campoCategoria"
                  className="text-xs font-semibold text-slate-700"
                >
                  Categoria
                </label>

                <select
                  id="campoCategoria"
                  value={novaCategoria}
                  onChange={(event) => setNovaCategoria(event.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="impressoras">Impressoras 3D</option>
                  <option value="laser">Corte a laser</option>
                  <option value="eletronica">Eletrônica</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="campoLimite"
                  className="text-xs font-semibold text-slate-700"
                >
                  Limite por dia (h)
                </label>

                <input
                  id="campoLimite"
                  type="number"
                  min="1"
                  max="12"
                  value={novoLimite}
                  onChange={(event) => setNovoLimite(event.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoStatus"
                className="text-xs font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="campoStatus"
                value={novoStatus}
                onChange={(event) => setNovoStatus(event.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Livre">Livre</option>
                <option value="Manutenção">Manutenção</option>
              </select>
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
                Cadastrar
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  )
}