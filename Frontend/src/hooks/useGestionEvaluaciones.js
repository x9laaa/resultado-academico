import { useState, useEffect } from 'react'
import { obtenerCursos } from '../services/cursoService'
import { obtenerDesafios } from '../services/desafioService'
import {
  obtenerEvaluaciones,
  crearEvaluacion,
  actualizarEvaluacion,
  eliminarEvaluacion
} from '../services/evaluacionService'
import { obtenerResultadosEvaluacion } from '../services/resultadoService'
import { convertirFecha } from '../utils/fecha'
import { useToast, useConfirmar } from '../context/NotificacionesContext'

const FORMULARIO_VACIO = () => ({
  id_curso: '',
  id_desafio: '',
  fecha_aplicacion: ''
})

export function useGestionEvaluaciones() {
  const toast = useToast()
  const confirmar = useConfirmar()

  const [cursos, setCursos] = useState([])
  const [desafios, setDesafios] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [evaluacionEditar, setEvaluacionEditar] = useState(null)
  const [procesando, setProcesando] = useState(false)

  const cargarEvaluaciones = async () => {
    const lista = await obtenerEvaluaciones()
    setEvaluaciones(
      [...lista].sort((a, b) => convertirFecha(b.fecha_aplicacion) - convertirFecha(a.fecha_aplicacion))
    )
  }

  useEffect(() => {
    obtenerCursos().then(setCursos)
    obtenerDesafios().then(setDesafios)
    cargarEvaluaciones()
  }, [])

  const cambiarCampo = (campo, valor) =>
    setFormulario(anterior => ({ ...anterior, [campo]: valor }))

  const limpiarFormulario = () => {
    setFormulario(FORMULARIO_VACIO())
    setEvaluacionEditar(null)
  }

  const buscarEnLista = (lista, id, campo) => lista.find(item => item.id === id)?.[campo] || 'No encontrado'
  const obtenerCurso = id => buscarEnLista(cursos, id, 'nombre_curso')
  const obtenerDesafio = id => buscarEnLista(desafios, id, 'nombre')

  const existeDuplicada = (datos, idExcluir = null) =>
    evaluaciones.some(item =>
      item.id !== idExcluir &&
      item.id_curso === datos.id_curso &&
      item.id_desafio === datos.id_desafio &&
      item.fecha_aplicacion === datos.fecha_aplicacion
    )

  const guardar = async e => {
    e.preventDefault()

    const datos = {
      id_curso: formulario.id_curso,
      id_desafio: formulario.id_desafio,
      fecha_aplicacion: formulario.fecha_aplicacion
    }

    if (!datos.id_curso || !datos.id_desafio || !datos.fecha_aplicacion) {
      toast.error('Complete todos los campos')
      return
    }

    if (existeDuplicada(datos, evaluacionEditar?.id)) {
      toast.error('Ya existe una evaluación de ese desafío para ese curso en esa fecha')
      return
    }

    setProcesando(true)

    try {
      if (evaluacionEditar) {
        await actualizarEvaluacion(evaluacionEditar.id, datos)
        toast.exito('Evaluación actualizada correctamente')
      } else {
        await crearEvaluacion(datos)
        toast.exito('Evaluación registrada correctamente')
      }

      limpiarFormulario()
      await cargarEvaluaciones()
    } catch (error) {
      console.error(error)
      toast.error('No fue posible guardar la evaluación')
    } finally {
      setProcesando(false)
    }
  }

  const seleccionarEditar = item => {
    setEvaluacionEditar(item)
    setFormulario({
      id_curso: item.id_curso || '',
      id_desafio: item.id_desafio || '',
      fecha_aplicacion: item.fecha_aplicacion || ''
    })
  }

  const eliminarEvaluacionActual = async item => {
    setProcesando(true)

    try {
      const resultados = await obtenerResultadosEvaluacion(item.id)

      if (resultados.length) {
        toast.error(
          `No se puede eliminar: tiene ${resultados.length} resultado(s) registrado(s). Elimine primero los resultados.`
        )
        return
      }

      const ok = await confirmar({
        mensaje: `¿Eliminar la evaluación de ${obtenerDesafio(item.id_desafio)} en ${obtenerCurso(item.id_curso)} del ${item.fecha_aplicacion}?`,
        textoConfirmar: 'Eliminar',
        peligro: true
      })
      if (!ok) return

      await eliminarEvaluacion(item.id)

      if (evaluacionEditar?.id === item.id) limpiarFormulario()

      toast.exito('Evaluación eliminada correctamente')
      await cargarEvaluaciones()
    } catch (error) {
      console.error(error)
      toast.error('No fue posible eliminar la evaluación')
    } finally {
      setProcesando(false)
    }
  }

  return {
    cursos,
    desafios,
    evaluaciones,
    formulario,
    cambiarCampo,
    evaluacionEditar,
    procesando,
    guardar,
    seleccionarEditar,
    limpiarFormulario,
    eliminarEvaluacionActual,
    obtenerCurso,
    obtenerDesafio
  }
}
