import { Link } from 'react-router-dom'

// Seções da política (título e texto de cada bloco)
const SECOES = [
  {
    titulo: '1. Quais dados coletamos',
    texto:
      'Coletamos apenas o necessário para o funcionamento do sistema: nome, e-mail institucional, perfil de acesso (aluno, professor ou administrador) e o registro das suas reservas e requisições de materiais.'
  },
  {
    titulo: '2. Para que usamos os dados',
    texto:
      'Os dados servem para identificar quem acessa o sistema, controlar as permissões de cada perfil, registrar o uso dos equipamentos e o consumo de materiais, e gerar avisos de estoque crítico e conflitos de reserva.'
  },
  {
    titulo: '3. Base legal',
    texto:
      'O tratamento é feito de acordo com a Lei nº 13.709/2018 (LGPD), sob base legal adequada à finalidade. Quando for necessário, pediremos o seu consentimento.'
  },
  {
    titulo: '4. Minimização',
    texto:
      'Só pedimos as informações realmente necessárias para o uso do FabLab Manager. Dados que não servem a essa finalidade não são coletados.'
  },
  {
    titulo: '5. Controle de acesso',
    texto:
      'Cada perfil enxerga apenas o que lhe cabe. Por exemplo, a gestão de usuários é exclusiva do administrador e as requisições de materiais ficam com professores e administradores.'
  },
  {
    titulo: '6. Proteção das credenciais',
    texto:
      'As senhas recebem proteção apropriada e não são exibidas em nenhuma tela do sistema.'
  },
  {
    titulo: '7. Seus direitos',
    texto:
      'Você pode solicitar acesso, correção ou exclusão dos seus dados, e também pedir informações sobre como eles são tratados. Para isso, procure a coordenação do curso ou o administrador do sistema.'
  }
]

export default function Privacidade() {
  return (
    <main className="min-h-screen bg-slate-100 font-sans antialiased p-4 flex justify-center">
      <div className="w-full max-w-2xl my-8 space-y-6">

        {/* Logo */}
        <div className="flex flex-col gap-0.5">
          <p className="text-xl font-bold tracking-wide text-slate-900">
            FabLab Manager
          </p>

          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            SENAI — SISTEMA DE GESTÃO
          </p>
        </div>

        {/* Conteúdo */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Política de Privacidade
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Entenda como o FabLab Manager trata os seus dados.
            </p>
          </div>

          {SECOES.map((secao) => (
            <section key={secao.titulo} className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                {secao.titulo}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {secao.texto}
              </p>
            </section>
          ))}

          <div className="pt-4 border-t border-slate-200 text-center">
            <Link
              to="/login"
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Voltar para o login
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}