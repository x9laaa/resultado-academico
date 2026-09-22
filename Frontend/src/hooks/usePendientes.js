import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/NotificacionesContext'

import { obtenerCursos } from '../services/cursoService'
import { obtenerDesafios } from '../services/desafioService'
import { obtenerEvaluaciones } from '../services/evaluacionService'
import { obtenerEstudiantes } from '../services/estudianteService'
import { obtenerResultados } from '../services/resultadoService'

import { convertirFecha } from '../utils/fecha'

const contarPor = (lista, clave) =>
  lista.reduce((acc, item) => {
    acc[item[clave]] = (acc[item[clave]] || 0) + 1
    return acc
  }, {})

function construirTablero({ cursos, desafios, evaluaciones, estudiantes, resultados, rol, usuarioUid }) {
  const nombreCurso = id => cursos.find(c => c.id === id)?.nombre_curso || 'Curso'
  const nombreDesafio = id => desafios.find(d => d.id === id)?.nombre || 'Desafío'

  const alumnosPorCurso = contarPor(estudiantes, 'id_curso')
  const resultadosPorEvaluacion = contarPor(resultados, 'id_evaluacion')

  const cursosProfesor =
    rol === 'profesor'
      ? cursos.filter(c => c.profesores?.includes(usuarioUid)).map(c => c.id)
      : null

  const visibles = cursosProfesor
    ? evaluaciones.filter(e => cursosProfesor.includes(e.id_curso))
    : evaluaciones

  const items = visibles.map(evaluacion => {
    const total = alumnosPorCurso[evaluacion.id_curso] || 0
    const registrados = Math.min(resultadosPorEvaluacion[evaluacion.id] || 0, total)
    const faltantes = Math.max(total - registrados, 0)

    let estado = 'pendiente'
    if (total === 0) estado = 'sin-alumnos'
    else if (faltantes === 0) estado = 'completa'

    return {
      id: evaluacion.id,
      curso: nombreCurso(evaluacion.id_curso),
      desafio: nombreDesafio(evaluacion.id_desafio),
      fecha: evaluacion.fecha_aplicacion,
      total,
      registrados,
      faltantes,
      estado
    }
  })

  const pendientes = items
    .filter(i => i.estado === 'pendiente')
    .sort((a, b) => convertirFecha(a.fecha) - convertirFecha(b.fecha))

  return {
    pendientes,
    completas: items.filter(i => i.estado === 'completa').length,
    sinAlumnos: items.filter(i => i.estado === 'sin-alumnos').length,
    alumnosPorRegistrar: pendientes.reduce((suma, i) => suma + i.faltantes, 0)
  }
}

export function usePendientes() {
  const { usuario, rol } = useAuth()
  const toast = useToast()

  const [cursos, setCursos] = useState([])
  const [desafios, setDesafios] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true

    Promise.all([
      obtenerCursos(),
      obtenerDesafios(),
      obtenerEvaluaciones(),
      obtenerEstudiantes(),
      obtenerResultados()
    ])
      .then(([cur, des, evs, est, res]) => {
        if (!vivo) return
        setCursos(cur)
        setDesafios(des)
        setEvaluaciones(evs)
        setEstudiantes(est)
        setResultados(res)
      })
      .catch(error => {
        console.error(error)
        toast.error('Error al cargar los datos')
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })

    return () => { vivo = false }
  }, [toast])

  const tablero = useMemo(
    () =>
      construirTablero({
        cursos,
        desafios,
        evaluaciones,
        estudiantes,
        resultados,
        rol,
        usuarioUid: usuario?.uid
      }),
    [cursos, desafios, evaluaciones, estudiantes, resultados, rol, usuario?.uid]
  )

  return { cargando, tablero }
}
