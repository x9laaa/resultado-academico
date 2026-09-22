function Tabla({ className, columnas, datos, vacio = 'Sin registros.' }) {
  return (
    <div className="tabla-contenedor">
      <table className={className}>
        <thead>
          <tr>
            {columnas.map(columna => (
              <th key={columna.titulo}>{columna.titulo}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td colSpan={columnas.length}>{vacio}</td>
            </tr>
          ) : (
            datos.map(fila => (
              <tr key={fila.id}>
                {columnas.map(columna => (
                  <td key={columna.titulo}>{columna.render(fila)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Tabla
