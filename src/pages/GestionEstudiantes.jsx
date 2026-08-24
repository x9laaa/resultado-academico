import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import './GestionEstudiantes.css'

function GestionEstudiantes() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [curso, setCurso] = useState('')
  const [estudiantes, setEstudiantes] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudianteEditar, setEstudianteEditar] = useState(null)

  const cargarEstudiantes = async () => {
    const datos = await getDocs(collection(db, 'estudiantes'))
    const lista = datos.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    setEstudiantes(lista)
  }

  const cargarCursos = async () => {
    const datos = await getDocs(collection(db, 'cursos'))
    const lista = datos.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    setCursos(lista)
  }

  useEffect(() => {
    cargarEstudiantes()
    cargarCursos()
  }, [])

  const registrarEstudiante = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'estudiantes'), {
      nombre: nombre,
      apellido: apellido,
      id_curso: curso
    })
    setNombre('')
    setApellido('')
    setCurso('')
    cargarEstudiantes()
    alert('Estudiante registrado correctamente')
  }

  const seleccionarEditar = (item) => {
    setEstudianteEditar(item)
    setNombre(item.nombre)
    setApellido(item.apellido)
    setCurso(item.id_curso)
  }

  const guardarCambios = async (e) => {
    e.preventDefault()
    await updateDoc(
      doc(db, 'estudiantes', estudianteEditar.id),
      {
        nombre: nombre,
        apellido: apellido,
        id_curso: curso
      }
    )
    setEstudianteEditar(null)
    setNombre('')
    setApellido('')
    setCurso('')
    cargarEstudiantes()
    alert('Estudiante actualizado correctamente')
  }

  const cancelarEdicion = () => {
    setEstudianteEditar(null)
    setNombre('')
    setApellido('')
    setCurso('')
  }

  const eliminarEstudiante = async (id) => {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este estudiante?'
    )
    if (confirmar) {
      await deleteDoc(doc(db, 'estudiantes', id))
      cargarEstudiantes()
      alert('Estudiante eliminado correctamente')
    }
  }

  const obtenerNombreCurso = (id) => {
    const cursoEncontrado = cursos.find(
      (item) => item.id === id
    )
    if (cursoEncontrado) {
      return cursoEncontrado.nombre_curso
    }
    return 'Curso no encontrado'
  }

  return (
    <div className="pagina-estudiantes">
      <h1>Gestión de Estudiantes</h1>
      <Link className="volver" to="/admin">
        Volver al Dashboard
      </Link>
      <section className="seccion-estudiantes">
        <h2>
          {estudianteEditar
            ? 'Editar estudiante'
            : 'Registrar estudiante'}
        </h2>
        <form
          className="formulario-estudiantes"
          onSubmit={
            estudianteEditar
              ? guardarCambios
              : registrarEstudiante
          }
        >
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Curso</label>
            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
            >
              <option value="">Seleccione un curso</option>
              {cursos.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.nombre_curso}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">
            {estudianteEditar
              ? 'Guardar cambios'
              : 'Registrar estudiante'}
          </button>
          {estudianteEditar && (
            <button
              type="button"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </form>
      </section>
      <section className="seccion-estudiantes">
        <h2>Estudiantes registrados</h2>
        <div className="tabla-contenedor">
          <table className="tabla-estudiantes">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Curso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.apellido}</td>
                  <td>{obtenerNombreCurso(item.id_curso)}</td>
                  <td>
                    <button
                      onClick={() => seleccionarEditar(item)}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarEstudiante(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default GestionEstudiantes