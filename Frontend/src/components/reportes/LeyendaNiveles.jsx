import { ORDEN_NIVELES } from '../../utils/desempeno'

function LeyendaNiveles({ conteo }) {
  return (
    <ul className="leyenda-niveles">
      {ORDEN_NIVELES.map(nivel => (
        <li key={nivel}>
          <span className={`punto-nivel nivel-fill-${nivel.toLowerCase()}`} aria-hidden="true" />
          {nivel}
          {conteo && <strong> · {conteo[nivel] ?? 0}</strong>}
        </li>
      ))}
    </ul>
  )
}

export default LeyendaNiveles
