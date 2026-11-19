
import { Link } from 'react-router-dom'

function RecuperacaoSenha() {
  return (
    <main className="bg-slate-100 font-sans antialiased">
      <div id="geral" className="flex min-h-screen">

        {/* Painel Esquerdo */}
        <div
          id="painelEsquerda"
          className="hidden lg:flex flex-col gap-8 justify-center items-center w-1/2 p-12 bg-blue-950 text-white border-r border-blue-900"
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
                Recuperação de Acesso
              </h1>

              <p className="text-blue-200 text-sm leading-relaxed">
                Esqueceu a sua palavra-passe? Não se preocupe. Introduza o seu
                e-mail institucional para redefinir as suas credenciais em
                segurança.
              </p>

              <ul className="flex flex-col gap-3 text-sm text-blue-100 mt-2">
                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    🔒
                  </span>
                  Processo seguro de redefinição
                </li>

                <li className="flex items-center gap-3">
                  <span className="bg-blue-900/80 p-1.5 rounded text-blue-300 text-xs">
                    ✉️
                  </span>
                  Instruções enviadas para o e-mail institucional
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
                Recuperar senha
              </h1>

              <h2 className="text-xs text-slate-500 mt-1">
                Informe o seu e-mail cadastrado para receber as instruções.
              </h2>
            </div>

            {/* Formulário */}
            <form
              id="formulario"
              action="/login"
              method="GET"
              className="space-y-4"
            >
              <div className="flex flex-col gap-1">
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
                  required
                  placeholder="usuario@aluno.senai.br"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
              >
                Enviar instruções
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200 mt-4">
              <p className="text-xs text-slate-600">
                Lembrou-se da senha?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Voltar para o Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}

export default RecuperacaoSenha
