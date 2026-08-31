function FiltrosEvaluaciones({ cursos, desafios, curso, desafio, busqueda, onCursoChange, onDesafioChange, onBusquedaChange }) {
  return (
    <div className="filtros-evaluaciones">
      <div>
        <label>Curso</label>
        <select value={curso} onChange={e => onCursoChange(e.target.value)}>
          <option value="">Todos los cursos</option>
          {cursos.map(item => (
            <option key={item.id} value={item.id}>{item.nombre_curso}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Desafío</label>
        <select value={desafio} onChange={e => onDesafioChange(e.target.value)}>
          <option value="">Todos los desafíos</option>
          {desafios.map(item => (
            <option key={item.id} value={item.id}>{item.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Buscar</label>
        <input type="text" value={busqueda} onChange={e => onBusquedaChange(e.target.value)} placeholder="Buscar evaluación..." />
      </div>
    </div>
  )
}

export default FiltrosEvaluaciones