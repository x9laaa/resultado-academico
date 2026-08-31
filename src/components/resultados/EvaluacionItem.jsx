import EstadoEvaluacion from './EstadoEvaluacion'

function EvaluacionItem({ evaluacion, desafio, curso, total, registrados, onSeleccionar }) {
  return (
    <div className="fila-evaluacion">
      <div className="nombre-evaluacion">
        <strong>{desafio}</strong>
      </div>

      <div>{curso}</div>

      <div>{evaluacion.fecha_aplicacion}</div>

      <div className="estado-evaluacion">
        <EstadoEvaluacion
          total={total}
          registrados={registrados}
        />
      </div>

      <button
        type="button"
        onClick={() => onSeleccionar(evaluacion.id)}
      >
        Registrar
      </button>
    </div>
  )
}

export default EvaluacionItem