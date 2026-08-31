function EdicionCurso({
  cursoEditar,
  nuevoNombre,
  setNuevoNombre,
  profesor,
  setProfesor,
  profesores,
  onCerrar,
  onGuardarNombre,
  onAgregarProfesor,
  onQuitarProfesor,
  obtenerNombreProfesor,
  estudiantesCurso
}) {
  return (
    <section className="seccion-cursos">
      <div className="encabezado-edicion">
        <h2>Editar: {cursoEditar.nombre_curso}</h2>
        <button type="button" onClick={onCerrar}>Cerrar</button>
      </div>

      <form className="formulario-editar" onSubmit={onGuardarNombre}>
        <input type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required />
        <button type="submit">Guardar nombre</button>
      </form>

      <div className="grid-edicion">
        <div>
          <h3>Profesores</h3>

          {cursoEditar.profesores?.length > 0 ? (
            <ul className="lista-compacta">
              {cursoEditar.profesores.map(id => (
                <li key={id}>
                  <span>{obtenerNombreProfesor(id)}</span>
                  <button type="button" onClick={() => onQuitarProfesor(id)}>Quitar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin profesores asignados.</p>
          )}

          <div className="formulario-profesor">
            <select value={profesor} onChange={e => setProfesor(e.target.value)}>
              <option value="">Seleccione profesor</option>
              {profesores.map(item => (
                <option key={item.id} value={item.id}>{item.nombre} {item.apellido}</option>
              ))}
            </select>

            <button type="button" onClick={onAgregarProfesor}>Agregar</button>
          </div>
        </div>

        <div>
          <h3>Estudiantes ({estudiantesCurso.length})</h3>

          {estudiantesCurso.length > 0 ? (
            <div className="estudiantes-compactos">
              {estudiantesCurso.map((estudiante, index) => (
                <div className="estudiante-item" key={estudiante.id}>
                  <span>{index + 1}.</span>
                  <span>{estudiante.nombre} {estudiante.apellido}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Sin estudiantes registrados.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default EdicionCurso
