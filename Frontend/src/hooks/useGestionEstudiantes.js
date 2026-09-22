import { useState, useEffect } from 'react'
import { obtenerEstudiantes, crearEstudiante, actualizarEstudiante, eliminarEstudiante } from '../services/estudianteService'
import { obtenerCursos } from '../services/cursoService'
import { useToast, useConfirmar } from '../context/NotificacionesContext'

export function useGestionEstudiantes() {
  const toast = useToast()
  const confirmar = useConfirmar()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [curso, setCurso] = useState('')
  const [estudiantes, setEstudiantes] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudianteEditar, setEstudianteEditar] = useState(null)

  const cargarEstudiantes = async () => setEstudiantes(await obtenerEstudiantes())

  useEffect(() => {
    cargarEstudiantes()
    obtenerCursos().then(setCursos)
  }, [])

  const limpiarFormulario = () => {
    setNombre('')
    setApellido('')
    setCurso('')
    setEstudianteEditar(null)
  }

  const guardar = async e => {
    e.preventDefault()

    const datos = { nombre, apellido, id_curso: curso }

    if (estudianteEditar) {
      await actualizarEstudiante(estudianteEditar.id, datos)
      toast.exito('Estudiante actualizado correctamente')
    } else {
      await crearEstudiante(datos)
      toast.exito('Estudiante registrado correctamente')
    }

    limpiarFormulario()
    cargarEstudiantes()
  }

  const seleccionarEditar = item => {
    setEstudianteEditar(item)
    setNombre(item.nombre)
    setApellido(item.apellido)
    setCurso(item.id_curso)
  }

  const eliminarEstudianteActual = async id => {
    const ok = await confirmar({
      mensaje: '¿Está seguro de eliminar este estudiante?',
      textoConfirmar: 'Eliminar',
      peligro: true
    })
    if (!ok) return

    await eliminarEstudiante(id)
    toast.exito('Estudiante eliminado correctamente')
    cargarEstudiantes()
  }

  return {
    nombre,
    setNombre,
    apellido,
    setApellido,
    curso,
    setCurso,
    estudiantes,
    cursos,
    estudianteEditar,
    guardar,
    seleccionarEditar,
    limpiarFormulario,
    eliminarEstudianteActual,
    obtenerNombreCurso: id => cursos.find(item => item.id === id)?.nombre_curso || 'Curso no encontrado'
  }
}
