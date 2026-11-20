import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import { PerfilProvider, usePerfil } from './perfilcontext.jsx'
import Sidebar from './sidebar.jsx'
import Login from './pages/login.jsx'
import Cadastro from './pages/cadastro.jsx'
import DashboardAluno from './pages/dashboard-aluno.jsx'
import DashboardInstrutor from './pages/dashboard-instrutor.jsx'
import DashboardAdministrador from './pages/dashboard-administrador.jsx'
import RecuperacaoSenha from './pages/recuperacao-senha.jsx'
import Equipamentos from './pages/equipamentos.jsx'
import Inventario from './pages/inventario.jsx'
import Reservas from './pages/reservas.jsx'
import Pedidos from './pages/pedidos.jsx'
import Notificacoes from './pages/notificacoes.jsx'
import Usuarios from './pages/usuarios.jsx'
import AcessoNegado from './pages/403.jsx'
import Privacidade from './pages/privacidade.jsx'

const RESTRITO = {
  '/pedidos': ['instrutor', 'administrador'],
  '/usuarios': ['administrador'],
  '/dashboard-aluno': ['aluno'],
  '/dashboard-instrutor': ['instrutor'],
  '/dashboard-administrador': ['administrador']
}

function RotaProtegida() {
  const { perfil } = usePerfil()
  const location = useLocation()

  if (!perfil) {
    return <Navigate to="/login" replace />
  }

  const permitidos = RESTRITO[location.pathname]

  if (permitidos && !permitidos.includes(perfil)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}

function Layout() {
  // No PC começa aberto; no celular começa fechado
  const [menuAberto, setMenuAberto] = useState(() => window.innerWidth >= 1024)

  // No celular, fecha o menu depois de escolher uma página
  function aoNavegar() {
    if (window.innerWidth < 1024) {
      setMenuAberto(false)
    }
  }

  // Pula o menu e leva o foco direto para o conteúdo da página
  function pularParaConteudo(event) {
    event.preventDefault()
    document.getElementById('conteudo-principal').focus()
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Link para pular o menu (só aparece ao receber foco pelo teclado) */}
      <a
        href="#conteudo-principal"
        onClick={pularParaConteudo}
        className="fixed top-2 left-2 z-50 -translate-y-24 focus:translate-y-0 bg-white text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <Sidebar
        aberto={menuAberto}
        aoNavegar={aoNavegar}
        aoFechar={() => setMenuAberto(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">

        {/* Barra do topo com o botão do menu */}
        <header className="sticky top-0 z-20 h-12 shrink-0 flex items-center gap-3 px-4 bg-[#0d1527] border-b border-slate-800">
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir ou fechar menu"
            aria-expanded={menuAberto}
            aria-controls="menu-lateral"
            className="p-2 -m-2 text-white text-xl leading-none cursor-pointer"
          >
            ☰
          </button>

          <span className="text-sm font-semibold text-white">
            FabLab Manager
          </span>
        </header>

        <main id="conteudo-principal" tabIndex={-1} className="flex-1 outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <PerfilProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/403" element={<AcessoNegado />} />
          <Route path="/recuperacao-senha" element={<RecuperacaoSenha />} />
          <Route path="/privacidade" element={<Privacidade />} />

          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/dashboard-aluno" element={<DashboardAluno />} />
              <Route path="/dashboard-instrutor" element={<DashboardInstrutor />} />
              <Route path="/dashboard-administrador" element={<DashboardAdministrador />} />

              <Route path="/inventario" element={<Inventario />} />
              <Route path="/equipamentos" element={<Equipamentos />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/notificacoes" element={<Notificacoes />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </PerfilProvider>
  )
}

export default App