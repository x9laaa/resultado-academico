import { collection, getDocs, doc, query, where, writeBatch } from 'firebase/firestore'
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

export const guardarResultadosLote = async (aGuardar = [], aEliminar = []) => {
  if (!aGuardar.length && !aEliminar.length) return

  const lote = writeBatch(db)

  aGuardar.forEach(({ id, datos }) => {
    const referencia = id ? doc(db, 'resultados', id) : doc(resultadosRef)
    lote.set(referencia, datos)
  })

  aEliminar.forEach(id => lote.delete(doc(db, 'resultados', id)))

  await lote.commit()
}
