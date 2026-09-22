import { ORDEN_NIVELES } from '../../utils/desempeno'
import LeyendaNiveles from './LeyendaNiveles'

function DistribucionNiveles({ conteo, total, promedio, promedioPct, esVelocidadLectora }) {
  if (!total) {
    return <p className="reportes-vacio">Sin resultados para resumir.</p>
  }

  return (
    <div className="distribucion-niveles">
      <div className="distribucion-barra" role="img" aria-label="Distribución de niveles del curso">
        {ORDEN_NIVELES.map(nivel => {
          const cantidad = conteo[nivel] ?? 0
          if (!cantidad) return null

          return (
            <span
              key={nivel}
              className={`distribucion-seg nivel-fill-${nivel.toLowerCase()}`}
              style={{ width: `${(cantidad / total) * 100}%` }}
              title={`${nivel}: ${cantidad} de ${total}`}
            />
          )
        })}
      </div>

      <div className="distribucion-pie">
        <LeyendaNiveles conteo={conteo} />
        <p className="distribucion-promedio">
          Promedio del curso: <strong>{promedio}</strong>
          {!esVelocidadLectora && <> pts · <strong>{promedioPct}%</strong></>}
          {esVelocidadLectora && <> palabras</>}
        </p>
      </div>
    </div>
  )
}

export default DistribucionNiveles
