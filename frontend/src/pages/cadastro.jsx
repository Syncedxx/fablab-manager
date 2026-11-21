import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icone } from '../icones.jsx'

export default function Cadastro() {
  const [perfilSelecionado, setPerfilSelecionado] = useState('aluno')
  const navigate = useNavigate()

  function finalizarCadastro(ev) {
    ev.preventDefault()

    const dados = new FormData(ev.currentTarget)

    const senha = dados.get('senha')
    const confirmarSenha = dados.get('confirmar_senha')

    if (senha !== confirmarSenha) {
      alert('As senhas não conferem.')
      return
    }

    navigate('/login')
  }

  return (
    <main className="bg-slate-100 font-sans antialiased">
      <div id="geral" className="flex min-h-screen">

        {/* Painel Informações */}
        <div
          id="painelEsquerda"
          className="hidden lg:flex flex-col gap-8 justify-center items-center w-1/2 p-12 bg-blue-950 text-white border-r border-blue-900"
        >
          <div className="w-full max-w-md flex flex-col gap-8">

            <div id="logo" className="flex flex-col gap-0.5">
              <p className="text-xl font-bold tracking-wide text-white">
                FabLab Manager
              </p>

              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                SENAI — SISTEMA DE GESTÃO
              </p>
            </div>

            <div id="infoEsq" className="flex flex-col gap-5">
              <p className="text-3xl font-bold text-white leading-tight">
                Crie sua conta no <br />FabLab Manager
              </p>

              <p className="text-blue-200 text-sm leading-relaxed">
                Cadastre-se para solicitar insumos, reservar equipamentos e acompanhar suas requisições em uma plataforma integrada.
              </p>

              <ul className="recursos flex flex-col gap-3 text-sm text-blue-100 mt-2">
                <li className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs"
                  >
                    <Icone nome="formatura" className="w-4 h-4" />
                  </span>
                  Acesso personalizado conforme seu perfil
                </li>

                <li className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs"
                  >
                    <Icone nome="impressora" className="w-4 h-4" />
                  </span>
                  Agendamento autônomo de máquinas
                </li>

                <li className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs"
                  >
                    <Icone nome="pacote" className="w-4 h-4" />
                  </span>
                  Solicitação de materiais para projetos
                </li>

                <li className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs"
                  >
                    <Icone nome="sino" className="w-4 h-4" />
                  </span>
                  Acompanhamento de requisições em tempo real
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Painel Direito */}
        <div
          id="painelDireita"
          className="w-full lg:w-1/2 min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col justify-center items-center"
        >

          <div className="w-full max-w-sm space-y-6">

            <div id="textoIntro">
              <h1 className="text-2xl font-bold text-slate-900">
                Criar nova conta
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Preencha seus dados para solicitar acesso ao laboratório.
              </p>
            </div>

            {/* Formulário */}
            <form
              id="formulario"
              className="space-y-4"
              onSubmit={finalizarCadastro}
            >

              <fieldset>
                <legend className="titulo-opcao text-xs font-semibold text-slate-700 mb-2">
                  Perfil de acesso
                </legend>

                <div className="campos-perfil relative grid grid-cols-2 gap-1.5 bg-slate-200/80 p-1 rounded-xl">

                  <input
                    type="radio"
                    id="aluno"
                    name="tipo_usuario"
                    value="aluno"
                    checked={perfilSelecionado === 'aluno'}
                    onChange={(ev) => setPerfilSelecionado(ev.target.value)}
                    className="sr-only peer/aluno"
                  />

                  <label
                    htmlFor="aluno"
                    className="text-center py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer peer-checked/aluno:bg-blue-600 peer-checked/aluno:text-white peer-checked/aluno:shadow-sm peer-focus-visible/aluno:ring-2 peer-focus-visible/aluno:ring-blue-900 peer-focus-visible/aluno:ring-offset-1 transition-all"
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
                    className="sr-only peer/prof"
                  />

                  <label
                    htmlFor="professor"
                    className="text-center py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer peer-checked/prof:bg-blue-600 peer-checked/prof:text-white peer-checked/prof:shadow-sm peer-focus-visible/prof:ring-2 peer-focus-visible/prof:ring-blue-900 peer-focus-visible/prof:ring-offset-1 transition-all"
                  >
                    Professor
                  </label>

                </div>
              </fieldset>

              <div className="campos flex flex-col gap-1">
                <label
                  htmlFor="txtnome"
                  className="text-xs font-semibold text-slate-700"
                >
                  Nome completo
                </label>

                <input
                  type="text"
                  id="txtnome"
                  name="nome"
                  autoComplete="name"
                  required
                  placeholder="Ex.: João P. Gonçalves"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
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
                  autoComplete="email"
                  required
                  placeholder="usuario@aluno.senai.br"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="campos flex flex-col gap-1">
                <label
                  htmlFor="txtsenha"
                  className="text-xs font-semibold text-slate-700"
                >
                  Senha
                </label>

                <input
                  type="password"
                  id="txtsenha"
                  name="senha"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="campos flex flex-col gap-1">
                <label
                  htmlFor="txtconfsenha"
                  className="text-xs font-semibold text-slate-700"
                >
                  Confirmar senha
                </label>

                <input
                  type="password"
                  id="txtconfsenha"
                  name="confirmar_senha"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer mt-4"
              >
                Finalizar cadastro
              </button>

            </form>

            <div className="text-center pt-4 border-t border-slate-200 mt-4">
              <p className="text-xs text-slate-600">
                Já possui uma conta?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Fazer Login
                </Link>
              </p>

              {/* Política de Privacidade */}
              <p className="text-[10px] text-slate-500 mt-3">
                <Link to="/privacidade" className="hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}