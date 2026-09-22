function BarrasComparativa({ datos, maximo, esVelocidadLectora }) {
  if (!datos.length) {
    return <p className="reportes-vacio">Ningún estudiante tiene resultados en este desafío todavía.</p>
  }

  const tope = maximo || Math.max(...datos.map(d => d.puntaje), 1)

  return (
    <ul className="barras-comparativa">
      {datos.map(fila => {
        const ancho = Math.max(2, Math.min(100, (fila.puntaje / tope) * 100))
        const valor = esVelocidadLectora ? `${fila.puntaje}` : `${fila.puntaje} / ${tope}`

        return (
          <li key={fila.id} title={`${fila.nombre} · ${valor} · ${fila.nivel}`}>
            <span className="barra-nombre">{fila.nombre}</span>
            <span className="barra-pista">
              <span
                className={`barra-valor-fill nivel-fill-${fila.nivel.toLowerCase()}`}
                style={{ width: `${ancho}%` }}
              />
            </span>
            <span className="barra-cifra">{valor}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default BarrasComparativa
