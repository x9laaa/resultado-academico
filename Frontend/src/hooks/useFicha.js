import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/NotificacionesContext'

import { obtenerCursos } from '../services/cursoService'
import { obtenerDesafios } from '../services/desafioService'
import { obtenerEvaluaciones } from '../services/evaluacionService'
import { obtenerEstudiantes } from '../services/estudianteService'
import { obtenerResultados } from '../services/resultadoService'

import { convertirFecha } from '../utils/fecha'
import { ORDEN_NIVELES, puntajeMaximoDesafio, calcularPuntaje, calcularNivel } from '../utils/desempeno'

function construirFicha({ estudiante, cursos, desafios, evaluaciones, resultados }) {
  if (!estudiante) return null

  const evalPorId = Object.fromEntries(evaluaciones.map(e => [e.id, e]))
  const desafioPorId = Object.fromEntries(desafios.map(d => [d.id, d]))
  const cursoNombre = cursos.find(c => c.id === estudiante.id_curso)?.nombre_curso || 'Curso'

  const mios = resultados
    .filter(r => r.id_estudiante === estudiante.id)
    .map(r => {
      const evaluacion = evalPorId[r.id_evaluacion]
      const desafio = evaluacion ? desafioPorId[evaluacion.id_desafio] : null
      if (!evaluacion || !desafio) return null

      const puntaje = Number(r.puntaje_obtenido ?? calcularPuntaje(desafio, r)) || 0

      return {
        idResultado: r.id,
        hitoId: evaluacion.id,
        fecha: evaluacion.fecha_aplicacion,
        desafio,
        puntaje,
        nivel: r.nivel_desempeno || calcularNivel(desafio, puntaje)
      }
    })
    .filter(Boolean)

  const porDesafio = {}
  mios.forEach(item => {
    porDesafio[item.desafio.id] = porDesafio[item.desafio.id] || { desafio: item.desafio, items: [] }
    porDesafio[item.desafio.id].items.push(item)
  })

  const bloques = Object.values(porDesafio)
    .map(({ desafio, items }) => {
      const serie = [...items]
        .sort((a, b) => convertirFecha(a.fecha) - convertirFecha(b.fecha))
        .map(({ hitoId, fecha, puntaje, nivel }) => ({ hitoId, fecha, puntaje, nivel }))

      return {
        id: desafio.id,
        nombre: desafio.nombre,
        tipo: desafio.tipo,
        maximo: puntajeMaximoDesafio(desafio),
        adecuadoDesde: Number(desafio.adecuado_desde),
        logradoDesde: Number(desafio.logrado_desde),
        serie,
        ultimo: serie[serie.length - 1]
      }
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const historial = mios
    .map(item => ({
      id: item.idResultado,
      fecha: item.fecha,
      desafio: item.desafio.nombre,
      tipo: item.desafio.tipo,
      puntaje: item.puntaje,
      maximo: puntajeMaximoDesafio(item.desafio),
      nivel: item.nivel
    }))
    .sort((a, b) => convertirFecha(b.fecha) - convertirFecha(a.fecha))

  const conteo = ORDEN_NIVELES.reduce((acc, nivel) => ({ ...acc, [nivel]: 0 }), {})
  historial.forEach(h => {
    if (conteo[h.nivel] !== undefined) conteo[h.nivel] += 1
  })

  return {
    estudiante: {
      id: estudiante.id,
      nombre: `${estudiante.nombre} ${estudiante.apellido}`,
      curso: cursoNombre
    },
    bloques,
    historial,
    conteo,
    totalRendidas: historial.length
  }
}

export function useFicha() {
  const { usuario, rol } = useAuth()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const autoRef = useRef(false)

  const [cursos, setCursos] = useState([])
  const [desafios, setDesafios] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(true)

  const [cursoId, setCursoId] = useState('')
  const [estudianteId, setEstudianteId] = useState('')

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

  useEffect(() => {
    if (autoRef.current || cargando) return

    const id = searchParams.get('estudiante')
    if (!id) return

    const estudiante = estudiantes.find(e => e.id === id)
    if (estudiante) {
      autoRef.current = true
      setCursoId(estudiante.id_curso)
      setEstudianteId(id)

      const limpio = new URLSearchParams(searchParams)
      limpio.delete('estudiante')
      setSearchParams(limpio, { replace: true })
    }
  }, [cargando, estudiantes, searchParams, setSearchParams])

  const cursosProfesor =
    rol === 'profesor'
      ? cursos.filter(curso => curso.profesores?.includes(usuario?.uid)).map(curso => curso.id)
      : null

  const cursosDisponibles = cursosProfesor
    ? cursos.filter(curso => cursosProfesor.includes(curso.id))
    : cursos

  const estudiantesDelCurso = estudiantes
    .filter(e => e.id_curso === cursoId)
    .sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`))

  const seleccionarCurso = id => {
    setCursoId(id)
    setEstudianteId('')
  }

  const ficha = useMemo(
    () =>
      estudianteId
        ? construirFicha({
            estudiante: estudiantes.find(e => e.id === estudianteId) || null,
            cursos,
            desafios,
            evaluaciones,
            resultados
          })
        : null,
    [estudianteId, estudiantes, cursos, desafios, evaluaciones, resultados]
  )

  return {
    cargando,
    cursosDisponibles,
    estudiantesDelCurso,
    cursoId,
    estudianteId,
    setEstudianteId,
    seleccionarCurso,
    ficha
  }
}
