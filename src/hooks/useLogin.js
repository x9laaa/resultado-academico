import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config'
import { useAuth } from '../context/AuthContext'

const RUTA_POR_ROL = {
  admin: '/admin',
  profesor: '/profesor',
  utp: '/utp'
}

export function useLogin() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()
  const { usuario, rol, cargando: cargandoSesion } = useAuth()

  useEffect(() => {
    if (cargandoSesion || !usuario) return

    const ruta = RUTA_POR_ROL[rol]
    if (ruta) navigate(ruta, { replace: true })
  }, [usuario, rol, cargandoSesion, navigate])

  const iniciarSesion = async e => {
    e.preventDefault()
    setErrorLogin('')
    setCargando(true)

    try {
      await signInWithEmailAndPassword(auth, correo, password)
    } catch (error) {
      console.error(error)
      setErrorLogin(
        error.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta.'
          : 'Ocurrió un error al iniciar sesión.'
      )
    } finally {
      setCargando(false)
    }
  }

  const mensajeRol =
    !cargandoSesion && usuario && !RUTA_POR_ROL[rol]
      ? rol
        ? 'El usuario tiene un rol no válido.'
        : 'El usuario no tiene información registrada.'
      : ''

  return {
    correo,
    setCorreo,
    password,
    setPassword,
    mensaje: errorLogin || mensajeRol,
    cargando,
    iniciarSesion
  }
}
