import { createContext, useContext, useState } from 'react'

const PerfilContext = createContext(null)

// Guarda o perfil do usuário e compartilha com as telas
export function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(() => {
    try {
      return localStorage.getItem('perfil')
    } catch (e) {
      return null
    }
  })

  function entrar(perfilSelecionado) {
    try {
      localStorage.setItem('perfil', perfilSelecionado)
    } catch (e) {}

    setPerfil(perfilSelecionado)
  }

  function sair() {
    try {
      localStorage.removeItem('perfil')
    } catch (e) {}

    setPerfil(null)
  }

  return (
    <PerfilContext.Provider value={{ perfil, entrar, sair }}>
      {children}
    </PerfilContext.Provider>
  )
}

// Permite acessar o perfil nas telas e componentes
export function usePerfil() {
  const contexto = useContext(PerfilContext)

  if (!contexto) {
    throw new Error('usePerfil deve ser usado dentro de PerfilProvider')
  }

  return contexto
}

