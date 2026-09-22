function EstadoEvaluacion({ total, registrados }) {
  const pendientes = Math.max(total - registrados, 0)

  if (total === 0) {
    return (
      <span className="estado-sin-alumnos">
        Sin alumnos
      </span>
    )
  }

  if (pendientes === 0) {
    return (
      <span className="estado-completa">
        ✓ {registrados}/{total} registrados
      </span>
    )
  }

  return (
    <span className="estado-pendiente">
      ⚠ {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
    </span>
  )
}

export default EstadoEvaluacion