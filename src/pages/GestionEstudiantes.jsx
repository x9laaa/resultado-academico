import Pagina from '../components/common/Pagina'
import Campo from '../components/common/Campo'
import Tabla from '../components/common/Tabla'
import { useGestionEstudiantes } from '../hooks/useGestionEstudiantes'
import './GestionEstudiantes.css'

function GestionEstudiantes() {
  const {
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
    obtenerNombreCurso
  } = useGestionEstudiantes()

  const columnas = [
    { titulo: 'Nombre', render: item => item.nombre },
    { titulo: 'Apellido', render: item => item.apellido },
    { titulo: 'Curso', render: item => obtenerNombreCurso(item.id_curso) },
    {
      titulo: 'Acciones',
      render: item => (
        <>
          <button type="button" onClick={() => seleccionarEditar(item)}>Editar</button>
          <button type="button" onClick={() => eliminarEstudianteActual(item.id)}>Eliminar</button>
        </>
      )
    }
  ]

  return (
    <Pagina className="pagina-estudiantes" titulo="Gestión de Estudiantes">
      <section className="seccion-estudiantes">
        <h2>{estudianteEditar ? 'Editar estudiante' : 'Registrar estudiante'}</h2>

        <form className="formulario-estudiantes" onSubmit={guardar}>
          <Campo label="Nombre">
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </Campo>

          <Campo label="Apellido">
            <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
          </Campo>

          <Campo label="Curso">
            <select value={curso} onChange={e => setCurso(e.target.value)} required>
              <option value="">Seleccione un curso</option>
              {cursos.map(item => (
                <option key={item.id} value={item.id}>{item.nombre_curso}</option>
              ))}
            </select>
          </Campo>

          <button type="submit">{estudianteEditar ? 'Guardar cambios' : 'Registrar estudiante'}</button>
          {estudianteEditar && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
        </form>
      </section>

      <section className="seccion-estudiantes">
        <h2>Estudiantes registrados</h2>

        <Tabla
          className="tabla-estudiantes"
          columnas={columnas}
          datos={estudiantes}
          vacio="No hay estudiantes registrados."
        />
      </section>
    </Pagina>
  )
}

export default GestionEstudiantes
