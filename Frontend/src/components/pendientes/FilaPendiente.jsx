import { Link } from 'react-router-dom'

function FilaPendiente({ item, to }) {
  const pct = item.total ? Math.round((item.registrados / item.total) * 100) : 0

  return (
    <li className="fila-pendiente">
      <div className="fp-info">
        <strong>{item.desafio}</strong>
        <span>{item.curso} · {item.fecha}</span>
      </div>

      <div className="fp-avance">
        <div className="fp-barra">
          <div className="fp-barra-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="fp-avance-texto">
          {item.registrados} / {item.total} registrados · <strong>{item.faltantes} pendiente(s)</strong>
        </span>
      </div>

      <Link className="fp-boton" to={to}>Registrar →</Link>
    </li>
  )
}

export default FilaPendiente
