import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../config'

const estudiantesRef = collection(db, 'estudiantes')

export const obtenerEstudiantes = async () => {
  const datos = await getDocs(estudiantesRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const obtenerEstudiantesCurso = async idCurso => {
  const consulta = query(estudiantesRef, where('id_curso', '==', idCurso))
  const datos = await getDocs(consulta)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const crearEstudiante = async datos => {
  return await addDoc(estudiantesRef, datos)
}

export const actualizarEstudiante = async (id, datos) => {
  await updateDoc(doc(db, 'estudiantes', id), datos)
}

export const eliminarEstudiante = async id => {
  await deleteDoc(doc(db, 'estudiantes', id))
}