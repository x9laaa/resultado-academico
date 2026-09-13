import { tieneResultado, topeCampo } from '../../utils/desempeno'

function TablaResultados({
  estudiantes,
  resultados,
  desafio,
  esVelocidadLectora,
  calcularPuntaje,
  calcularNivel,
  cambiarResultado,
  errorResultado
}) {
  const puntajeMaximo = Number(desafio.puntaje_maximo) || 0

  return (
    <div className="tabla-contenedor">
      <table className="tabla-resultados">
        <thead>
          <tr>
            <th>Estudiante</th>

            {esVelocidadLectora ? (
              <th>Palabras</th>
            ) : (
              desafio.etiquetas?.map(etiqueta => (
                <th key={etiqueta}>{etiqueta}</th>
              ))
            )}

            <th>Puntaje</th>
            <th>Nivel</th>
          </tr>
        </thead>

        <tbody>
          {estudiantes.map(estudiante => {
            const resultado = resultados[estudiante.id] || {}
            const puntaje = calcularPuntaje(estudiante.id)
            const nivel = calcularNivel(puntaje)
            const registrada = tieneResultado(desafio, resultado)
            const error = errorResultado ? errorResultado(estudiante.id) : null

            const clases = [registrada ? 'fila-registrada' : 'fila-sin-registrar']
            if (error) clases.push('fila-invalida')

            return (
              <tr key={estudiante.id} className={clases.join(' ')}>
                <td>
                  <span className="marca-fila" aria-hidden="true" />
                  {estudiante.nombre} {estudiante.apellido}
                  {error && <span className="error-resultado">{error}</span>}
                </td>

                {esVelocidadLectora ? (
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={puntajeMaximo || undefined}
                      inputMode="numeric"
                      aria-invalid={Boolean(error)}
                      value={resultado.palabras ?? ''}
                      onChange={e => cambiarResultado(estudiante.id, 'palabras', e.target.value)}
                    />
                  </td>
                ) : (
                  desafio.campos?.map(campo => (
                    <td key={campo}>
                      <input
                        type="number"
                        min="0"
                        max={topeCampo(desafio, campo) || undefined}
                        inputMode="numeric"
                        aria-invalid={Boolean(error)}
                        value={resultado[campo] ?? ''}
                        onChange={e => cambiarResultado(estudiante.id, campo, e.target.value)}
                      />
                    </td>
                  ))
                )}

                <td className={error ? 'puntaje-excedido' : undefined}>
                  {esVelocidadLectora
                    ? puntaje
                    : `${puntaje} / ${desafio.puntaje_maximo}`}
                </td>

                <td>
                  <span className={`nivel-badge nivel-${nivel.toLowerCase()}`}>
                    {nivel}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TablaResultados
