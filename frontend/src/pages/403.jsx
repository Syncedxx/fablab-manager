import { Link } from 'react-router-dom'

function AcessoNegado() {
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 text-slate-800 font-sans antialiased">

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full text-center space-y-4">

        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center text-xl font-bold mx-auto">
          🔒
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Erro 403
          </h1>

          <p className="text-xs text-slate-500">
            Você não tem permissão para acessar esta página.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
          >
            Voltar para o início
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AcessoNegado