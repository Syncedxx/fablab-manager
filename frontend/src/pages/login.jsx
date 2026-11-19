
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePerfil } from '../perfilcontext.jsx'

export default function Login() {
  const [perfilSelecionado, setPerfilSelecionado] = useState('aluno')

  const { entrar } = usePerfil()
  const navigate = useNavigate()

  function entrarComo(perfil) {
    entrar(perfil)
    navigate(`/dashboard-${perfil}`)
  }

  function entrarNoSistema(ev) {
    ev.preventDefault()

    const perfis = {
      aluno: 'aluno',
      professor: 'instrutor',
      admin: 'administrador'
    }

    entrarComo(perfis[perfilSelecionado])
  }

  return (
    <main className="min-h-screen bg-slate-100 font-sans antialiased">
      <div id="geral" className="flex min-h-screen">

        {/* Painel Esquerdo */}
        <div
          id="painelEsquerda"
          className="flex flex-col gap-8 justify-center items-center w-1/2 p-12 bg-blue-950 text-white border-r border-blue-900"
        >

          <div className="w-full max-w-md flex flex-col gap-8">

            <div id="logo" className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold tracking-wide text-white">
                FabLab Manager
              </h2>

              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                SENAI — SISTEMA DE GESTÃO
              </p>
            </div>

            <div id="infoEsq" className="flex flex-col gap-5">
              <h1 className="text-3xl font-bold text-white leading-tight">
                Laboratório Digital<br />de Fabricação
              </h1>

              <p className="text-blue-200 text-sm leading-relaxed">
                Gerencie inventário, reservas de equipamentos e requisições de insumos em uma plataforma
                integrada.
              </p>

              <ul className="recursos flex flex-col gap-3 text-sm text-blue-100 mt-2">
                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    📦
                  </span>
                  Controle de estoque em tempo real
                </li>

                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    🖨️
                  </span>
                  Reserva de impressoras 3D, laser e CNC
                </li>

                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    ✅
                  </span>
                  Fluxo de aprovação de requisições
                </li>

                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    🔔
                  </span>
                  Alertas de manutenção e estoque crítico
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Painel Direito */}
        <div
          id="painelDireita"
          className="w-1/2 min-h-screen bg-slate-50 p-12 flex flex-col justify-center items-center"
        >

          <div className="w-full max-w-sm space-y-6">

            <div id="textoIntro">
              <h1 className="text-2xl font-bold text-slate-900">
                Acesse o sistema
              </h1>

              <h2 className="text-xs text-slate-500 mt-1">
                Selecione seu perfil e insira suas credenciais.
              </h2>
            </div>

            {/* Formulário */}
            <form
              id="formulario"
              className="space-y-4"
              onSubmit={entrarNoSistema}
            >

              <div>
                <p className="titulo-opcao text-xs font-semibold text-slate-700 mb-2">
                  Perfil de acesso
                </p>

                <div className="campos-perfil grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-xl">

                  <input
                    type="radio"
                    id="aluno"
                    name="tipo_usuario"
                    value="aluno"
                    checked={perfilSelecionado === 'aluno'}
                    onChange={(ev) => setPerfilSelecionado(ev.target.value)}
                    className="hidden peer/aluno"
                  />

                  <label
                    htmlFor="aluno"
                    className="text-center py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer peer-checked/aluno:bg-blue-600 peer-checked/aluno:text-white peer-checked/aluno:shadow-sm transition-all"
                  >
                    Aluno
                  </label>

                  <input
                    type="radio"
                    id="professor"
                    name="tipo_usuario"
                    value="professor"
                    checked={perfilSelecionado === 'professor'}
                    onChange={(ev) => setPerfilSelecionado(ev.target.value)}
                    className="hidden peer/prof"
                  />

                  <label
                    htmlFor="professor"
                    className="text-center py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer peer-checked/prof:bg-blue-600 peer-checked/prof:text-white peer-checked/prof:shadow-sm transition-all"
                  >
                    Professor
                  </label>

                  <input
                    type="radio"
                    id="admin"
                    name="tipo_usuario"
                    value="admin"
                    checked={perfilSelecionado === 'admin'}
                    onChange={(ev) => setPerfilSelecionado(ev.target.value)}
                    className="hidden peer/admin"
                  />

                  <label
                    htmlFor="admin"
                    className="text-center py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer peer-checked/admin:bg-blue-600 peer-checked/admin:text-white peer-checked/admin:shadow-sm transition-all"
                  >
                    Administrador
                  </label>

                </div>
              </div>

              <div className="campos flex flex-col gap-1">
                <label
                  htmlFor="txtemail"
                  className="text-xs font-semibold text-slate-700"
                >
                  E-mail institucional
                </label>

                <input
                  type="email"
                  id="txtemail"
                  name="email"
                  placeholder="usuario@aluno.senai.br"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="campos flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="txtsenha"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Senha
                  </label>

                  <Link
                    to="/recuperacao-senha"
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <input
                  type="password"
                  id="txtsenha"
                  name="senha"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
              >
                Entrar no sistema
              </button>

            </form>

            <div className="text-center pt-4 border-t border-slate-200 mt-4">
              <p className="text-xs text-slate-600 p-4">
                Não possui uma conta?{' '}
                <Link
                  to="/cadastro"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Fazer Cadastro
                </Link>
              </p>

              {/* Atalhos Demo */}
              <div
                id="demonstracao"
                className="border border-slate-200 rounded-xl p-3 text-center bg-white"
              >
                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">
                  ACESSO DE DEMONSTRAÇÃO
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => entrarComo('aluno')}
                    className="py-1.5 px-2 text-xs text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-100"
                  >
                    Aluno
                  </button>

                  <button
                    type="button"
                    onClick={() => entrarComo('instrutor')}
                    className="py-1.5 px-2 text-xs text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-100"
                  >
                    Professor
                  </button>

                  <button
                    type="button"
                    onClick={() => entrarComo('administrador')}
                    className="py-1.5 px-2 text-xs text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-100"
                  >
                    Administrador
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
