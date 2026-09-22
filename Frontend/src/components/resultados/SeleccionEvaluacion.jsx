import FiltrosEvaluaciones from './FiltrosEvaluaciones'
import EvaluacionItem from './EvaluacionItem'

function SeleccionEvaluacion({
  cursosConEvaluacion,
  desafiosDisponibles,
  cursoFiltro,
  desafioFiltro,
  busqueda,
  onCursoChange,
  onDesafioChange,
  onBusquedaChange,
  evaluacionesFiltradas,
  cantidadAlumnos,
  cantidadResultados,
  obtenerDesafio,
  obtenerCurso,
  onSeleccionar
}) {
  return (
    <section className="seccion-resultados">
      <h2>Seleccionar evaluación</h2>

      <FiltrosEvaluaciones
        cursos={cursosConEvaluacion}
        desafios={desafiosDisponibles}
        curso={cursoFiltro}
        desafio={desafioFiltro}
        busqueda={busqueda}
        onCursoChange={onCursoChange}
        onDesafioChange={onDesafioChange}
        onBusquedaChange={onBusquedaChange}
      />

      <p className="resumen-evaluaciones">
        {evaluacionesFiltradas.length} evaluación(es) encontrada(s)
      </p>

      <div className="lista-evaluaciones">
        {evaluacionesFiltradas.length > 0 ? (
          evaluacionesFiltradas.map(item => (
            <EvaluacionItem
              key={item.id}
              evaluacion={item}
              desafio={obtenerDesafio(item.id_desafio)}
              curso={obtenerCurso(item.id_curso)}
              total={cantidadAlumnos[item.id_curso] || 0}
              registrados={cantidadResultados[item.id] || 0}
              onSeleccionar={onSeleccionar}
            />
          ))
        ) : (
          <p className="sin-evaluaciones">No se encontraron evaluaciones.</p>
        )}
      </div>
    </section>
  )
}

export default SeleccionEvaluacion
