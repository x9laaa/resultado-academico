import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import './GestionEstudiantes.css'
import Navbar from '../components/Navbar'

function GestionEstudiantes() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [curso, setCurso] = useState('')
  const [estudiantes, setEstudiantes] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudianteEditar, setEstudianteEditar] = useState(null)

  useEffect(() => {
    cargarEstudiantes()
    cargarCursos()
  }, [])

  const cargarColeccion = async nombreColeccion => {
    const datos = await getDocs(collection(db, nombreColeccion))
    return datos.docs.map(item => ({ id: item.id, ...item.data() }))
  }

  const cargarEstudiantes = async () => setEstudiantes(await cargarColeccion('estudiantes'))
  const cargarCursos = async () => setCursos(await cargarColeccion('cursos'))

  const limpiarFormulario = () => {
    setNombre('')
    setApellido('')
    setCurso('')
    setEstudianteEditar(null)
  }

  const registrarEstudiante = async e => {
    e.preventDefault()

    await addDoc(collection(db, 'estudiantes'), { nombre, apellido, id_curso: curso })

    alert('Estudiante registrado correctamente')
    limpiarFormulario()
    cargarEstudiantes()
  }

  const seleccionarEditar = item => {
    setEstudianteEditar(item)
    setNombre(item.nombre)
    setApellido(item.apellido)
    setCurso(item.id_curso)
  }

  const guardarCambios = async e => {
    e.preventDefault()

    await updateDoc(doc(db, 'estudiantes', estudianteEditar.id), { nombre, apellido, id_curso: curso })

    alert('Estudiante actualizado correctamente')
    limpiarFormulario()
    cargarEstudiantes()
  }

  const eliminarEstudiante = async id => {
    const confirmar = window.confirm('¿Está seguro de eliminar este estudiante?')
    if (!confirmar) return

    await deleteDoc(doc(db, 'estudiantes', id))

    alert('Estudiante eliminado correctamente')
    cargarEstudiantes()
  }

  const obtenerNombreCurso = id => cursos.find(item => item.id === id)?.nombre_curso || 'Curso no encontrado'

  return (
    <>
      <Navbar />


      <div className="pagina-estudiantes">
        <h1>Gestión de Estudiantes</h1>
  
        <section className="seccion-estudiantes">
          <h2>{estudianteEditar ? 'Editar estudiante' : 'Registrar estudiante'}</h2>

          <form className="formulario-estudiantes" onSubmit={estudianteEditar ? guardarCambios : registrarEstudiante}>
            <div>
              <label>Nombre</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>

            <div>
              <label>Apellido</label>
              <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
            </div>

            <div>
              <label>Curso</label>
              <select value={curso} onChange={e => setCurso(e.target.value)} required>
                <option value="">Seleccione un curso</option>
                {cursos.map(item => (
                  <option key={item.id} value={item.id}>{item.nombre_curso}</option>
                ))}
              </select>
            </div>

            <button type="submit">{estudianteEditar ? 'Guardar cambios' : 'Registrar estudiante'}</button>
            {estudianteEditar && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
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
                {estudiantes.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.apellido}</td>
                    <td>{obtenerNombreCurso(item.id_curso)}</td>
                    <td>
                      <button type="button" onClick={() => seleccionarEditar(item)}>Editar</button>
                      <button type="button" onClick={() => eliminarEstudiante(item.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

export default GestionEstudiantes
