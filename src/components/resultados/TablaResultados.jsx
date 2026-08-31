import { tieneResultado } from '../../utils/desempeno'

const MAX_LENGUAJE = {
  localizar: 'max_localizar',
  interpretar: 'max_interpretar',
  reflexionar: 'max_reflexionar'
}

function TablaResultados({ estudiantes, resultados, desafio, esVelocidadLectora, calcularPuntaje, calcularNivel, cambiarResultado }) {
  const puntajeMaximo = Number(desafio.puntaje_maximo) || 0
  const topeCampo = campo => desafio[MAX_LENGUAJE[campo]] || undefined

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
            const excede = !esVelocidadLectora && puntajeMaximo > 0 && puntaje > puntajeMaximo

            return (
              <tr key={estudiante.id} className={registrada ? 'fila-registrada' : 'fila-pendiente'}>
                <td>
                  <span className="marca-fila" aria-hidden="true" />
                  {estudiante.nombre} {estudiante.apellido}
                </td>

                {esVelocidadLectora ? (
                  <td>
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
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
                        max={topeCampo(campo)}
                        inputMode="numeric"
                        value={resultado[campo] ?? ''}
                        onChange={e => cambiarResultado(estudiante.id, campo, e.target.value)}
                      />
                    </td>
                  ))
                )}

                <td className={excede ? 'puntaje-excedido' : undefined}>
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
