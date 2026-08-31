import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../config'

const resultadosRef = collection(db, 'resultados')

export const obtenerResultados = async () => {
  const datos = await getDocs(resultadosRef)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const obtenerResultadosEvaluacion = async idEvaluacion => {
  const consulta = query(resultadosRef, where('id_evaluacion', '==', idEvaluacion))
  const datos = await getDocs(consulta)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}

export const obtenerResultadoEstudiante = async (idEvaluacion, idEstudiante) => {
  const consulta = query(
    resultadosRef,
    where('id_evaluacion', '==', idEvaluacion),
    where('id_estudiante', '==', idEstudiante)
  )

  const datos = await getDocs(consulta)

  if (datos.empty) return null

  const resultado = datos.docs[0]

  return { id: resultado.id, ...resultado.data() }
}

export const crearResultado = async datos => {
  return await addDoc(resultadosRef, datos)
}

export const actualizarResultado = async (id, datos) => {
  await updateDoc(doc(db, 'resultados', id), datos)
}

export const guardarResultado = async (datos, idResultado = null) => {
  if (idResultado) {
    await actualizarResultado(idResultado, datos)
    return idResultado
  }

  const resultado = await crearResultado(datos)
  return resultado.id
}

export const eliminarResultado = async id => {
  await deleteDoc(doc(db, 'resultados', id))
}

export const obtenerResultadosPorCurso = async idCurso => {
  const consulta = query(resultadosRef, where('id_curso', '==', idCurso))
  const datos = await getDocs(consulta)
  return datos.docs.map(item => ({ id: item.id, ...item.data() }))
}