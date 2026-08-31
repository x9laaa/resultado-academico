import { collection, doc, getDoc, getDocs, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../config'

const usuariosRef = collection(db, 'usuarios')

export const obtenerUsuarios = async () => {
  const datos = await getDocs(usuariosRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const obtenerUsuarioPorId = async uid => {
  const usuarioDoc = await getDoc(doc(db, 'usuarios', uid))
  return usuarioDoc.exists() ? { id: usuarioDoc.id, ...usuarioDoc.data() } : null
}

export const suscribirseUsuarios = (alCambiar, alFallar) => {
  return onSnapshot(
    usuariosRef,
    resultado => alCambiar(resultado.docs.map(item => ({ id: item.id, ...item.data() }))),
    alFallar
  )
}

export const crearUsuarioEnFirestore = async (uid, datos) => {
  await setDoc(doc(db, 'usuarios', uid), { uid, ...datos })
}
