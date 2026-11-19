import { NavLink } from 'react-router-dom'
import { usePerfil } from './perfilcontext.jsx'

const PERFIS = {
  aluno: 'Aluno(a) - TDS 2026',
  instrutor: 'Professor(a) - TDS 2026',
  administrador: 'Administrador(a)'
}

export default function Sidebar() {
  const { perfil, sair } = usePerfil()

  const itens = [
    ['📊', 'Visão Geral', `/dashboard-${perfil}`],
    ['📦', 'Inventário', '/inventario'],
    ['🛠️', 'Equipamentos', '/equipamentos'],
    ['📅', 'Reservas', '/reservas']
  ]

  if (perfil !== 'aluno') {
    itens.push(['📄', 'Requisições', '/pedidos'])
  }

  itens.push(['🔔', 'Notificações', '/notificacoes'])

  if (perfil === 'administrador') {
    itens.push(['👥', 'Usuários', '/usuarios'])
  }

  const base =
    'flex items-center gap-3 px-3 py-2 text-xs transition-all'

  return (
    <aside className="w-64 h-screen sticky top-0 shrink-0 bg-[#0d1527] text-white p-6 flex flex-col gap-6 overflow-y-auto">
      
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold leading-tight text-white">
          FabLab Manager
        </h2>

        <p className="text-[10px] text-blue-300 font-semibold tracking-wider uppercase">
          SENAI — SISTEMA DE GESTÃO
        </p>
      </div>

      <hr className="border-slate-800 -mx-6" />

      <nav className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          MENU
        </p>

        {itens.map(([icone, nome, caminho]) => (
          <NavLink
            key={caminho}
            to={caminho}
            className={({ isActive }) =>
              `${base} ${
                isActive
                  ? 'text-white bg-slate-800/80 border-l-4 border-blue-500 rounded-r-lg font-semibold'
                  : 'text-slate-400 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            <span>{icone}</span>
            {nome}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto bg-[#172339] border border-slate-800 rounded-2xl p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
        
        <div className="w-10 h-10 rounded-full bg-blue-200 text-slate-900 text-sm font-bold flex items-center justify-center shrink-0">
          EX
        </div>

        <div className="flex flex-col min-w-0">
          <strong className="text-sm font-semibold text-white truncate">
            Nome Exemplo
          </strong>

          <small className="text-xs text-slate-400 truncate">
            {PERFIS[perfil]}
          </small>
        </div>

        <button
          onClick={sair}
          className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors pt-1"
        >
          <span>🚪</span>
          Sair da conta
        </button>

      </div>
    </aside>
  )
}