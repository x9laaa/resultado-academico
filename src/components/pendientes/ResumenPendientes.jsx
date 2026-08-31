function ResumenPendientes({ tablero }) {
  const tiles = [
    { valor: tablero.pendientes.length, etiqueta: 'Evaluaciones por registrar', tono: 'alerta' },
    { valor: tablero.alumnosPorRegistrar, etiqueta: 'Alumnos sin resultado', tono: 'alerta' },
    { valor: tablero.completas, etiqueta: 'Evaluaciones completas', tono: 'ok' },
    { valor: tablero.sinAlumnos, etiqueta: 'Cursos sin alumnos', tono: 'neutro' }
  ]

  return (
    <div className="resumen-pendientes">
      {tiles.map(tile => (
        <div key={tile.etiqueta} className={`tile tile-${tile.tono}`}>
          <strong>{tile.valor}</strong>
          <span>{tile.etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

export default ResumenPendientes
