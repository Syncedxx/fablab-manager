import { useEffect, useRef, useState } from 'react'

const MATERIAIS_INICIAIS = [
  {
    id: 1,
    nome: 'PLA Branco 1.75mm',
    categoria: 'filamentos',
    categoriaNome: 'Filamentos',
    saldo: '120 g',
    status: 'Crítico'
  },
  {
    id: 2,
    nome: 'PLA Preto 1.75mm',
    categoria: 'filamentos',
    categoriaNome: 'Filamentos',
    saldo: '850 g',
    status: 'Disponível'
  },
  {
    id: 3,
    nome: 'Placa MDF 3mm',
    categoria: 'madeiras',
    categoriaNome: 'Madeiras',
    saldo: '2 un.',
    status: 'Crítico'
  },
  {
    id: 4,
    nome: 'Acrílico Transparente 3mm',
    categoria: 'acrilicos',
    categoriaNome: 'Acrílicos',
    saldo: '8 un.',
    status: 'Disponível'
  },
  {
    id: 5,
    nome: 'Parafuso M3x10',
    categoria: 'fixadores',
    categoriaNome: 'Fixadores',
    saldo: '450 un.',
    status: 'Disponível'
  }
]

const HISTORICO_INICIAL = [
  {
    id: 1,
    data: '10/11/2026',
    material: 'PLA Branco 1.75mm',
    tipo: 'Saída',
    quantidade: '380 g',
    origem: 'Projeto Braço Robótico'
  },
  {
    id: 2,
    data: '09/11/2026',
    material: 'Parafuso M3x10',
    tipo: 'Saída',
    quantidade: '50 un.',
    origem: 'Projeto Caixa Organizadora'
  },
  {
    id: 3,
    data: '06/11/2026',
    material: 'Acrílico Transparente 3mm',
    tipo: 'Entrada',
    quantidade: '10 un.',
    origem: 'Reposição do almoxarifado'
  },
  {
    id: 4,
    data: '05/11/2026',
    material: 'Placa MDF 3mm',
    tipo: 'Saída',
    quantidade: '4 un.',
    origem: 'Projeto Luminária'
  },
  {
    id: 5,
    data: '03/11/2026',
    material: 'PLA Preto 1.75mm',
    tipo: 'Entrada',
    quantidade: '1000 g',
    origem: 'Reposição do almoxarifado'
  }
]

