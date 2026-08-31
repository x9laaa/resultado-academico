import { useState } from 'react'

function CrearEvaluacion({ cursos, desafios, valores, onCampo, onCrear, creando }) {
  const [abierto, setAbierto] = useState(false)

  const enviar = async e => {
    const ok = await onCrear(e)
    if (ok) setAbierto(false)
  }

  return (
    <section className="seccion-resultados">
      <div className="crear-evaluacion-caja">
        <button
          type="button"
          className="toggle-crear"
          onClick={() => setAbierto(anterior => !anterior)}
        >
          {abierto ? '− Cerrar' : '＋ Crear nueva evaluación'}
        </button>

        {abierto && (
          <form className="crear-evaluacion" onSubmit={enviar}>
            <div>
              <label>Curso</label>
              <select value={valores.id_curso} onChange={e => onCampo('id_curso', e.target.value)} required>
                <option value="">Seleccione un curso</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.nombre_curso}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Desafío</label>
              <select value={valores.id_desafio} onChange={e => onCampo('id_desafio', e.target.value)} required>
                <option value="">Seleccione un desafío</option>
                {desafios.map(desafio => (
                  <option key={desafio.id} value={desafio.id}>{desafio.nombre} - {desafio.tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Fecha de aplicación</label>
              <input
                type="date"
                value={valores.fecha_aplicacion}
                onChange={e => onCampo('fecha_aplicacion', e.target.value)}
                required
              />
            </div>

            <div>
              <label>Año</label>
              <input
                type="number"
                value={valores.anio}
                onChange={e => onCampo('anio', e.target.value)}
                required
              />
            </div>

            <button type="submit" className="boton-crear" disabled={creando}>
              {creando ? 'Creando...' : 'Crear evaluación'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default CrearEvaluacion
