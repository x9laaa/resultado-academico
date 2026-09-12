import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config'

const evaluacionesRef = collection(db, 'evaluaciones')

export const obtenerEvaluaciones = async () => {
  const datos = await getDocs(evaluacionesRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const crearEvaluacion = async datos => {
  return await addDoc(evaluacionesRef, { ...datos, fecha_creacion: serverTimestamp() })
}
