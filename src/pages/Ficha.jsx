import Pagina from '../components/common/Pagina'
import Campo from '../components/common/Campo'
import Tabla from '../components/common/Tabla'
import BarraCursos from '../components/reportes/BarraCursos'
import LeyendaNiveles from '../components/reportes/LeyendaNiveles'
import BloqueDesafio from '../components/ficha/BloqueDesafio'
import { useFicha } from '../hooks/useFicha'
import './Ficha.css'

function Ficha() {
  const {
    cargando,
    cursosDisponibles,
    estudiantesDelCurso,
    cursoId,
    estudianteId,
    setEstudianteId,
    seleccionarCurso,
    ficha
  } = useFicha()

  if (cargando) {
    return (
      <Pagina className="pagina-ficha" titulo="Ficha del estudiante">
        <p>Cargando datos...</p>
      </Pagina>
    )
  }

  const columnas = [
    { titulo: 'Fecha', render: h => h.fecha },
    { titulo: 'Desafío', render: h => h.desafio },
    { titulo: 'Tipo', render: h => h.tipo },
    {
      titulo: 'Puntaje',
      render: h => (h.tipo === 'Velocidad Lectora' ? `${h.puntaje}` : `${h.puntaje} / ${h.maximo}`)
    },
    {
      titulo: 'Nivel',
      render: h => <span className={`nivel-badge nivel-${h.nivel.toLowerCase()}`}>{h.nivel}</span>
    }
  ]

  return (
    <Pagina className="pagina-ficha" titulo="Ficha del estudiante">
      <div className="ficha-layout">
        <BarraCursos
          cursos={cursosDisponibles}
          seleccionado={cursoId}
          onSeleccionar={seleccionarCurso}
        />

        <div className="ficha-main">
          <section className="seccion-ficha">
            <h2>Estudiante</h2>

            {!cursoId && (
              <p className="ficha-vacio">Selecciona un curso en la barra de la izquierda.</p>
            )}

            {cursoId && (
              <Campo label="Estudiante">
                <select value={estudianteId} onChange={e => setEstudianteId(e.target.value)}>
                  <option value="">Seleccione un estudiante</option>
                  {estudiantesDelCurso.map(est => (
                    <option key={est.id} value={est.id}>{est.nombre} {est.apellido}</option>
                  ))}
                </select>
              </Campo>
            )}

            {cursoId && !estudianteId && <p className="ficha-vacio">Elige un estudiante.</p>}
          </section>

          {ficha && (
            <>
              <section className="seccion-ficha">
                <h2>{ficha.estudiante.nombre}</h2>
                <p className="ficha-sub">
                  {ficha.estudiante.curso} · {ficha.totalRendidas} evaluación(es) rendida(s)
                </p>

                {ficha.totalRendidas > 0 ? (
                  <LeyendaNiveles conteo={ficha.conteo} />
                ) : (
                  <p className="ficha-vacio">
                    Este estudiante todavía no tiene resultados registrados.
                  </p>
                )}
              </section>

              {ficha.bloques.length > 0 && (
                <section className="seccion-ficha">
                  <h2>Evolución por desafío</h2>
                  <div className="ficha-bloques">
                    {ficha.bloques.map(bloque => (
                      <BloqueDesafio key={bloque.id} bloque={bloque} />
                    ))}
                  </div>
                </section>
              )}

              {ficha.historial.length > 0 && (
                <section className="seccion-ficha">
                  <h2>Historial</h2>
                  <Tabla
                    className="tabla-historial"
                    columnas={columnas}
                    datos={ficha.historial}
                    vacio="Sin resultados."
                  />
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </Pagina>
  )
}

export default Ficha
