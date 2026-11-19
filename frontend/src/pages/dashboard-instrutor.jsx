
import { Link } from 'react-router-dom'

function DashboardInstrutor() {
  const pedidosPrioritarios = [
    {
      material: 'PLA Branco 1 kg',
      codigo: 'REQ-012',
      aluno: 'João Pedro · Projeto integrador'
    },
    {
      material: 'Placa MDF 3 mm · 5 un.',
      codigo: 'REQ-013',
      aluno: 'Higor Cardoso · Protótipo de mobiliário'
    }
  ]

  const acoesGestao = [
    {
      icone: '📋',
      titulo: 'Analisar pedidos',
      descricao: '2 aguardando decisão',
      destino: '/pedidos'
    },
    {
      icone: '📅',
      titulo: 'Gerenciar agenda',
      descricao: 'Veja todas as reservas',
      destino: '/reservas'
    },
    {
      icone: '📦',
      titulo: 'Ver estoque crítico',
      descricao: '3 itens precisam de atenção',
      destino: '/inventario?filtro=critico'
    }
  ]

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 text-slate-800 antialiased p-8 flex flex-col gap-6">

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            VISÃO GERAL
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            Bem-vindo ao Dashboard do Instrutor
          </h2>

          <p className="text-sm text-slate-600">
            Aqui você pode gerenciar o inventário, reservas e requisições do FabLab.
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
          CR
        </div>
      </header>

      {/* Banner principal */}
      <div className="bg-[#1b437c] text-white p-6 rounded-2xl flex justify-between items-center gap-4 shadow-xs">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-white">
            Central de operação
          </h3>

          <p className="text-xs text-blue-100">
            Existem pedidos para analisar e 3 materiais em nível crítico. As máquinas estão operando sem conflitos de agenda.
          </p>
        </div>

        <Link
          to="/pedidos"
          className="bg-[#60a5fa] hover:bg-[#3b82f6] text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          Analisar pedidos <span>&gt;</span>
        </Link>
      </div>

      {/* Cards de resumo */}
      <div id="cardsResumo" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Link
          to="/pedidos"
          id="pedidoAnalise"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition group"
        >
          <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <span className="text-sm">📋</span>
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              2
            </span>

            <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
              Aguardando análise
            </h3>

            <p className="text-[11px] text-slate-400">
              Pedidos de materiais
            </p>
          </div>
        </Link>

        <Link
          to="/reservas"
          id="reservaHoje"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition group"
        >
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <span className="text-sm">📅</span>
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              12
            </span>

            <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
              Reservas hoje
            </h3>

            <p className="text-[11px] text-slate-400">
              3 em andamento
            </p>
          </div>
        </Link>

        <div
          id="alunosAtivos"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <span className="text-sm">👤</span>
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              28
            </span>

            <h3 className="text-xs font-bold text-slate-800">
              Alunos ativos
            </h3>

            <p className="text-[11px] text-slate-400">
              Em 6 projetos
            </p>
          </div>
        </div>

        <Link
          to="/inventario?filtro=critico"
          id="itensCriticos"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-rose-300 transition group"
        >
          <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <span className="text-sm">⚠️</span>
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              3
            </span>

            <h3 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition">
              Itens críticos
            </h3>

            <p className="text-[11px] text-slate-400">
              Precisam de reposição
            </p>
          </div>
        </Link>

      </div>

      {/* Seção superior */}
      <div id="secaoSuperior" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pedidos prioritários */}
        <div
          id="cardPedidosPrioritarios"
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div id="headerPedidosPrioritarios" className="flex items-center justify-between">
            <div id="titulosPedidosPrioritarios">
              <h3 id="tituloPedidos" className="text-base font-bold text-slate-900">
                Pedidos prioritários
              </h3>

              <p id="subtituloPedidos" className="text-xs text-slate-400">
                Solicitações que precisam de decisão
              </p>
            </div>

            <Link
              to="/pedidos"
              id="linkVerTodosPedidos"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div id="listaPedidosPrioritarios" className="space-y-3">
            {pedidosPrioritarios.map((pedido) => (
              <div
                key={pedido.codigo}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <span>📋</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-semibold text-slate-800">
                        {pedido.material}
                      </strong>

                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {pedido.codigo}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {pedido.aluno}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/pedidos?id=${pedido.codigo}`}
                  className="px-4 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition cursor-pointer"
                >
                  Revisar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Agora no laboratório */}
        <div
          id="cardAgoraNoLaboratorio"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div id="headerLaboratorio">
            <h3 id="tituloLaboratorio" className="text-base font-bold text-slate-900">
              Agora no laboratório
            </h3>

            <p id="subtituloLaboratorio" className="text-xs text-slate-400">
              Ocupação em tempo real
            </p>
          </div>

          <div id="painelStatusLaboratorio" className="space-y-2">
            <div
              id="linhaMaquinasEmUso"
              className="bg-slate-50 p-3 rounded-xl flex items-center justify-between"
            >
              <span id="labelMaquinasEmUso" className="text-xs font-medium text-slate-600">
                Máquinas em uso
              </span>

              <span id="valorMaquinasEmUso" className="text-base font-bold text-slate-900">
                3/7
              </span>
            </div>

            <div
              id="linhaProximaLiberacao"
              className="bg-slate-50 p-3 rounded-xl flex items-center justify-between"
            >
              <span id="labelProximaLiberacao" className="text-xs font-medium text-slate-600">
                Próxima liberação
              </span>

              <span id="valorProximaLiberacao" className="text-xs font-bold text-slate-800">
                Ender 5 - 15:00
              </span>
            </div>
          </div>

          <Link
            to="/reservas"
            id="btnAbrirAgendaCompleta"
            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-blue-600 hover:bg-slate-50 transition"
          >
            <span>Abrir agenda completa</span>
            <span id="iconeSetaAgenda">&gt;</span>
          </Link>
        </div>

      </div>

      {/* Ações de gestão */}
      <div
        id="cardAcoesGestao"
        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 mb-4"
      >
        <div id="headerAcoesGestao">
          <h3 id="tituloAcoesGestao" className="text-base font-bold text-slate-900">
            Ações de gestão
          </h3>

          <p id="subtituloAcoesGestao" className="text-xs text-slate-400">
            Atalhos para a rotina do instrutor
          </p>
        </div>

        <div id="gridAtalhosGestao" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {acoesGestao.map((acao) => (
            <Link
              key={acao.titulo}
              to={acao.destino}
              className="bg-slate-50 p-4 rounded-xl flex items-center justify-between hover:bg-slate-100 transition group border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <span>{acao.icone}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {acao.titulo}
                  </h4>

                  <p className="text-[10px] text-slate-400">
                    {acao.descricao}
                  </p>
                </div>
              </div>

              <span className="text-slate-300 group-hover:text-blue-600 text-xs transition">
                &gt;
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DashboardInstrutor
