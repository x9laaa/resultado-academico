import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config'
import { useAuth } from '../context/AuthContext'
import { enviarCorreoRestablecimiento } from '../services/usuarioService'

const RUTA_POR_ROL = {
  admin: '/admin',
  profesor: '/profesor',
  utp: '/utp'
}

const CREDENCIALES_INVALIDAS = [
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
  'auth/invalid-login-credentials'
]

const AVISO_RECUPERACION =
  'Si el correo está registrado, recibirá un enlace para restablecer su contraseña. Revise también la carpeta de spam.'

export function useLogin() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [aviso, setAviso] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false)

  const navigate = useNavigate()
  const { usuario, rol, cargando: cargandoSesion } = useAuth()

  useEffect(() => {
    if (cargandoSesion || !usuario) return

    const ruta = RUTA_POR_ROL[rol]
    if (ruta) navigate(ruta, { replace: true })
  }, [usuario, rol, cargandoSesion, navigate])

  const mensajeDeError = error => {
    if (CREDENCIALES_INVALIDAS.includes(error.code)) return 'Correo o contraseña incorrectos.'
    if (error.code === 'auth/invalid-email') return 'El correo ingresado no es válido.'
    if (error.code === 'auth/too-many-requests') {
      return 'Demasiados intentos fallidos. Espere unos minutos antes de volver a intentarlo.'
    }
    if (error.code === 'auth/network-request-failed') {
      return 'No hay conexión con el servidor. Revise su acceso a Internet.'
    }
    return 'Ocurrió un error al iniciar sesión.'
  }

  const iniciarSesion = async e => {
    e.preventDefault()
    setErrorLogin('')
    setAviso('')
    setCargando(true)

    try {
      await signInWithEmailAndPassword(auth, correo, password)
    } catch (error) {
      console.error(error)
      setErrorLogin(mensajeDeError(error))
    } finally {
      setCargando(false)
    }
  }

  const recuperarPassword = async () => {
    setErrorLogin('')
    setAviso('')

    if (!correo.trim()) {
      setErrorLogin('Ingrese su correo electrónico para restablecer la contraseña.')
      return
    }

    setEnviandoRecuperacion(true)

    try {
      await enviarCorreoRestablecimiento(correo.trim())
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setErrorLogin('El correo ingresado no es válido.')
        setEnviandoRecuperacion(false)
        return
      }

      console.error(error)
    }

    setEnviandoRecuperacion(false)
    setAviso(AVISO_RECUPERACION)
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
    aviso,
    cargando,
    iniciarSesion,
    recuperarPassword,
    enviandoRecuperacion
  }
}
