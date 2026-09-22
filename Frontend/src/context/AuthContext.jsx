import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config'
import { obtenerUsuarioPorId } from '../services/usuarioService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, async usuarioActual => {
      setCargando(true)
      setUsuario(usuarioActual)
      setPerfil(null)

      try {
        setPerfil(usuarioActual ? await obtenerUsuarioPorId(usuarioActual.uid) : null)
      } catch (error) {
        console.error('Error al obtener usuario:', error)
        setPerfil(null)
      } finally {
        setCargando(false)
      }
    })

    return () => cancelar()
  }, [])

  const valor = { usuario, perfil, rol: perfil?.rol ?? null, cargando }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
