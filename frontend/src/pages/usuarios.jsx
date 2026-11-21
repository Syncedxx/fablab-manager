import { useEffect, useRef, useState } from 'react'
import { Icone } from '../icones.jsx'

const PERFIS = {
  aluno: {
    nome: 'Aluno',
    cor: 'text-slate-600 bg-slate-100'
  },
  instrutor: {
    nome: 'Professor(a)',
    cor: 'text-blue-600 bg-blue-50'
  },
  administrador: {
    nome: 'Administrador(a)',
    cor: 'text-violet-600 bg-violet-50'
  }
}

function obterIniciais(nome) {
  const partes = nome.trim().split(/\s+/)

  let letras = partes[0].charAt(0)

  if (partes.length > 1) {
    letras += partes[partes.length - 1].charAt(0)
  }

  return letras.toUpperCase()
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Ana Souza',
      email: 'ana.souza@senai.br',
      perfil: 'aluno',
      ativo: true
    },
    {
      id: 2,
      nome: 'João Pereira',
      email: 'joao.pereira@senai.br',
      perfil: 'aluno',
      ativo: true
    },
    {
      id: 3,
      nome: 'Pedro Santos',
      email: 'pedro.santos@senai.br',
      perfil: 'aluno',
      ativo: false
    },
    {
      id: 4,
      nome: 'Carlos Lima',
      email: 'carlos.lima@senai.br',
      perfil: 'instrutor',
      ativo: true
    },
    {
      id: 5,
      nome: 'Marina Alves',
      email: 'marina.alves@senai.br',
      perfil: 'administrador',
      ativo: true
    }
  ])

  const [busca, setBusca] = useState('')
  const [selecao, setSelecao] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [perfil, setPerfil] = useState('aluno')

  const proximoId = useRef(6)

  // Guardam o botão que abre o popup e o primeiro campo dele.
  const botaoAbrirRef = useRef(null)
  const campoNomeRef = useRef(null)

  // Com o popup aberto: foca o primeiro campo e fecha com Esc.
  // Ao fechar, o foco volta para o botão que abriu.
  useEffect(() => {
    if (!modalAberto) return

    const botaoQueAbriu = botaoAbrirRef.current

    campoNomeRef.current.focus()

    function aoApertarTecla(event) {
      if (event.key === 'Escape') {
        setModalAberto(false)
      }
    }

    window.addEventListener('keydown', aoApertarTecla)

    return () => {
      window.removeEventListener('keydown', aoApertarTecla)
      botaoQueAbriu.focus()
    }
  }, [modalAberto])

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busca.toLowerCase()

    const achou = (usuario.nome + ' ' + usuario.email)
      .toLowerCase()
      .includes(texto)

    const perfilOk =
      selecao === '' || usuario.perfil === selecao

    return achou && perfilOk
  })

  function alterarStatus(id) {
    setUsuarios((usuariosAtuais) =>
      usuariosAtuais.map((usuario) =>
        usuario.id === id
          ? { ...usuario, ativo: !usuario.ativo }
          : usuario
      )
    )
  }

  function cadastrarUsuario(event) {
    event.preventDefault()

    const novoUsuario = {
      id: proximoId.current++,
      nome,
      email,
      perfil,
      ativo: true
    }

    setUsuarios((usuariosAtuais) => [
      ...usuariosAtuais,
      novoUsuario
    ])

    setNome('')
    setEmail('')
    setPerfil('aluno')
    setModalAberto(false)
  }

  return (
    <div className="w-full min-h-screen p-8 flex flex-col gap-6 bg-slate-50 text-slate-800 antialiased font-sans">

      {/* Cabeçalho */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            ADMINISTRAÇÃO
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Usuários
          </h1>

          <p className="text-xs text-slate-500">
            Gerencie quem acessa o sistema e com qual perfil.
          </p>
        </div>

        <div>
          <button
            type="button"
            ref={botaoAbrirRef}
            onClick={() => setModalAberto(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Icone nome="mais" className="w-4 h-4" />
            Novo usuário
          </button>
        </div>
      </header>

      {/* Busca e filtro */}
      <div className="flex gap-3">
        <input
          type="search"
          aria-label="Buscar usuário"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
        />

        <select
          aria-label="Filtrar por perfil"
          value={selecao}
          onChange={(event) => setSelecao(event.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Todos os perfis</option>
          <option value="aluno">Aluno</option>
          <option value="instrutor">Professor(a)</option>
          <option value="administrador">Administrador(a)</option>
        </select>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <caption className="sr-only">Lista de usuários</caption>

          <thead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-4 px-6">Usuário</th>
              <th scope="col" className="py-4 px-6 text-center">Perfil</th>
              <th scope="col" className="py-4 px-6 text-center">Status</th>
              <th scope="col" className="py-4 px-6 text-right">Ação</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => {
                const informacaoPerfil = PERFIS[usuario.perfil]

                return (
                  <tr
                    key={usuario.id}
                    className="hover:bg-slate-50/50"
                  >
                    <td className="py-4 px-6 flex items-center gap-3 font-semibold text-slate-800">
                      <div
                        aria-hidden="true"
                        className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold"
                      >
                        {obterIniciais(usuario.nome)}
                      </div>

                      <div className="flex flex-col">
                        <span>{usuario.nome}</span>

                        <span className="text-[11px] font-normal text-slate-500">
                          {usuario.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${informacaoPerfil.cor}`}
                      >
                        {informacaoPerfil.nome}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {usuario.ativo ? (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 rounded-full">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => alterarStatus(usuario.id)}
                        aria-label={`${usuario.ativo ? 'Desativar' : 'Ativar'} ${usuario.nome}`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup: novo usuário */}
      <div
        className={`${
          modalAberto ? 'flex' : 'hidden'
        } fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 items-center justify-center p-4`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalUsuario"
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
        >

          {/* Cabeçalho do popup */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3
                id="tituloModalUsuario"
                className="font-bold text-slate-900 text-sm"
              >
                Novo usuário
              </h3>

              <p className="text-[11px] text-slate-500">
                Informe os dados e escolha o perfil de acesso.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(false)}
              aria-label="Fechar"
              className="text-slate-500 hover:text-slate-700 text-sm font-bold p-2"
            >
              <Icone nome="fechar" className="w-4 h-4" />
            </button>
          </div>

          {/* Formulário */}
          <form
            onSubmit={cadastrarUsuario}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoNome"
                className="text-xs font-semibold text-slate-700"
              >
                Nome
              </label>

              <input
                id="campoNome"
                ref={campoNomeRef}
                type="text"
                required
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoEmail"
                className="text-xs font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="campoEmail"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="campoPerfil"
                className="text-xs font-semibold text-slate-700"
              >
                Perfil
              </label>

              <select
                id="campoPerfil"
                value={perfil}
                onChange={(event) => setPerfil(event.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="aluno">Aluno</option>
                <option value="instrutor">Professor(a)</option>
                <option value="administrador">Administrador(a)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Usuarios