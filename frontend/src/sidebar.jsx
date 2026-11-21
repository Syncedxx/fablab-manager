import { NavLink } from 'react-router-dom'
import { usePerfil } from './perfilcontext.jsx'
import { Icone } from './icones.jsx'

const PERFIS = {
  aluno: 'Aluno(a) - TDS 2026',
  instrutor: 'Professor(a) - TDS 2026',
  administrador: 'Administrador(a)'
}

// aberto: se o menu está aberto | aoNavegar: roda ao clicar num item | aoFechar: fecha o menu
export default function Sidebar({ aberto, aoNavegar, aoFechar }) {
  const { perfil, sair } = usePerfil()

  const itens = [
    ['grafico', 'Visão Geral', `/dashboard-${perfil}`],
    ['pacote', 'Inventário', '/inventario'],
    ['ferramenta', 'Equipamentos', '/equipamentos'],
    ['calendario', 'Reservas', '/reservas']
  ]

  if (perfil !== 'aluno') {
    itens.push(['documento', 'Requisições', '/pedidos'])
  }

  itens.push(['sino', 'Notificações', '/notificacoes'])

  if (perfil === 'administrador') {
    itens.push(['usuarios', 'Usuários', '/usuarios'])
  }

  const base =
    'flex items-center gap-3 px-3 py-2 text-xs transition-all'

  return (
    <>
      {/* Fundo escuro (só no celular): clicar fecha o menu */}
      {aberto && (
        <div
          aria-hidden="true"
          onClick={aoFechar}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Celular: abre por cima da página | PC: desliza e empurra o conteúdo */}
      <aside
        id="menu-lateral"
        inert={!aberto}
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 h-dvh shrink-0 bg-[#0d1527] text-white p-6 flex flex-col gap-6 overflow-y-auto transition-transform duration-300 lg:transition-[margin] lg:sticky lg:bottom-auto lg:left-auto lg:z-auto lg:translate-x-0 ${
          aberto ? 'translate-x-0 lg:ml-0' : '-translate-x-full lg:-ml-64'
        }`}
      >

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold leading-tight text-white">
              FabLab Manager
            </p>

            <p className="text-[10px] text-blue-300 font-semibold tracking-wider uppercase">
              SENAI — SISTEMA DE GESTÃO
            </p>
          </div>

          {/* Botão fechar */}
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar menu"
            className="p-2 -m-2 text-slate-400 hover:text-white leading-none cursor-pointer"
          >
            <Icone nome="fechar" className="w-5 h-5" />
          </button>
        </div>

        <hr className="border-slate-800 -mx-6" />

        <nav aria-label="Menu principal" className="flex flex-col gap-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            MENU
          </p>

          {itens.map(([icone, nome, caminho]) => (
            <NavLink
              key={caminho}
              to={caminho}
              onClick={aoNavegar}
              className={({ isActive }) =>
                `${base} ${
                  isActive
                    ? 'text-white bg-slate-800/80 border-l-4 border-blue-500 rounded-r-lg font-semibold'
                    : 'text-slate-400 rounded-lg font-medium hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icone nome={icone} className="w-4 h-4" />
              {nome}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto bg-[#172339] border border-slate-800 rounded-2xl p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">

          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-blue-200 text-slate-900 text-sm font-bold flex items-center justify-center shrink-0"
          >
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
            type="button"
            onClick={sair}
            className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1.5"
          >
            <Icone nome="sair" className="w-4 h-4" />
            Sair da conta
          </button>

        </div>
      </aside>
    </>
  )
}