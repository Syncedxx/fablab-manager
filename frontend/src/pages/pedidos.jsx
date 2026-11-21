import { useState } from 'react'

const pedidosIniciais = [
  {
    id: 1,
    codigo: 'REQ-012',
    material: 'PLA Branco 1kg',
    aluno: 'João Pedro',
    finalidade: 'Projeto integrador',
    status: 'Aguardando'
  },
  {
    id: 2,
    codigo: 'REQ-013',
    material: 'Placa MDF 3mm · 5 un.',
    aluno: 'Higor Cardoso',
    finalidade: 'Protótipo de mobiliário',
    status: 'Aguardando'
  },
  {
    id: 3,
    codigo: 'REQ-014',
    material: 'PETG Transparente 500g',
    aluno: 'Ruan Araújo',
    finalidade: 'Case para eletrônica',
    status: 'Aguardando'
  },
  {
    id: 4,
    codigo: 'REQ-015',
    material: 'Parafuso M3 · 100 un.',
    aluno: 'Richard Henrique',
    finalidade: 'Montagem mecânica',
    status: 'Aguardando'
  }
]

function Pedidos() {
  const [pedidos, setPedidos] = useState(pedidosIniciais)

  function atualizarPedido(id, acao) {
    const pedido = pedidos.find((item) => item.id === id)

    if (!pedido) return

    const aprovando = acao === 'aprovar'

    const confirmou = window.confirm(
      `${aprovando ? 'Aprovar' : 'Recusar'} o pedido ${pedido.codigo}?`
    )

    if (!confirmou) return

    setPedidos((pedidosAtuais) =>
      pedidosAtuais.map((item) =>
        item.id === id
          ? {
              ...item,
              status: aprovando ? 'Aprovado' : 'Recusado'
            }
          : item
      )
    )
  }

  function obterEstiloStatus(status) {
    if (status === 'Aprovado') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
    }

    if (status === 'Recusado') {
      return 'bg-rose-50 text-rose-700 border-rose-200/60'
    }

    return 'bg-amber-50 text-amber-700 border-amber-200/60'
  }

  return (
    <div className="h-screen overflow-y-auto p-8 flex flex-col gap-6 bg-slate-50 text-slate-800 antialiased font-sans">

      {/* Header Principal */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            FLUXO DE MATERIAIS
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Pedidos para análise
          </h1>

          <p className="text-sm text-slate-600">
            Aprove ou recuse solicitações dos alunos.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="size-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center"
        >
          CR
        </div>
      </header>

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >

            {/* Informações do pedido */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">

                <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {pedido.material}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {pedido.aluno} · {pedido.codigo}
                  </p>
                </div>

              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold border ${obterEstiloStatus(pedido.status)}`}
              >
                {pedido.status}
              </span>
            </div>

            {/* Finalidade */}
            <div className="bg-slate-50/80 rounded-xl p-3 text-xs text-slate-500">
              <strong className="font-bold text-slate-800">
                Finalidade:
              </strong>{' '}
              {pedido.finalidade}
            </div>

            {/* Ações ou resultado */}
            {pedido.status === 'Aguardando' ? (
              <div className="grid grid-cols-2 gap-3 pt-1">

                <button
                  type="button"
                  onClick={() => atualizarPedido(pedido.id, 'recusar')}
                  aria-label={`Recusar pedido ${pedido.codigo}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                >
                  Recusar
                </button>

                <button
                  type="button"
                  onClick={() => atualizarPedido(pedido.id, 'aprovar')}
                  aria-label={`Aprovar pedido ${pedido.codigo}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Aprovar pedido
                </button>

              </div>
            ) : (
              <div className="bg-slate-50/80 rounded-xl p-3 text-xs text-slate-500">
                {pedido.status === 'Aprovado'
                  ? 'Pedido aprovado. A baixa no estoque é registrada após a entrega.'
                  : 'Pedido recusado.'}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}

export default Pedidos