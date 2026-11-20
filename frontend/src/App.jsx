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
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1">
        <Outlet />
      </main>
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