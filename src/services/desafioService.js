import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config'

const desafiosRef = collection(db, 'desafios')

export const obtenerDesafios = async () => {
  const datos = await getDocs(desafiosRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const crearDesafio = async datos => {
  return await addDoc(desafiosRef, { ...datos, fecha_creacion: serverTimestamp() })
}

export const actualizarDesafio = async (id, datos) => {
  await updateDoc(doc(db, 'desafios', id), datos)
}

export const eliminarDesafio = async id => {
  await deleteDoc(doc(db, 'desafios', id))
}