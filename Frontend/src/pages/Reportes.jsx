import Pagina from '../components/common/Pagina'
import Campo from '../components/common/Campo'
import BarraCursos from '../components/reportes/BarraCursos'
import BarrasComparativa from '../components/reportes/BarrasComparativa'
import DistribucionNiveles from '../components/reportes/DistribucionNiveles'
import LeyendaNiveles from '../components/reportes/LeyendaNiveles'
import TarjetaEstudiante from '../components/reportes/TarjetaEstudiante'
import { useAuth } from '../context/AuthContext'
import { useReportes } from '../hooks/useReportes'
import './Reportes.css'

const BASE_POR_ROL = { admin: '/admin', utp: '/utp', profesor: '/profesor' }

function Reportes() {
  const { rol } = useAuth()
  const base = BASE_POR_ROL[rol] || ''
  const {
    cargando,
    cursosDisponibles,
    desafios,
    cursoId,
    setCursoId,
    desafioId,
    setDesafioId,
    curso,
    desafio,
    reporte
  } = useReportes()

  if (cargando) {
    return (
      <Pagina className="pagina-reportes" titulo="Reportes">
        <p>Cargando datos...</p>
      </Pagina>
    )
  }

  const ultimaFecha = reporte?.hitos.length
    ? reporte.hitos[reporte.hitos.length - 1].fecha_aplicacion
    : null

  return (
    <Pagina className="pagina-reportes" titulo="Reportes">
      <div className="reportes-layout">
        <BarraCursos
          cursos={cursosDisponibles}
          seleccionado={cursoId}
          onSeleccionar={setCursoId}
        />

        <div className="reportes-main">
          <section className="seccion-reportes">
            <h2>{curso ? curso.nombre_curso : 'Elegir desafío'}</h2>

            {!cursoId && (
              <p className="reportes-vacio">Selecciona un curso en la barra de la izquierda.</p>
            )}

            {cursoId && (
              <Campo label="Desafío">
                <select value={desafioId} onChange={e => setDesafioId(e.target.value)}>
                  <option value="">Seleccione un desafío</option>
                  {desafios.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre} - {item.tipo}</option>
                  ))}
                </select>
              </Campo>
            )}
          </section>

          {cursoId && !desafioId && (
            <section className="seccion-reportes">
              <p className="reportes-vacio">Elige un desafío para ver el reporte.</p>
            </section>
          )}

          {reporte && reporte.hitos.length === 0 && (
            <section className="seccion-reportes">
              <p className="reportes-vacio">
                No hay evaluaciones de «{desafio?.nombre}» en {curso?.nombre_curso}.
              </p>
            </section>
          )}

          {reporte && reporte.hitos.length > 0 && (
            <>
              <section className="seccion-reportes">
                <p className="reportes-resumen-linea">
                  {desafio?.nombre} ({desafio?.tipo}) — {reporte.hitos.length} evaluación(es) ·
                  última: {ultimaFecha} · {reporte.totalConResultado} de {reporte.totalAlumnos} alumno(s) con resultados
                </p>
              </section>

              <section className="seccion-reportes">
                <h2>Resumen del curso</h2>
                <DistribucionNiveles
                  conteo={reporte.conteo}
                  total={reporte.totalConResultado}
                  promedio={reporte.promedio}
                  promedioPct={reporte.promedioPct}
                  esVelocidadLectora={reporte.esVelocidadLectora}
                />
              </section>

              <section className="seccion-reportes">
                <h2>Comparativa entre estudiantes</h2>
                <p className="reportes-nota">
                  Puntaje de la evaluación más reciente de cada estudiante, de mayor a menor.
                </p>
                <LeyendaNiveles />
                <BarrasComparativa
                  datos={reporte.comparativa}
                  maximo={reporte.maximo}
                  esVelocidadLectora={reporte.esVelocidadLectora}
                />
              </section>

              <section className="seccion-reportes">
                <h2>Por estudiante</h2>
                <div className="grid-tarjetas">
                  {reporte.estudiantes.map(estudiante => (
                    <TarjetaEstudiante
                      key={estudiante.id}
                      estudiante={estudiante}
                      desafio={desafio}
                      maximo={reporte.maximo}
                      esVelocidadLectora={reporte.esVelocidadLectora}
                      to={`${base}/ficha?estudiante=${estudiante.id}`}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Pagina>
  )
}

export default Reportes
