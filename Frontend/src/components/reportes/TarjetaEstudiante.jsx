import { Link } from 'react-router-dom'
import LineaProgreso from './LineaProgreso'

function TarjetaEstudiante({ estudiante, desafio, maximo, esVelocidadLectora, to }) {
  const { nombre, serie, ultimo } = estudiante

  if (!ultimo) {
    return (
      <article className="tarjeta-estudiante tarjeta-estudiante--vacia">
        <h3>{nombre}</h3>
        <p className="tarjeta-sin-datos">Sin resultados registrados</p>
        {to && <Link className="tarjeta-link" to={to}>Ver ficha →</Link>}
      </article>
    )
  }

  const previo = serie.length >= 2 ? serie[serie.length - 2] : null
  const delta = previo ? ultimo.puntaje - previo.puntaje : null
  const signo = delta > 0 ? '▲' : delta < 0 ? '▼' : '='

  return (
    <article className="tarjeta-estudiante">
      <header className="tarjeta-cabecera">
        <h3>{nombre}</h3>
        <span className={`nivel-badge nivel-${ultimo.nivel.toLowerCase()}`}>{ultimo.nivel}</span>
      </header>

      <p className="tarjeta-cifra">
        {esVelocidadLectora ? (
          <><strong>{ultimo.palabras}</strong> palabras</>
        ) : (
          <><strong>{ultimo.puntaje}</strong> / {maximo}</>
        )}
        {delta !== null && (
          <span className="tarjeta-delta"> {signo} {Math.abs(delta)} vs. anterior</span>
        )}
      </p>

      <LineaProgreso
        serie={serie}
        maximo={maximo}
        adecuadoDesde={Number(desafio.adecuado_desde)}
        logradoDesde={Number(desafio.logrado_desde)}
      />

      {!esVelocidadLectora && ultimo.campos.length > 0 && (
        <ul className="tarjeta-campos">
          {ultimo.campos.map(campo => (
            <li key={campo.clave}>
              <span>{campo.etiqueta}</span>
              <strong>{campo.valor}</strong>
            </li>
          ))}
        </ul>
      )}

      {to && <Link className="tarjeta-link" to={to}>Ver ficha →</Link>}
    </article>
  )
}

export default TarjetaEstudiante
