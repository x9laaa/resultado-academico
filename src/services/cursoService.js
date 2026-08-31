import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../config'

const cursosRef = collection(db, 'cursos')

export const obtenerCursos = async () => {
  const datos = await getDocs(cursosRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const crearCurso = async datos => {
  return await addDoc(cursosRef, { ...datos, nombre_curso: datos.nombre_curso?.trim() || '', profesores: [] })
}

export const actualizarCurso = async (id, datos) => {
  await updateDoc(doc(db, 'cursos', id), datos)
}

export const eliminarCurso = async id => {
  await deleteDoc(doc(db, 'cursos', id))
}

export const agregarProfesorCurso = async (idCurso, idProfesor) => {
  await updateDoc(doc(db, 'cursos', idCurso), { profesores: arrayUnion(idProfesor) })
}

export const quitarProfesorCurso = async (idCurso, idProfesor) => {
  await updateDoc(doc(db, 'cursos', idCurso), { profesores: arrayRemove(idProfesor) })
}