import { useState, useEffect } from 'react'
import {
  obtenerCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  agregarProfesorCurso,
  quitarProfesorCurso
} from '../services/cursoService'
import { obtenerEstudiantes } from '../services/estudianteService'
import { obtenerUsuarios } from '../services/usuarioService'
import { useToast, useConfirmar } from '../context/NotificacionesContext'

export function useGestionCursos() {
  const toast = useToast()
  const confirmar = useConfirmar()

  const [curso, setCurso] = useState('')
  const [cursos, setCursos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [cursoEditar, setCursoEditar] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [profesor, setProfesor] = useState('')

  const cargarDatos = async () => {
    try {
      const [cursosData, usuariosData, estudiantesData] = await Promise.all([
        obtenerCursos(),
        obtenerUsuarios(),
        obtenerEstudiantes()
      ])

      setCursos(cursosData)
      setUsuarios(usuariosData)
      setEstudiantes(estudiantesData)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar los datos')
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ejecutar = async (accion, errorMsg, okMsg) => {
    try {
      await accion()
      await cargarDatos()
      if (okMsg) toast.exito(okMsg)
      return true
    } catch (error) {
      console.error(error)
      toast.error(errorMsg)
      return false
    }
  }

  const registrarCurso = async e => {
    e.preventDefault()
    if (!curso.trim()) return toast.error('Ingrese un nombre de curso')

    const ok = await ejecutar(
      () => crearCurso({ nombre_curso: curso }),
      'Error al registrar el curso',
      'Curso registrado correctamente'
    )
    if (ok) setCurso('')
  }

  const eliminarCursoActual = async id => {
    const ok = await confirmar({
      mensaje: '¿Está seguro de eliminar este curso?',
      textoConfirmar: 'Eliminar',
      peligro: true
    })
    if (!ok) return
    await ejecutar(() => eliminarCurso(id), 'Error al eliminar el curso', 'Curso eliminado correctamente')
  }

  const seleccionarEditar = curso => {
    setCursoEditar(curso)
    setNuevoNombre(curso.nombre_curso)
    setProfesor('')
  }

  const guardarNombreCurso = async e => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return toast.error('Ingrese un nombre de curso')

    const ok = await ejecutar(
      () => actualizarCurso(cursoEditar.id, { nombre_curso: nuevoNombre.trim() }),
      'Error al actualizar el curso',
      'Nombre actualizado'
    )
    if (ok) setCursoEditar(prev => ({ ...prev, nombre_curso: nuevoNombre.trim() }))
  }

  const agregarProfesor = async () => {
    if (!profesor) return toast.error('Seleccione un profesor')

    const ok = await ejecutar(
      () => agregarProfesorCurso(cursoEditar.id, profesor),
      'Error al agregar el profesor'
    )
    if (!ok) return

    setCursoEditar(prev => ({ ...prev, profesores: [...new Set([...(prev.profesores || []), profesor])] }))
    setProfesor('')
  }

  const quitarProfesor = async idProfesor => {
    const ok = await ejecutar(
      () => quitarProfesorCurso(cursoEditar.id, idProfesor),
      'Error al quitar el profesor'
    )
    if (ok) setCursoEditar(prev => ({ ...prev, profesores: (prev.profesores || []).filter(id => id !== idProfesor) }))
  }

  const obtenerNombreProfesor = id => {
    const usuario = usuarios.find(item => item.id === id)
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Profesor no encontrado'
  }

  const obtenerEstudiantesCurso = idCurso => estudiantes.filter(e => e.id_curso === idCurso)

  return {
    curso,
    setCurso,
    cursos,
    cursoEditar,
    setCursoEditar,
    nuevoNombre,
    setNuevoNombre,
    profesor,
    setProfesor,
    profesores: usuarios.filter(item => item.rol === 'profesor'),
    registrarCurso,
    eliminarCursoActual,
    seleccionarEditar,
    guardarNombreCurso,
    agregarProfesor,
    quitarProfesor,
    obtenerNombreProfesor,
    obtenerEstudiantesCurso
  }
}
