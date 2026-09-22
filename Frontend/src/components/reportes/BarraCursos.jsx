function BarraCursos({ cursos, seleccionado, onSeleccionar }) {
  return (
    <nav className="barra-cursos" aria-label="Cursos">
      <h2 className="barra-cursos-titulo">Cursos</h2>

      {cursos.length === 0 ? (
        <p className="barra-cursos-vacio">No hay cursos disponibles.</p>
      ) : (
        <ul>
          {cursos.map(curso => (
            <li key={curso.id}>
              <button
                type="button"
                className={curso.id === seleccionado ? 'activo' : undefined}
                aria-current={curso.id === seleccionado ? 'true' : undefined}
                onClick={() => onSeleccionar(curso.id)}
              >
                {curso.nombre_curso}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default BarraCursos
