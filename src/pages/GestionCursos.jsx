import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'

import { Link } from 'react-router-dom'
import { db } from '../config'
import './GestionCursos.css'

function GestionCursos() {

  const [curso, setCurso] = useState('')
  const [cursos, setCursos] = useState([])
  const [usuarios, setUsuarios] = useState([])

  const [cursoEditar, setCursoEditar] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [profesor, setProfesor] = useState('')

  const cargarCursos = async () => {
    const datos = await getDocs(collection(db, 'cursos'))

    const lista = datos.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setCursos(lista)
  }

  const cargarUsuarios = async () => {
    const datos = await getDocs(collection(db, 'usuarios'))

    const lista = datos.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setUsuarios(lista)
  }

  useEffect(() => {
    cargarCursos()
    cargarUsuarios()
  }, [])

  const registrarCurso = async (e) => {
    e.preventDefault()

    await addDoc(collection(db, 'cursos'), {
      nombre_curso: curso,
      profesores: []
    })

    setCurso('')
    cargarCursos()

    alert('Curso registrado correctamente')
  }

  const eliminarCurso = async (id) => {
    const confirmar = window.confirm(
      '¿Está seguro de eliminar este curso?'
    )

    if (confirmar) {
      await deleteDoc(doc(db, 'cursos', id))

      cargarCursos()

      alert('Curso eliminado correctamente')
    }
  }

  const seleccionarEditar = (item) => {
    setCursoEditar(item)
    setNuevoNombre(item.nombre_curso)
    setProfesor('')
  }

  const guardarNombreCurso = async (e) => {
    e.preventDefault()

    await updateDoc(
      doc(db, 'cursos', cursoEditar.id),
      {
        nombre_curso: nuevoNombre
      }
    )

    setCursoEditar({
      ...cursoEditar,
      nombre_curso: nuevoNombre
    })

    cargarCursos()

    alert('Nombre actualizado')
  }

  const agregarProfesor = async () => {
    if (profesor === '') {
      alert('Seleccione un profesor')
      return
    }

    await updateDoc(
      doc(db, 'cursos', cursoEditar.id),
      {
        profesores: arrayUnion(profesor)
      }
    )

    const profesoresActualizados = [
      ...(cursoEditar.profesores || [])
    ]

    if (!profesoresActualizados.includes(profesor)) {
      profesoresActualizados.push(profesor)
    }

    setCursoEditar({
      ...cursoEditar,
      profesores: profesoresActualizados
    })

    setProfesor('')

    cargarCursos()
  }

  const quitarProfesor = async (idProfesor) => {
    await updateDoc(
      doc(db, 'cursos', cursoEditar.id),
      {
        profesores: arrayRemove(idProfesor)
      }
    )

    setCursoEditar({
      ...cursoEditar,
      profesores: cursoEditar.profesores.filter(
        (id) => id !== idProfesor
      )
    })

    cargarCursos()
  }

  const obtenerNombreProfesor = (id) => {
    const usuario = usuarios.find(
      (item) => item.id === id
    )

    if (usuario) {
      return `${usuario.nombre} ${usuario.apellido}`
    }

    return 'Profesor no encontrado'
  }

  return (
    <div className="pagina-cursos">

      <h1>Gestión de Cursos</h1>

      <Link className="volver" to="/admin">
        Volver al Dashboard
      </Link>

      <section className="seccion-cursos">

        <h2>Registrar curso</h2>

        <form
          className="formulario-cursos"
          onSubmit={registrarCurso}
        >

          <div>
            <label>Curso</label>

            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
            >
              <option value="">Seleccione un curso</option>
              <option value="1° Básico">1° Básico</option>
              <option value="2° Básico">2° Básico</option>
              <option value="3° Básico">3° Básico</option>
              <option value="4° Básico">4° Básico</option>
              <option value="5° Básico">5° Básico</option>
              <option value="6° Básico">6° Básico</option>
  
            </select>
          </div>

          <button type="submit">
            Agregar curso
          </button>

        </form>

      </section>

      {cursoEditar && (

        <section className="seccion-cursos">

          <h2>Editar curso</h2>

          <form
            className="formulario-editar"
            onSubmit={guardarNombreCurso}
          >

            <select
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            >
              <option value="1° Básico">1° Básico</option>
              <option value="2° Básico">2° Básico</option>
              <option value="3° Básico">3° Básico</option>
              <option value="4° Básico">4° Básico</option>
              <option value="5° Básico">5° Básico</option>
              <option value="6° Básico">6° Básico</option>

            </select>

            <button type="submit">
              Guardar nombre
            </button>

          </form>

          <h3>Profesores asignados</h3>

          {cursoEditar.profesores &&
          cursoEditar.profesores.length > 0 ? (

            <ul>
              {cursoEditar.profesores.map((idProfesor) => (
                <li key={idProfesor}>

                  {obtenerNombreProfesor(idProfesor)}

                  <button
                    type="button"
                    onClick={() => quitarProfesor(idProfesor)}
                  >
                    Quitar
                  </button>

                </li>
              ))}
            </ul>

          ) : (

            <p>No hay profesores asignados.</p>

          )}

          <h3>Agregar profesor</h3>

          <div className="formulario-profesor">

            <select
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
            >
              <option value="">
                Seleccione un profesor
              </option>

              {usuarios
                .filter((item) => item.rol === 'profesor')
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nombre} {item.apellido}
                  </option>
                ))
              }

            </select>

            <button
              type="button"
              onClick={agregarProfesor}
            >
              Agregar profesor
            </button>

          </div>

          <br />

          <button
            type="button"
            onClick={() => setCursoEditar(null)}
          >
            Cerrar edición
          </button>

        </section>

      )}

      <section className="seccion-cursos">

        <h2>Cursos registrados</h2>

        <div className="tabla-contenedor">

          <table className="tabla-cursos">

            <thead>
              <tr>
                <th>Curso</th>
                <th>Profesores</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {cursos.map((item) => (

                <tr key={item.id}>

                  <td>{item.nombre_curso}</td>

                  <td>

                    {item.profesores &&
                    item.profesores.length > 0 ? (

                      item.profesores.map((idProfesor) => (
                        <div key={idProfesor}>
                          {obtenerNombreProfesor(idProfesor)}
                        </div>
                      ))

                    ) : (

                      'Sin profesores'

                    )}

                  </td>

                  <td>

                    <div className="botones-cursos">

                      <button
                        onClick={() => seleccionarEditar(item)}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarCurso(item.id)}
                      >
                        Eliminar
                      </button>

                    </div>

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

export default GestionCursos