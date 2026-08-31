import TablaResultados from './TablaResultados'

function DetalleEvaluacion({
  evaluacionSeleccionada,
  desafioSeleccionado,
  esVelocidadLectora,
  puntajeMaximo,
  estudiantes,
  resultados,
  registrados,
  pendientes,
  guardando,
  obtenerCurso,
  onVolver,
  calcularPuntaje,
  calcularNivel,
  cambiarResultado,
  onGuardar
}) {
  const total = estudiantes.length
  const progreso = total ? Math.round((registrados / total) * 100) : 0
  const adecuadoDesde = Number(desafioSeleccionado.adecuado_desde)
  const logradoDesde = Number(desafioSeleccionado.logrado_desde)

  return (
    <section className="seccion-resultados detalle-evaluacion">
      <button type="button" className="volver-link" onClick={onVolver}>
        ← Volver a evaluaciones
      </button>

      <header className="detalle-cabecera">
        <div className="detalle-info">
          <h2>{desafioSeleccionado.nombre}</h2>

          <dl className="detalle-datos">
            <div>
              <dt>Curso</dt>
              <dd>{obtenerCurso(evaluacionSeleccionada.id_curso)}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{desafioSeleccionado.tipo}</dd>
            </div>
            <div>
              <dt>Fecha</dt>
              <dd>{evaluacionSeleccionada.fecha_aplicacion}</dd>
            </div>
            {!esVelocidadLectora && (
              <div>
                <dt>Puntaje máximo</dt>
                <dd>{desafioSeleccionado.puntaje_maximo}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="detalle-avance">
          <strong className="detalle-avance-num">{registrados} / {total}</strong>
          <div
            className="barra-progreso"
            role="progressbar"
            aria-valuenow={progreso}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="barra-progreso-relleno" style={{ width: `${progreso}%` }} />
          </div>
          <span className="detalle-avance-texto">
            {pendientes > 0
              ? `${pendientes} alumno(s) pendiente(s)`
              : 'Todos los resultados registrados'}
          </span>
        </div>
      </header>

      <div className="rangos-resultados">
        <span className="rango-chip nivel-insuficiente">
          Insuficiente · 0 – {adecuadoDesde - 1}
        </span>
        <span className="rango-chip nivel-adecuado">
          Adecuado · {adecuadoDesde} – {logradoDesde - 1}
        </span>
        <span className="rango-chip nivel-logrado">
          Logrado · {logradoDesde} – {puntajeMaximo}
        </span>
      </div>

      {total === 0 ? (
        <p className="detalle-sin-estudiantes">
          Esta evaluación no tiene estudiantes en el curso. Agrégalos en Gestión de Estudiantes.
        </p>
      ) : (
        <>
          <TablaResultados
            estudiantes={estudiantes}
            resultados={resultados}
            desafio={desafioSeleccionado}
            esVelocidadLectora={esVelocidadLectora}
            calcularPuntaje={calcularPuntaje}
            calcularNivel={calcularNivel}
            cambiarResultado={cambiarResultado}
          />

          <div className="barra-guardar">
            <span className="barra-guardar-estado">
              {pendientes > 0
                ? `${pendientes} de ${total} sin registrar`
                : 'Todo listo para guardar'}
            </span>
            <button
              type="button"
              className="boton-guardar"
              onClick={onGuardar}
              disabled={guardando}
            >
              {guardando ? 'Guardando…' : 'Guardar resultados'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default DetalleEvaluacion
