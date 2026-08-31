import Pagina from '../components/common/Pagina'
import Campo from '../components/common/Campo'
import Tabla from '../components/common/Tabla'
import { useGestionEvaluaciones } from '../hooks/useGestionEvaluaciones'
import './GestionEvaluaciones.css'

function GestionEvaluaciones() {
  const {
    cursos,
    desafios,
    evaluaciones,
    curso,
    setCurso,
    desafio,
    setDesafio,
    fechaAplicacion,
    setFechaAplicacion,
    anio,
    setAnio,
    registrarEvaluacion,
    obtenerCurso,
    obtenerDesafio
  } = useGestionEvaluaciones()

  const columnas = [
    { titulo: 'Curso', render: item => obtenerCurso(item.id_curso) },
    { titulo: 'Desafío', render: item => obtenerDesafio(item.id_desafio) },
    { titulo: 'Fecha', render: item => item.fecha_aplicacion },
    { titulo: 'Año', render: item => item.anio }
  ]

  return (
    <Pagina className="pagina-evaluaciones" titulo="Gestión de Evaluaciones">
      <section className="seccion-evaluaciones">
        <h2>Registrar evaluación</h2>

        <form className="formulario-evaluaciones" onSubmit={registrarEvaluacion}>
          <Campo label="Curso">
            <select value={curso} onChange={e => setCurso(e.target.value)} required>
              <option value="">Seleccione un curso</option>
              {cursos.map(item => (
                <option key={item.id} value={item.id}>{item.nombre_curso}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Desafío">
            <select value={desafio} onChange={e => setDesafio(e.target.value)} required>
              <option value="">Seleccione un desafío</option>
              {desafios.map(item => (
                <option key={item.id} value={item.id}>{item.nombre} - {item.tipo}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Fecha de aplicación">
            <input type="date" value={fechaAplicacion} onChange={e => setFechaAplicacion(e.target.value)} required />
          </Campo>

          <Campo label="Año">
            <input type="number" value={anio} onChange={e => setAnio(e.target.value)} required />
          </Campo>

          <button type="submit">Registrar evaluación</button>
        </form>
      </section>

      <section className="seccion-evaluaciones">
        <h2>Evaluaciones registradas</h2>

        <Tabla
          className="tabla-evaluaciones"
          columnas={columnas}
          datos={evaluaciones}
          vacio="No hay evaluaciones registradas."
        />
      </section>
    </Pagina>
  )
}

export default GestionEvaluaciones
