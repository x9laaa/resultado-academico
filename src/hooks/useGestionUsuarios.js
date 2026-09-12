import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { firebaseConfig } from '../config'
import { useAuth } from '../context/AuthContext'
import { useToast, useConfirmar } from '../context/NotificacionesContext'
import {
  suscribirseUsuarios,
  crearUsuarioEnFirestore,
  actualizarUsuario,
  enviarCorreoRestablecimiento
} from '../services/usuarioService'

const appRegistro = initializeApp(firebaseConfig, 'registro-usuarios')
const authRegistro = getAuth(appRegistro)

const MENSAJES_ERROR = {
  'auth/email-already-in-use': 'Ya existe un usuario registrado con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.'
}

const ROLES = [
  { valor: 'admin', etiqueta: 'Administrador' },
  { valor: 'profesor', etiqueta: 'Profesor' },
  { valor: 'utp', etiqueta: 'UTP' }
]

const EDICION_VACIA = { nombre: '', apellido: '', rol: '' }

const nombreCompleto = item => `${item?.nombre || ''} ${item?.apellido || ''}`.trim()

const etiquetaDeRol = valor => ROLES.find(item => item.valor === valor)?.etiqueta || valor

const ordenarPorNombre = lista =>
  [...lista].sort((a, b) =>
    nombreCompleto(a).toLowerCase().localeCompare(nombreCompleto(b).toLowerCase())
  )

export function useGestionUsuarios() {
  const { usuario } = useAuth()
  const toast = useToast()
  const confirmar = useConfirmar()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('profesor')
  const [usuarios, setUsuarios] = useState([])

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const [usuarioEditar, setUsuarioEditar] = useState(null)
  const [edicion, setEdicion] = useState(EDICION_VACIA)
  const [procesando, setProcesando] = useState(false)

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

  const seleccionarEditar = item => {
    setUsuarioEditar(item)
    setEdicion({
      nombre: item.nombre || '',
      apellido: item.apellido || '',
      rol: item.rol || ''
    })
  }

  const cambiarCampoEdicion = (campo, valor) =>
    setEdicion(anterior => ({ ...anterior, [campo]: valor }))

  const cancelarEdicion = () => {
    setUsuarioEditar(null)
    setEdicion(EDICION_VACIA)
  }

  const guardarCambios = async e => {
    e.preventDefault()
    if (!usuarioEditar) return

    const datos = {
      nombre: edicion.nombre.trim(),
      apellido: edicion.apellido.trim(),
      rol: edicion.rol
    }

    if (!datos.nombre || !datos.apellido) {
      toast.error('El nombre y el apellido no pueden quedar vacíos')
      return
    }

    const cambioRol = datos.rol !== usuarioEditar.rol

    if (cambioRol && usuarioEditar.id === usuario?.uid) {
      toast.error('No puede modificar su propio rol')
      return
    }

    const sinCambios =
      datos.nombre === (usuarioEditar.nombre || '') &&
      datos.apellido === (usuarioEditar.apellido || '') &&
      !cambioRol

    if (sinCambios) {
      toast.info('No hay cambios que guardar')
      return
    }

    if (cambioRol) {
      const ok = await confirmar({
        mensaje: `¿Cambiar el rol de ${nombreCompleto(usuarioEditar)} a ${etiquetaDeRol(datos.rol)}?`,
        textoConfirmar: 'Guardar cambios'
      })
      if (!ok) return
    }

    setProcesando(true)

    try {
      await actualizarUsuario(usuarioEditar.id, datos)

      toast.exito(
        cambioRol
          ? 'Usuario actualizado. Debe volver a iniciar sesión para que el nuevo rol se aplique en su pantalla.'
          : 'Usuario actualizado correctamente'
      )

      cancelarEdicion()
    } catch (error) {
      console.error(error)
      toast.error('No fue posible actualizar el usuario')
    } finally {
      setProcesando(false)
    }
  }

  const restablecerPassword = async item => {
    if (!item?.correo) {
      toast.error('El usuario no tiene un correo registrado')
      return
    }

    const ok = await confirmar({
      mensaje: `Se enviará un correo a ${item.correo} para que defina una nueva contraseña. ¿Desea continuar?`,
      textoConfirmar: 'Enviar correo'
    })
    if (!ok) return

    setProcesando(true)

    try {
      await enviarCorreoRestablecimiento(item.correo)
      toast.exito('Correo de restablecimiento enviado')
    } catch (error) {
      console.error(error)
      toast.error('No fue posible enviar el correo de restablecimiento')
    } finally {
      setProcesando(false)
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
    registrarUsuario,
    roles: ROLES,
    usuarioEditar,
    edicion,
    cambiarCampoEdicion,
    seleccionarEditar,
    cancelarEdicion,
    guardarCambios,
    restablecerPassword,
    procesando,
    esUsuarioActual: id => id === usuario?.uid,
    nombreCompleto,
    etiquetaDeRol
  }
}
