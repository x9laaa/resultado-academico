import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/NotificacionesContext'

import { obtenerCursos } from '../services/cursoService'
import { obtenerDesafios } from '../services/desafioService'
import { obtenerEvaluaciones } from '../services/evaluacionService'
import { obtenerEstudiantes } from '../services/estudianteService'
import { obtenerResultados } from '../services/resultadoService'

import { convertirFecha } from '../utils/fecha'
import {
  ORDEN_NIVELES,
  esVelocidadLectora,
  puntajeMaximoDesafio,
  calcularPuntaje,
  calcularNivel
} from '../utils/desempeno'

function construirReporte({ cursoId, desafio, evaluaciones, resultados, estudiantes }) {
  if (!desafio) return null

  const hitos = evaluaciones
    .filter(e => e.id_curso === cursoId && e.id_desafio === desafio.id)
    .sort((a, b) => convertirFecha(a.fecha_aplicacion) - convertirFecha(b.fecha_aplicacion))

  const hitoIds = new Set(hitos.map(h => h.id))

  const porHito = {}
  resultados
    .filter(r => hitoIds.has(r.id_evaluacion))
    .forEach(r => {
      porHito[r.id_evaluacion] = porHito[r.id_evaluacion] || {}
      porHito[r.id_evaluacion][r.id_estudiante] = r
    })

  const alumnos = estudiantes.filter(e => e.id_curso === cursoId)
  const maximo = puntajeMaximoDesafio(desafio)
  const vl = esVelocidadLectora(desafio)

  const estudiantesReporte = alumnos.map(alumno => {
    const serie = hitos
      .map(hito => {
        const r = porHito[hito.id]?.[alumno.id]
        if (!r) return null

        const puntaje = Number(r.puntaje_obtenido ?? calcularPuntaje(desafio, r)) || 0

        return {
          hitoId: hito.id,
          fecha: hito.fecha_aplicacion,
          puntaje,
          nivel: r.nivel_desempeno || calcularNivel(desafio, puntaje),
          campos: (desafio.campos || []).map((clave, i) => ({
            clave,
            etiqueta: desafio.etiquetas?.[i] || clave,
            valor: Number(r[clave] || 0)
          })),
          palabras: vl ? Number(r.palabras || 0) : null
        }
      })
      .filter(Boolean)

    return {
      id: alumno.id,
      nombre: `${alumno.nombre} ${alumno.apellido}`,
      serie,
      ultimo: serie[serie.length - 1] || null
    }
  })

  const conUltimo = estudiantesReporte.filter(e => e.ultimo)

  const comparativa = conUltimo
    .map(e => ({ id: e.id, nombre: e.nombre, puntaje: e.ultimo.puntaje, nivel: e.ultimo.nivel }))
    .sort((a, b) => b.puntaje - a.puntaje)

  const conteo = ORDEN_NIVELES.reduce((acc, nivel) => ({ ...acc, [nivel]: 0 }), {})
  conUltimo.forEach(e => { conteo[e.ultimo.nivel] += 1 })

  const promedio = conUltimo.length
    ? Math.round(conUltimo.reduce((suma, e) => suma + e.ultimo.puntaje, 0) / conUltimo.length)
    : 0

  return {
    hitos,
    maximo,
    esVelocidadLectora: vl,
    estudiantes: estudiantesReporte,
    comparativa,
    conteo,
    totalConResultado: conUltimo.length,
    totalAlumnos: alumnos.length,
    promedio,
    promedioPct: maximo ? Math.round((promedio / maximo) * 100) : 0
  }
}

export function useReportes() {
  const { usuario, rol } = useAuth()
  const toast = useToast()

  const [cursos, setCursos] = useState([])
  const [desafios, setDesafios] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(true)

  const [cursoId, setCursoId] = useState('')
  const [desafioId, setDesafioId] = useState('')

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

  const cursosDelProfesor =
    rol === 'profesor'
      ? cursos.filter(curso => curso.profesores?.includes(usuario?.uid)).map(curso => curso.id)
      : null

  const cursosDisponibles = cursosDelProfesor
    ? cursos.filter(curso => cursosDelProfesor.includes(curso.id))
    : cursos

  const curso = cursos.find(item => item.id === cursoId) || null
  const desafio = desafios.find(item => item.id === desafioId) || null

  const reporte = useMemo(
    () =>
      cursoId && desafioId
        ? construirReporte({
            cursoId,
            desafio: desafios.find(item => item.id === desafioId) || null,
            evaluaciones,
            resultados,
            estudiantes
          })
        : null,
    [cursoId, desafioId, desafios, evaluaciones, resultados, estudiantes]
  )

  return {
    cargando,
    cursosDisponibles,
    desafios,
    cursoId,
    setCursoId,
    desafioId,
    setDesafioId,
    curso,
    desafio,
    reporte
  }
}
