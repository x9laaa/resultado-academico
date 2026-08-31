import { useState, useEffect } from 'react'
import { obtenerCursos } from '../services/cursoService'
import { obtenerDesafios } from '../services/desafioService'
import { obtenerEvaluaciones, crearEvaluacion } from '../services/evaluacionService'
import { useToast } from '../context/NotificacionesContext'

export function useGestionEvaluaciones() {
  const toast = useToast()

  const [cursos, setCursos] = useState([])
  const [desafios, setDesafios] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  const [curso, setCurso] = useState('')
  const [desafio, setDesafio] = useState('')
  const [fechaAplicacion, setFechaAplicacion] = useState('')
  const [anio, setAnio] = useState(new Date().getFullYear())

  const cargarEvaluaciones = async () => setEvaluaciones(await obtenerEvaluaciones())

  useEffect(() => {
    obtenerCursos().then(setCursos)
    obtenerDesafios().then(setDesafios)
    cargarEvaluaciones()
  }, [])

  const limpiarFormulario = () => {
    setCurso('')
    setDesafio('')
    setFechaAplicacion('')
    setAnio(new Date().getFullYear())
  }

  const registrarEvaluacion = async e => {
    e.preventDefault()

    if (!curso || !desafio || !fechaAplicacion) {
      toast.error('Complete todos los campos')
      return
    }

    await crearEvaluacion({
      id_curso: curso,
      id_desafio: desafio,
      fecha_aplicacion: fechaAplicacion,
      anio: Number(anio)
    })

    toast.exito('Evaluación registrada correctamente')
    limpiarFormulario()
    cargarEvaluaciones()
  }

  const buscarEnLista = (lista, id, campo) => lista.find(item => item.id === id)?.[campo] || 'No encontrado'

  return {
    cursos,
    desafios,
    evaluaciones,
    curso,
    setCurso,
    desafio,
    setDesafio,
    fechaAplicacion,
    setFechaAplicacion,
    anio,
    setAnio,
    registrarEvaluacion,
    obtenerCurso: id => buscarEnLista(cursos, id, 'nombre_curso'),
    obtenerDesafio: id => buscarEnLista(desafios, id, 'nombre')
  }
}
