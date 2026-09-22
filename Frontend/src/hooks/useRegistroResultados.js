import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/NotificacionesContext'

import { obtenerEvaluaciones, crearEvaluacion } from '../services/evaluacionService'
import { obtenerDesafios } from '../services/desafioService'
import { obtenerCursos } from '../services/cursoService'
import { obtenerEstudiantes, obtenerEstudiantesCurso } from '../services/estudianteService'
import { obtenerResultados, obtenerResultadosEvaluacion, guardarResultadosLote } from '../services/resultadoService'

import { convertirFecha } from '../utils/fecha'
import {
  esVelocidadLectora as esVL,
  puntajeMaximoDesafio,
  calcularPuntaje as calcularPuntajeBase,
  tieneResultado as tieneResultadoBase,
  calcularNivel as calcularNivelBase,
  validarResultado as validarResultadoBase
} from '../utils/desempeno'

const contarPor = (lista, clave) =>
  lista.reduce((acc, item) => {
    acc[item[clave]] = (acc[item[clave]] || 0) + 1
    return acc
  }, {})

export function useRegistroResultados() {
  const { usuario, rol } = useAuth()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const autoSeleccionRef = useRef(false)

  const [evaluaciones, setEvaluaciones] = useState([])
  const [desafios, setDesafios] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudiantes, setEstudiantes] = useState([])

  const [cantidadAlumnos, setCantidadAlumnos] = useState({})
  const [cantidadResultados, setCantidadResultados] = useState({})

  const [cursoFiltro, setCursoFiltro] = useState('')
  const [desafioFiltro, setDesafioFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [evaluacion, setEvaluacion] = useState('')
  const [resultados, setResultados] = useState({})

  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

  const evaluacionVacia = { id_curso: '', id_desafio: '', fecha_aplicacion: '' }
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState(evaluacionVacia)
  const [creandoEvaluacion, setCreandoEvaluacion] = useState(false)

  const cargarDatos = async () => {
    try {
      setCargando(true)

      const [evals, des, cur, est, res] = await Promise.all([
        obtenerEvaluaciones(),
        obtenerDesafios(),
        obtenerCursos(),
        obtenerEstudiantes(),
        obtenerResultados()
      ])

      setEvaluaciones(evals)
      setDesafios(des)
      setCursos(cur)
      setCantidadAlumnos(contarPor(est, 'id_curso'))
      setCantidadResultados(contarPor(res, 'id_evaluacion'))
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los datos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const obtenerCurso = id => cursos.find(curso => curso.id === id)?.nombre_curso || 'Curso'
  const obtenerDesafio = id => desafios.find(desafio => desafio.id === id)?.nombre || 'Desafío'

  const cursosDelProfesor =
    rol === 'profesor'
      ? cursos.filter(curso => curso.profesores?.includes(usuario?.uid)).map(curso => curso.id)
      : null

  const evaluacionesVisibles = cursosDelProfesor
    ? evaluaciones.filter(evaluacion => cursosDelProfesor.includes(evaluacion.id_curso))
    : evaluaciones

  const cursosParaCrear = cursosDelProfesor
    ? cursos.filter(curso => cursosDelProfesor.includes(curso.id))
    : cursos

  const cursosConEvaluacion = cursos.filter(curso =>
    evaluacionesVisibles.some(evaluacion => evaluacion.id_curso === curso.id)
  )

  const evaluacionesCurso = cursoFiltro
    ? evaluacionesVisibles.filter(evaluacion => evaluacion.id_curso === cursoFiltro)
    : evaluacionesVisibles

  const desafiosDisponibles = [...new Set(evaluacionesCurso.map(evaluacion => evaluacion.id_desafio))]
    .map(id => desafios.find(desafio => desafio.id === id))
    .filter(Boolean)

  const evaluacionesFiltradas = [...evaluacionesCurso]
    .filter(evaluacion => !desafioFiltro || evaluacion.id_desafio === desafioFiltro)
    .filter(evaluacion =>
      `${obtenerDesafio(evaluacion.id_desafio)}
       ${obtenerCurso(evaluacion.id_curso)}
       ${evaluacion.fecha_aplicacion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
    .sort((a, b) => convertirFecha(b.fecha_aplicacion) - convertirFecha(a.fecha_aplicacion))

  const cambiarCampoNuevaEvaluacion = (campo, valor) =>
    setNuevaEvaluacion(anterior => ({ ...anterior, [campo]: valor }))

  const crearNuevaEvaluacion = async e => {
    e.preventDefault()

    const { id_curso, id_desafio, fecha_aplicacion } = nuevaEvaluacion

    if (!id_curso || !id_desafio || !fecha_aplicacion) {
      toast.error('Complete todos los campos')
      return false
    }

    if (cursosDelProfesor && !cursosDelProfesor.includes(id_curso)) {
      toast.error('Solo puede crear evaluaciones en sus cursos asignados')
      return false
    }

    setCreandoEvaluacion(true)

    try {
      await crearEvaluacion({ id_curso, id_desafio, fecha_aplicacion })
      setNuevaEvaluacion(evaluacionVacia)
      await cargarDatos()
      toast.exito('Evaluación creada correctamente')
      return true
    } catch (error) {
      console.error(error)
      toast.error('No se pudo crear la evaluación')
      return false
    } finally {
      setCreandoEvaluacion(false)
    }
  }

  const seleccionarCurso = id => {
    setCursoFiltro(id)
    setDesafioFiltro('')
    setBusqueda('')
    setEvaluacion('')
    setEstudiantes([])
    setResultados({})
  }

  const seleccionarEvaluacion = async id => {
    setEvaluacion(id)
    setEstudiantes([])
    setResultados({})

    if (!id) return

    const evaluacionActual = evaluaciones.find(evaluacion => evaluacion.id === id)
    if (!evaluacionActual) return

    try {
      const [lista, resultadosData] = await Promise.all([
        obtenerEstudiantesCurso(evaluacionActual.id_curso),
        obtenerResultadosEvaluacion(id)
      ])

      const resultadosIniciales = Object.fromEntries(lista.map(estudiante => [estudiante.id, {}]))

      resultadosData.forEach(resultado => {
        if (resultadosIniciales[resultado.id_estudiante]) {
          resultadosIniciales[resultado.id_estudiante] = { ...resultado }
        }
      })

      setEstudiantes(lista)
      setResultados(resultadosIniciales)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar estudiantes y resultados')
    }
  }

  const volverEvaluaciones = () => {
    setEvaluacion('')
    setEstudiantes([])
    setResultados({})
    cargarDatos()
  }

  useEffect(() => {
    if (autoSeleccionRef.current || cargando) return

    const id = searchParams.get('evaluacion')
    if (!id) return

    if (evaluaciones.some(item => item.id === id)) {
      autoSeleccionRef.current = true
      seleccionarEvaluacion(id)

      const limpio = new URLSearchParams(searchParams)
      limpio.delete('evaluacion')
      setSearchParams(limpio, { replace: true })
    }
  }, [cargando, evaluaciones, searchParams, setSearchParams])

  const evaluacionSeleccionada = evaluaciones.find(item => item.id === evaluacion)

  const desafioSeleccionado = evaluacionSeleccionada
    ? desafios.find(desafio => desafio.id === evaluacionSeleccionada.id_desafio)
    : null

  const esVelocidadLectora = esVL(desafioSeleccionado)
  const puntajeMaximo = puntajeMaximoDesafio(desafioSeleccionado)

  const cambiarResultado = (idEstudiante, campo, valor) => {
    setResultados(anterior => ({
      ...anterior,
      [idEstudiante]: { ...anterior[idEstudiante], [campo]: valor }
    }))
  }

  const calcularPuntaje = idEstudiante => calcularPuntajeBase(desafioSeleccionado, resultados[idEstudiante] || {})
  const calcularNivel = puntaje => calcularNivelBase(desafioSeleccionado, puntaje)
  const tieneResultado = idEstudiante => tieneResultadoBase(desafioSeleccionado, resultados[idEstudiante] || {})

  const errorResultado = idEstudiante =>
    tieneResultado(idEstudiante)
      ? validarResultadoBase(desafioSeleccionado, resultados[idEstudiante] || {})
      : null

  const estudiantesConError = estudiantes.filter(estudiante => errorResultado(estudiante.id))

  const construirDatos = (idEstudiante, resultado) => {
    const puntaje = calcularPuntaje(idEstudiante)

    const datos = {
      id_estudiante: idEstudiante,
      id_evaluacion: evaluacionSeleccionada.id,
      id_curso: evaluacionSeleccionada.id_curso,
      id_desafio: evaluacionSeleccionada.id_desafio,
      puntaje_obtenido: puntaje,
      puntaje_maximo: puntajeMaximo,
      nivel_desempeno: calcularNivel(puntaje)
    }

    if (esVelocidadLectora) {
      datos.palabras = Number(resultado.palabras || 0)
    } else {
      desafioSeleccionado.campos?.forEach(campo => {
        datos[campo] = Number(resultado[campo] || 0)
      })
    }

    return datos
  }

  const guardarResultados = async () => {
    if (!evaluacionSeleccionada || !desafioSeleccionado) {
      toast.error('Seleccione una evaluación')
      return
    }

    if (!estudiantes.length) {
      toast.error('Esta evaluación no tiene estudiantes para registrar')
      return
    }

    if (estudiantesConError.length) {
      const primero = estudiantesConError[0]
      toast.error(
        estudiantesConError.length === 1
          ? `${primero.nombre} ${primero.apellido}: ${errorResultado(primero.id)}`
          : `Hay ${estudiantesConError.length} resultados con valores fuera de rango. Corríjalos antes de guardar.`
      )
      return
    }

    const aGuardar = []
    const aEliminar = []

    estudiantes.forEach(estudiante => {
      const resultado = resultados[estudiante.id] || {}
      const idExistente = resultado.id || null

      if (!tieneResultado(estudiante.id)) {
        if (idExistente) aEliminar.push(idExistente)
        return
      }

      aGuardar.push({ id: idExistente, datos: construirDatos(estudiante.id, resultado) })
    })

    if (!aGuardar.length && !aEliminar.length) {
      toast.info('No hay resultados para guardar')
      return
    }

    setGuardando(true)

    try {
      await guardarResultadosLote(aGuardar, aEliminar)

      await cargarDatos()
      await seleccionarEvaluacion(evaluacionSeleccionada.id)

      toast.exito(`Resultados guardados: ${aGuardar.length} de ${estudiantes.length} estudiantes`)
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error al guardar los resultados')
    } finally {
      setGuardando(false)
    }
  }

  const registrados = estudiantes.filter(estudiante => tieneResultado(estudiante.id)).length

  return {
    cargando,
    guardando,
    cursosConEvaluacion,
    desafiosDisponibles,
    cursoFiltro,
    desafioFiltro,
    busqueda,
    setDesafioFiltro,
    setBusqueda,
    seleccionarCurso,
    evaluacionesFiltradas,
    cursosParaCrear,
    desafios,
    nuevaEvaluacion,
    cambiarCampoNuevaEvaluacion,
    crearNuevaEvaluacion,
    creandoEvaluacion,
    cantidadAlumnos,
    cantidadResultados,
    obtenerCurso,
    obtenerDesafio,
    seleccionarEvaluacion,
    evaluacion,
    evaluacionSeleccionada,
    desafioSeleccionado,
    esVelocidadLectora,
    puntajeMaximo,
    estudiantes,
    resultados,
    registrados,
    pendientes: estudiantes.length - registrados,
    volverEvaluaciones,
    cambiarResultado,
    calcularPuntaje,
    calcularNivel,
    errorResultado,
    hayErrores: estudiantesConError.length > 0,
    guardarResultados
  }
}
