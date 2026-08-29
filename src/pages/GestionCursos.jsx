import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import Navbar from '../components/Navbar'
import './GestionCursos.css'

function GestionCursos() {
  const [curso, setCurso] = useState('')
  const [cursos, setCursos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [cursoEditar, setCursoEditar] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [profesor, setProfesor] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [cursosData, usuariosData, estudiantesData] = await Promise.all([
        getDocs(collection(db, 'cursos')),
        getDocs(collection(db, 'usuarios')),
        getDocs(collection(db, 'estudiantes'))
      ])

      setCursos(cursosData.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setUsuarios(usuariosData.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setEstudiantes(estudiantesData.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error(error)
      alert('Error al cargar los datos')
    }
  }

  const registrarCurso = async e => {
    e.preventDefault()
    if (!curso.trim()) return alert('Ingrese un nombre de curso')

    try {
      await addDoc(collection(db, 'cursos'), { nombre_curso: curso.trim(), profesores: [] })
      setCurso('')
      await cargarDatos()
      alert('Curso registrado correctamente')
    } catch (error) {
      console.error(error)
      alert('Error al registrar el curso')
    }
  }

  const eliminarCurso = async id => {
    if (!window.confirm('¿Está seguro de eliminar este curso?')) return

    try {
      await deleteDoc(doc(db, 'cursos', id))
      await cargarDatos()
      alert('Curso eliminado correctamente')
    } catch (error) {
      console.error(error)
      alert('Error al eliminar el curso')
    }
  }

  const seleccionarEditar = curso => {
    setCursoEditar(curso)
    setNuevoNombre(curso.nombre_curso)
    setProfesor('')
  }

  const guardarNombreCurso = async e => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return alert('Ingrese un nombre de curso')

    try {
      await updateDoc(doc(db, 'cursos', cursoEditar.id), { nombre_curso: nuevoNombre.trim() })
      setCursoEditar(prev => ({ ...prev, nombre_curso: nuevoNombre.trim() }))
      await cargarDatos()
      alert('Nombre actualizado')
    } catch (error) {
      console.error(error)
      alert('Error al actualizar el curso')
    }
  }

  const agregarProfesor = async () => {
    if (!profesor) return alert('Seleccione un profesor')

    try {
      await updateDoc(doc(db, 'cursos', cursoEditar.id), { profesores: arrayUnion(profesor) })
      setCursoEditar(prev => ({ ...prev, profesores: [...new Set([...(prev.profesores || []), profesor])] }))
      setProfesor('')
      await cargarDatos()
    } catch (error) {
      console.error(error)
      alert('Error al agregar el profesor')
    }
  }

  const quitarProfesor = async idProfesor => {
    try {
      await updateDoc(doc(db, 'cursos', cursoEditar.id), { profesores: arrayRemove(idProfesor) })
      setCursoEditar(prev => ({ ...prev, profesores: (prev.profesores || []).filter(id => id !== idProfesor) }))
      await cargarDatos()
    } catch (error) {
      console.error(error)
      alert('Error al quitar el profesor')
    }
  }

  const obtenerNombreProfesor = id => {
    const usuario = usuarios.find(item => item.id === id)
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Profesor no encontrado'
  }

  const obtenerEstudiantesCurso = idCurso => estudiantes.filter(estudiante => estudiante.id_curso === idCurso)

  const profesores = usuarios.filter(item => item.rol === 'profesor')

  return (
    <>
      <Navbar />

      <div className="pagina-cursos">
        <h1>Gestión de Cursos</h1>

        <Link className="volver" to="/admin">Volver al Dashboard</Link>

        <section className="seccion-cursos">
          <h2>Registrar curso</h2>

          <form className="formulario-cursos" onSubmit={registrarCurso}>
            <input type="text" value={curso} onChange={e => setCurso(e.target.value)} placeholder="Ej: 3° Medio G" required />
            <button type="submit">Agregar curso</button>
          </form>
        </section>

        {cursoEditar && (
          <section className="seccion-cursos">
            <div className="encabezado-edicion">
              <h2>Editar: {cursoEditar.nombre_curso}</h2>
              <button type="button" onClick={() => setCursoEditar(null)}>Cerrar</button>
            </div>

            <form className="formulario-editar" onSubmit={guardarNombreCurso}>
              <input type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required />
              <button type="submit">Guardar nombre</button>
            </form>

            <div className="grid-edicion">

              <div>
                <h3>Profesores</h3>

                {cursoEditar.profesores?.length > 0 ? (
                  <ul className="lista-compacta">
                    {cursoEditar.profesores.map(id => (
                      <li key={id}>
                        <span>{obtenerNombreProfesor(id)}</span>
                        <button type="button" onClick={() => quitarProfesor(id)}>Quitar</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Sin profesores asignados.</p>
                )}

                <div className="formulario-profesor">
                  <select value={profesor} onChange={e => setProfesor(e.target.value)}>
                    <option value="">Seleccione profesor</option>

                    {profesores.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} {item.apellido}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={agregarProfesor}>Agregar</button>
                </div>
              </div>

              <div>
                <h3>
                  Estudiantes ({obtenerEstudiantesCurso(cursoEditar.id).length})
                </h3>

                {obtenerEstudiantesCurso(cursoEditar.id).length > 0 ? (
                  <div className="estudiantes-compactos">
                    {obtenerEstudiantesCurso(cursoEditar.id).map((estudiante, index) => (
                      <div className="estudiante-item" key={estudiante.id}>
                        <span>{index + 1}.</span>
                        <span>{estudiante.nombre} {estudiante.apellido}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Sin estudiantes registrados.</p>
                )}
              </div>

            </div>
          </section>
        )}

        <section className="seccion-cursos">
          <h2>Cursos registrados</h2>

          <div className="tabla-contenedor">
            <table className="tabla-cursos">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Estudiantes</th>
                  <th>Profesores</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map(item => {
                  const estudiantesCurso = obtenerEstudiantesCurso(item.id)

                  return (
                    <tr key={item.id}>
                      <td>{item.nombre_curso}</td>
                      <td>{estudiantesCurso.length}</td>

                      <td>
                        {item.profesores?.length > 0
                          ? item.profesores.map(id => <div key={id}>{obtenerNombreProfesor(id)}</div>)
                          : 'Sin profesores'}
                      </td>

                      <td>
                        <div className="botones-cursos">
                          <button onClick={() => seleccionarEditar(item)}>Editar</button>
                          <button onClick={() => eliminarCurso(item.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

export default GestionCursos