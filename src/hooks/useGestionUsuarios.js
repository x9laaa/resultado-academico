import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { firebaseConfig } from '../config'
import { suscribirseUsuarios, crearUsuarioEnFirestore } from '../services/usuarioService'

const appRegistro = initializeApp(firebaseConfig, 'registro-usuarios')
const authRegistro = getAuth(appRegistro)

const MENSAJES_ERROR = {
  'auth/email-already-in-use': 'Ya existe un usuario registrado con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.'
}

const ordenarPorNombre = lista =>
  [...lista].sort((a, b) =>
    `${a.nombre} ${a.apellido}`.toLowerCase().localeCompare(`${b.nombre} ${b.apellido}`.toLowerCase())
  )

export function useGestionUsuarios() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('profesor')
  const [usuarios, setUsuarios] = useState([])

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => suscribirseUsuarios(
    listaUsuarios => setUsuarios(ordenarPorNombre(listaUsuarios)),
    () => setMensaje('No fue posible cargar los usuarios registrados.')
  ), [])

  const registrarUsuario = async e => {
    e.preventDefault()
    setMensaje('')
    setCargando(true)

    try {
      const { user } = await createUserWithEmailAndPassword(authRegistro, correo, password)

      await crearUsuarioEnFirestore(user.uid, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim().toLowerCase(),
        rol
      })

      await signOut(authRegistro)

      setMensaje('Usuario creado correctamente')
      setNombre('')
      setApellido('')
      setCorreo('')
      setPassword('')
      setRol('profesor')
    } catch (error) {
      setMensaje(MENSAJES_ERROR[error.code] || 'No fue posible registrar al usuario. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  return {
    nombre,
    setNombre,
    apellido,
    setApellido,
    correo,
    setCorreo,
    password,
    setPassword,
    rol,
    setRol,
    usuarios,
    mensaje,
    cargando,
    registrarUsuario
  }
}
