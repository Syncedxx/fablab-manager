import { Link } from 'react-router-dom'
import { Icone } from '../icones.jsx'

function DashboardAdministrador() {
  const atividades = [
    {
      icone: 'prancheta',
      estilo: 'bg-slate-50 text-slate-500 border-slate-100',
      descricao: 'Carla Menezes aprovou REQ-014',
      tempo: 'Há 8 min'
    },
    {
      icone: 'alerta',
      estilo: 'bg-rose-50 text-rose-500 border-rose-100',
      descricao: 'Saldo de PLA Branco atingiu nível crítico',
      tempo: 'Há 24 min'
    },
    {
      icone: 'usuario',
      estilo: 'bg-slate-50 text-slate-500 border-slate-100',
      descricao: 'Novo aluno vinculado à turma TDS 2026',
      tempo: 'Há 1 h'
    },
    {
      icone: 'check',
      estilo: 'bg-emerald-50 text-emerald-500 border-emerald-100',
      descricao: 'Reserva R-004 concluída sem ocorrência',
      tempo: 'Há 2 h'
    }
  ]

  const modulos = [
    {
      icone: 'pacote',
      titulo: 'Inventário e alertas',
      descricao: 'Saldos e materiais críticos',
      destino: '/inventario'
    },
    {
      icone: 'calendario',
      titulo: 'Agenda de equipamentos',
      descricao: 'Reservas de todos os usuários',
      destino: '/reservas'
    },
    {
      icone: 'prancheta',
      titulo: 'Requisições',
      descricao: 'Audite pedidos e aprovações',
      destino: '/pedidos'
    }
  ]

  return (
    <div className="h-screen overflow-y-auto p-8 flex flex-col gap-6 bg-slate-50 text-slate-800 antialiased font-sans">

      {/* Header principal */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            ADMINISTRAÇÃO DO SISTEMA
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Visão administrativa
          </h1>

          <p className="text-sm text-slate-600">
            Gerencie acessos, monitore a operação e acompanhe a integridade da plataforma.
          </p>
        </div>

        {/* Avatar do usuário */}
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm"
        >
          AS
        </div>
      </header>

      {/* Banner principal */}
      <div className="bg-[#1b437c] text-white p-6 rounded-2xl flex justify-between items-center gap-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-200 w-fit">
            <Icone nome="escudo" className="w-4 h-4" />
            Ambiente protegido e operacional
          </span>

          <h2 className="text-xl font-bold text-white">
            Controle geral do FabLab
          </h2>

          <p className="text-xs text-blue-100">
            Todos os serviços estão disponíveis. Há 4 alertas operacionais que merecem acompanhamento.
          </p>
        </div>

        <Link
          to="/notificacoes"
          className="bg-[#60a5fa] hover:bg-[#3b82f6] text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          Ver alertas <span aria-hidden="true">&gt;</span>
        </Link>
      </div>

      {/* Minicards resumo */}
      <div id="cardsResumo" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Usuários ativos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <Icone nome="usuario" className="w-4 h-4" />
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              86
            </span>

            <h2 className="text-xs font-bold text-slate-800">
              Usuários ativos
            </h2>

            <p className="text-[11px] text-slate-500">
              74 alunos - 12 instrutores
            </p>
          </div>
        </div>

        {/* Equipamentos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <Icone nome="impressora" className="w-4 h-4" />
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              7
            </span>

            <h2 className="text-xs font-bold text-slate-800">
              Equipamentos
            </h2>

            <p className="text-[11px] text-slate-500">
              6 operacionais
            </p>
          </div>
        </div>

        {/* Alertas ativos */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between">
          <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <Icone nome="alerta" className="w-4 h-4" />
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              4
            </span>

            <h2 className="text-xs font-bold text-slate-800">
              Alertas ativos
            </h2>

            <p className="text-[11px] text-slate-500">
              3 estoque - 1 manutenção
            </p>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 mb-3">
            <Icone nome="tendencia" className="w-4 h-4" />
          </div>

          <div>
            <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">
              99,9%
            </span>

            <h2 className="text-xs font-bold text-slate-800">
              Disponibilidade
            </h2>

            <p className="text-[11px] text-slate-500">
              Últimos 30 dias
            </p>
          </div>
        </div>

      </div>

      {/* Seção intermediária */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">

        {/* Atividade recente */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Atividade recente
              </h2>

              <p className="text-xs text-slate-500">
                Eventos relevantes registrados no sistema
              </p>
            </div>

            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
              <span aria-hidden="true" className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Ao vivo
            </span>
          </div>

          <div className="space-y-4 mt-2">
            {atividades.map((atividade, indice) => (
              <div
                key={indice}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${atividade.estilo}`}>
                    <Icone nome={atividade.icone} className="w-4 h-4" />
                  </div>

                  <span className="text-xs font-medium text-slate-700">
                    {atividade.descricao}
                  </span>
                </div>

                <span className="text-[11px] text-slate-500">
                  {atividade.tempo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Perfis e acessos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Perfis e acessos
            </h2>

            <p className="text-xs text-slate-500">
              Distribuição dos usuários ativos
            </p>
          </div>

          <div className="space-y-4 mt-2">

            {/* Alunos */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Alunos
                </span>

                <span className="text-xs font-bold text-slate-900">
                  74
                </span>
              </div>

              <div aria-hidden="true" className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: '86%' }}
                ></div>
              </div>
            </div>

            {/* Instrutores */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Instrutores
                </span>

                <span className="text-xs font-bold text-slate-900">
                  11
                </span>
              </div>

              <div aria-hidden="true" className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-400 h-1.5 rounded-full"
                  style={{ width: '15%' }}
                ></div>
              </div>
            </div>

            {/* Administradores */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Administradores
                </span>

                <span className="text-xs font-bold text-slate-900">
                  1
                </span>
              </div>

              <div aria-hidden="true" className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-slate-800 h-1.5 rounded-full"
                  style={{ width: '2%' }}
                ></div>
              </div>
            </div>

          </div>

          {/* Box de informação */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-4 text-[11px] text-blue-800">
            O controle de usuários é demonstrativo nesta versão. Em produção, novos administradores exigem autorização institucional.
          </div>
        </div>

      </div>

      {/* Gestão dos módulos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 mb-4">

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Gestão dos módulos
          </h2>

          <p className="text-xs text-slate-500">
            Acesso rápido às áreas administrativas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modulos.map((modulo) => (
            <Link
              key={modulo.titulo}
              to={modulo.destino}
              className="p-4 rounded-xl flex items-center gap-3 hover:bg-slate-50 transition border border-slate-100 group"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Icone nome={modulo.icone} className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {modulo.titulo}
                </h3>

                <p className="text-[10px] text-slate-500">
                  {modulo.descricao}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="text-slate-300 group-hover:text-blue-600 text-xs transition"
              >
                &gt;
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DashboardAdministrador