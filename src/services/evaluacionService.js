import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../config'

const evaluacionesRef = collection(db, 'evaluaciones')

export const obtenerEvaluaciones = async () => {
  const datos = await getDocs(evaluacionesRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const obtenerEvaluacionesCurso = async idCurso => {
  const consulta = query(evaluacionesRef, where('id_curso', '==', idCurso))
  const datos = await getDocs(consulta)
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