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
    formulario,
    cambiarCampo,
    evaluacionEditar,
    procesando,
    guardar,
    seleccionarEditar,
    limpiarFormulario,
    eliminarEvaluacionActual,
    obtenerCurso,
    obtenerDesafio
  } = useGestionEvaluaciones()

  const columnas = [
    { titulo: 'Curso', render: item => obtenerCurso(item.id_curso) },
    { titulo: 'Desafío', render: item => obtenerDesafio(item.id_desafio) },
    { titulo: 'Fecha', render: item => item.fecha_aplicacion },
    {
      titulo: 'Acciones',
      render: item => (
        <div className="acciones-evaluacion">
          <button type="button" onClick={() => seleccionarEditar(item)} disabled={procesando}>
            Editar
          </button>
          <button type="button" onClick={() => eliminarEvaluacionActual(item)} disabled={procesando}>
            Eliminar
          </button>
        </div>
      )
    }
  ]

  return (
    <Pagina className="pagina-evaluaciones" titulo="Gestión de Evaluaciones">
      <section className="seccion-evaluaciones">
        <h2>{evaluacionEditar ? 'Editar evaluación' : 'Registrar evaluación'}</h2>

        <form className="formulario-evaluaciones" onSubmit={guardar}>
          <Campo label="Curso" htmlFor="eval-curso">
            <select
              id="eval-curso"
              value={formulario.id_curso}
              onChange={e => cambiarCampo('id_curso', e.target.value)}
              required
            >
              <option value="">Seleccione un curso</option>
              {cursos.map(item => (
                <option key={item.id} value={item.id}>{item.nombre_curso}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Desafío" htmlFor="eval-desafio">
            <select
              id="eval-desafio"
              value={formulario.id_desafio}
              onChange={e => cambiarCampo('id_desafio', e.target.value)}
              required
            >
              <option value="">Seleccione un desafío</option>
              {desafios.map(item => (
                <option key={item.id} value={item.id}>{item.nombre} - {item.tipo}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Fecha de aplicación" htmlFor="eval-fecha">
            <input
              id="eval-fecha"
              type="date"
              value={formulario.fecha_aplicacion}
              onChange={e => cambiarCampo('fecha_aplicacion', e.target.value)}
              required
            />
          </Campo>

          <div className="acciones-evaluacion">
            <button type="submit" disabled={procesando}>
              {evaluacionEditar ? 'Guardar cambios' : 'Registrar evaluación'}
            </button>
            {evaluacionEditar && (
              <button type="button" className="boton-secundario" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
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
