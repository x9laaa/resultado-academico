import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config'

const evaluacionesRef = collection(db, 'evaluaciones')

export const obtenerEvaluaciones = async () => {
  const datos = await getDocs(evaluacionesRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const crearEvaluacion = async datos => {
  return await addDoc(evaluacionesRef, { ...datos, fecha_creacion: serverTimestamp() })
}

export const actualizarEvaluacion = async (id, datos) => {
  await updateDoc(doc(db, 'evaluaciones', id), datos)
}

export const eliminarEvaluacion = async id => {
  await deleteDoc(doc(db, 'evaluaciones', id))
}
