const W = 280
const H = 116
const PAD = { top: 10, right: 10, bottom: 20, left: 10 }

const fechaCorta = fecha => {
  if (typeof fecha !== 'string') return ''
  if (fecha.includes('-')) {
    const [, mes, dia] = fecha.split('-')
    return `${dia}/${mes}`
  }
  if (fecha.includes('/')) {
    const [dia, mes] = fecha.split('/')
    return `${dia}/${mes}`
  }
  return fecha
}

function LineaProgreso({ serie, maximo, adecuadoDesde, logradoDesde }) {
  const plotL = PAD.left
  const plotR = W - PAD.right
  const plotT = PAD.top
  const plotB = H - PAD.bottom
  const plotW = plotR - plotL
  const plotH = plotB - plotT

  const tope = maximo || Math.max(...serie.map(p => p.puntaje), 1)
  const y = valor => plotT + (1 - Math.min(valor, tope) / tope) * plotH
  const x = i => (serie.length === 1 ? plotL + plotW / 2 : plotL + (i / (serie.length - 1)) * plotW)

  const bandas = [
    { clase: 'banda-insuficiente', desde: 0, hasta: adecuadoDesde },
    { clase: 'banda-adecuado', desde: adecuadoDesde, hasta: logradoDesde },
    { clase: 'banda-logrado', desde: logradoDesde, hasta: tope }
  ]

  const puntos = serie.map((p, i) => ({ ...p, cx: x(i), cy: y(p.puntaje) }))
  const linea = puntos.map(p => `${p.cx},${p.cy}`).join(' ')
  const ultimo = puntos[puntos.length - 1]

  return (
    <svg
      className="linea-progreso"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Evolución del puntaje"
    >
      {bandas.map(banda => {
        const yArriba = y(banda.hasta)
        const yAbajo = y(banda.desde)
        return (
          <rect
            key={banda.clase}
            className={banda.clase}
            x={plotL}
            y={yArriba}
            width={plotW}
            height={Math.max(0, yAbajo - yArriba)}
          />
        )
      })}

      {puntos.length >= 2 && (
        <polyline
          className="linea-progreso-trazo"
          points={linea}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {puntos.map((p, i) => (
        <circle
          key={p.hitoId}
          className={`linea-progreso-punto nivel-fill-${p.nivel.toLowerCase()}`}
          cx={p.cx}
          cy={p.cy}
          r={4}
          vectorEffect="non-scaling-stroke"
        >
          <title>{`${fechaCorta(p.fecha)} · ${p.puntaje} pts · ${p.nivel}`}{i === puntos.length - 1 ? ' (última)' : ''}</title>
        </circle>
      ))}

      {ultimo && (
        <text className="linea-progreso-cifra" x={ultimo.cx} y={ultimo.cy - 8} textAnchor="middle">
          {ultimo.puntaje}
        </text>
      )}

      {serie.length >= 2 && (
        <>
          <text className="linea-progreso-fecha" x={plotL} y={H - 6} textAnchor="start">
            {fechaCorta(serie[0].fecha)}
          </text>
          <text className="linea-progreso-fecha" x={plotR} y={H - 6} textAnchor="end">
            {fechaCorta(serie[serie.length - 1].fecha)}
          </text>
        </>
      )}

      {serie.length === 1 && (
        <text className="linea-progreso-fecha" x={W / 2} y={H - 6} textAnchor="middle">
          {fechaCorta(serie[0].fecha)} · 1 evaluación
        </text>
      )}
    </svg>
  )
}

export default LineaProgreso