// Remove acentos e transforma o texto em minúsculas.
function simplificarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function Inventario() {
  const [materiais] = useState(MATERIAIS_INICIAIS)
  const [busca, setBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')

  const [modalAberto, setModalAberto] = useState(false)

  const [materialSelecionado, setMaterialSelecionado] = useState(
    'PLA Branco 1.75mm'
  )
  const [quantidade, setQuantidade] = useState('1')
  const [projeto, setProjeto] = useState('')

  const [avisoPedido, setAvisoPedido] = useState('')

  // Guardam o botão que abre o popup e o primeiro campo dele.
  const botaoAbrirRef = useRef(null)
  const campoMaterialRef = useRef(null)

  // Esconde o aviso de solicitação depois de 6 segundos.
  useEffect(() => {
    if (!avisoPedido) return

    const temporizador = setTimeout(() => {
      setAvisoPedido('')
    }, 6000)

    return () => clearTimeout(temporizador)
  }, [avisoPedido])

  // Com o popup aberto: foca o primeiro campo e fecha com Esc.
  // Ao fechar, o foco volta para o botão que abriu.
  useEffect(() => {
    if (!modalAberto) return

    const botaoQueAbriu = botaoAbrirRef.current

    campoMaterialRef.current.focus()

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

  // Identifica os materiais com estoque crítico.
  const materiaisCriticos = materiais.filter(
    material => material.status === 'Crítico'
  )

  // Aplica os filtros de busca e categoria.
  const materiaisFiltrados = materiais.filter(material => {
    const textoMaterial = simplificarTexto(
      `${material.nome} ${material.categoriaNome} ${material.saldo} ${material.status}`
    )

    const textoBusca = simplificarTexto(busca)

    const buscaOk = textoMaterial.includes(textoBusca)

    const categoriaOk =
      categoriaSelecionada === '' ||
      material.categoria === categoriaSelecionada

    return buscaOk && categoriaOk
  })

  function abrirModal() {
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  // Registra a solicitação apenas visualmente, como no HTML original.
  function solicitarMaterial(event) {
    event.preventDefault()

    setAvisoPedido(
      `Solicitação enviada: ${quantidade} x ${materialSelecionado} para o projeto "${projeto}". Acompanhe em Requisições.`
    )

    setMaterialSelecionado('PLA Branco 1.75mm')
    setQuantidade('1')
    setProjeto('')

    fecharModal()
  }

  return (
    <>
      <div className="w-full min-h-screen bg-slate-50 text-slate-800 antialiased font-sans p-8 flex flex-col gap-6">

        {/* Cabeçalho */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              MATERIAIS E INSUMO
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Inventário
            </h1>

            <p className="text-xs text-slate-500">
              Consulte saldos e itens que precisam de atenção.
            </p>
          </div>

          <div>
            <button
              type="button"
              ref={botaoAbrirRef}
              onClick={abrirModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
            >
              + Solicitar material
            </button>
          </div>
        </header>

        {/* Aviso de solicitação registrada (a área fica sempre na tela para o leitor de tela anunciar) */}
        <div role="status" className="empty:hidden">
          {avisoPedido && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              {avisoPedido}
            </p>
          )}
        </div>

        {/* Aviso de estoque crítico */}
        {materiaisCriticos.length > 0 && (
          <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">
            Estoque crítico ({materiaisCriticos.length}):{' '}
            {materiaisCriticos.map(material => material.nome).join(', ')}.
          </p>
        )}

        {/* Busca e filtros */}
        <div id="conteudoInventarioPrincipal" className="flex gap-3">
          <input
            type="search"
            aria-label="Buscar material"
            placeholder="Buscar por nome do material..."
            value={busca}
            onChange={event => setBusca(event.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
          />

          <select
            aria-label="Filtrar por categoria"
            value={categoriaSelecionada}
            onChange={event => setCategoriaSelecionada(event.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todas as categorias</option>
            <option value="filamentos">Filamentos</option>
            <option value="madeiras">Madeiras</option>
            <option value="acrilicos">Acrílicos</option>
            <option value="fixadores">Fixadores</option>
          </select>
        </div>

        {/* Tabela de materiais */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <caption className="sr-only">Lista de materiais</caption>

            <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th scope="col" className="py-4 px-6">Material</th>
                <th scope="col" className="py-4 px-6 text-center">Categoria</th>
                <th scope="col" className="py-4 px-6 text-center">Saldo</th>
                <th scope="col" className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {materiaisFiltrados.map(material => (
                <tr
                  key={material.id}
                  className="hover:bg-slate-50/50"
                >
                  <td className="py-4 px-6 flex items-center gap-3 font-semibold text-slate-800">
                    <div
                      aria-hidden="true"
                      className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold"
                    >
                      #
                    </div>

                    <span>{material.nome}</span>
                  </td>

                  <td className="py-4 px-6 text-center text-slate-500">
                    {material.categoriaNome}
                  </td>

                  <td className="py-4 px-6 text-center font-bold text-slate-800">
                    {material.saldo}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span
                      className={
                        material.status === 'Crítico'
                          ? 'inline-block px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 rounded-full'
                          : 'inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full'
                      }
                    >
                      {material.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Histórico de movimentações */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-bold text-slate-900">
              Histórico de movimentações
            </h2>

            <p className="text-xs text-slate-500">
              Últimas entradas e saídas de material.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <caption className="sr-only">
                Histórico de movimentações de material
              </caption>

              <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-4 px-6">Data</th>
                  <th scope="col" className="py-4 px-6">Material</th>
                  <th scope="col" className="py-4 px-6 text-center">Tipo</th>
                  <th scope="col" className="py-4 px-6 text-center">Quantidade</th>
                  <th scope="col" className="py-4 px-6 text-right">Projeto / Origem</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {HISTORICO_INICIAL.map(movimentacao => (
                  <tr
                    key={movimentacao.id}
                    className="hover:bg-slate-50/50"
                  >
                    <td className="py-4 px-6 text-slate-500">
                      {movimentacao.data}
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {movimentacao.material}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={
                          movimentacao.tipo === 'Saída'
                            ? 'inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full'
                            : 'inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full'
                        }
                      >
                        {movimentacao.tipo}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center font-bold text-slate-800">
                      {movimentacao.quantidade}
                    </td>

                    <td className="py-4 px-6 text-right text-slate-500">
                      {movimentacao.origem}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Popup: solicitar material */}
      <div
        className={`${
          modalAberto ? 'flex' : 'hidden'
        } fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 items-center justify-center p-4`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalSolicitar"
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
        >

          {/* Cabeçalho do popup */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3
                id="tituloModalSolicitar"
                className="font-bold text-slate-900 text-sm"
              >
                Solicitar material
              </h3>

              <p className="text-[11px] text-slate-500">
                Escolha o material, a quantidade e o projeto.
              </p>
            </div>

            <button
              type="button"
              onClick={fecharModal}
              aria-label="Fechar"
              className="text-slate-500 hover:text-slate-700 text-sm font-bold p-2"
            >
              ✕
            </button>
          </div>

          {/* Formulário */}
          <form
            onSubmit={solicitarMaterial}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoMaterial"
                className="text-xs font-semibold text-slate-700"
              >
                Material
              </label>

              <select
                id="campoMaterial"
                ref={campoMaterialRef}
                value={materialSelecionado}
                onChange={event =>
                  setMaterialSelecionado(event.target.value)
                }
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option>PLA Branco 1.75mm</option>
                <option>PLA Preto 1.75mm</option>
                <option>Placa MDF 3mm</option>
                <option>Acrílico Transparente 3mm</option>
                <option>Parafuso M3x10</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoQuantidade"
                className="text-xs font-semibold text-slate-700"
              >
                Quantidade
              </label>

              <input
                id="campoQuantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={event => setQuantidade(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoProjeto"
                className="text-xs font-semibold text-slate-700"
              >
                Projeto
              </label>

              <input
                id="campoProjeto"
                type="text"
                value={projeto}
                onChange={event => setProjeto(event.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
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
                Solicitar
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default Inventario