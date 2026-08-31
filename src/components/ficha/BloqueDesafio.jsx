import LineaProgreso from '../reportes/LineaProgreso'

function BloqueDesafio({ bloque }) {
  const { nombre, tipo, serie, ultimo, maximo, adecuadoDesde, logradoDesde } = bloque
  const esVL = tipo === 'Velocidad Lectora'

  return (
    <article className="bloque-desafio">
      <header className="bloque-cabecera">
        <div>
          <h3>{nombre}</h3>
          <span className="bloque-tipo">{tipo}</span>
        </div>
        <div className="bloque-ultimo">
          <span className={`nivel-badge nivel-${ultimo.nivel.toLowerCase()}`}>{ultimo.nivel}</span>
          <strong>{esVL ? `${ultimo.puntaje} palabras` : `${ultimo.puntaje} / ${maximo}`}</strong>
        </div>
      </header>

      <LineaProgreso
        serie={serie}
        maximo={maximo}
        adecuadoDesde={adecuadoDesde}
        logradoDesde={logradoDesde}
      />

      <p className="bloque-meta">{serie.length} evaluación(es) rendida(s)</p>
    </article>
  )
}

export default BloqueDesafio
