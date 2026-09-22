import Pagina from '../components/common/Pagina'
import Tabla from '../components/common/Tabla'
import EdicionCurso from '../components/cursos/EdicionCurso'
import { useGestionCursos } from '../hooks/useGestionCursos'
import './GestionCursos.css'

function GestionCursos() {
  const {
    curso,
    setCurso,
    cursos,
    cursoEditar,
    setCursoEditar,
    nuevoNombre,
    setNuevoNombre,
    profesor,
    setProfesor,
    profesores,
    registrarCurso,
    eliminarCursoActual,
    seleccionarEditar,
    guardarNombreCurso,
    agregarProfesor,
    quitarProfesor,
    obtenerNombreProfesor,
    obtenerEstudiantesCurso
  } = useGestionCursos()

  const columnas = [
    { titulo: 'Curso', render: item => item.nombre_curso },
    { titulo: 'Estudiantes', render: item => obtenerEstudiantesCurso(item.id).length },
    {
      titulo: 'Profesores',
      render: item =>
        item.profesores?.length > 0
          ? item.profesores.map(id => <div key={id}>{obtenerNombreProfesor(id)}</div>)
          : 'Sin profesores'
    },
    {
      titulo: 'Acciones',
      render: item => (
        <div className="botones-cursos">
          <button onClick={() => seleccionarEditar(item)}>Editar</button>
          <button onClick={() => eliminarCursoActual(item.id)}>Eliminar</button>
        </div>
      )
    }
  ]

  return (
    <Pagina className="pagina-cursos" titulo="Gestión de Cursos">
      <section className="seccion-cursos">
        <h2>Registrar curso</h2>

        <form className="formulario-cursos" onSubmit={registrarCurso}>
          <input
            type="text"
            value={curso}
            onChange={e => setCurso(e.target.value)}
            placeholder="Ej: 3° Medio G"
            required
          />
          <button type="submit">Agregar curso</button>
        </form>
      </section>

      {cursoEditar && (
        <EdicionCurso
          cursoEditar={cursoEditar}
          nuevoNombre={nuevoNombre}
          setNuevoNombre={setNuevoNombre}
          profesor={profesor}
          setProfesor={setProfesor}
          profesores={profesores}
          onCerrar={() => setCursoEditar(null)}
          onGuardarNombre={guardarNombreCurso}
          onAgregarProfesor={agregarProfesor}
          onQuitarProfesor={quitarProfesor}
          obtenerNombreProfesor={obtenerNombreProfesor}
          estudiantesCurso={obtenerEstudiantesCurso(cursoEditar.id)}
        />
      )}

      <section className="seccion-cursos">
        <h2>Cursos registrados</h2>

        <Tabla
          className="tabla-cursos"
          columnas={columnas}
          datos={cursos}
          vacio="No hay cursos registrados."
        />
      </section>
    </Pagina>
  )
}

export default GestionCursos
