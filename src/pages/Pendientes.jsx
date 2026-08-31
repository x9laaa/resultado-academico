import Pagina from '../components/common/Pagina'
import ResumenPendientes from '../components/pendientes/ResumenPendientes'
import FilaPendiente from '../components/pendientes/FilaPendiente'
import { useAuth } from '../context/AuthContext'
import { usePendientes } from '../hooks/usePendientes'
import './Pendientes.css'

const BASE_POR_ROL = { admin: '/admin', utp: '/utp', profesor: '/profesor' }

function Pendientes() {
  const { rol } = useAuth()
  const { cargando, tablero } = usePendientes()
  const base = BASE_POR_ROL[rol] || ''

  if (cargando) {
    return (
      <Pagina className="pagina-pendientes" titulo="Resultados pendientes">
        <p>Cargando datos...</p>
      </Pagina>
    )
  }

  return (
    <Pagina className="pagina-pendientes" titulo="Resultados pendientes">
      <ResumenPendientes tablero={tablero} />

      <section className="seccion-pendientes">
        <h2>Evaluaciones por registrar</h2>
        <p className="pendientes-nota">De la más antigua a la más reciente.</p>

        {tablero.pendientes.length === 0 ? (
          <p className="pendientes-vacio">
            No hay evaluaciones con resultados pendientes.
          </p>
        ) : (
          <ul className="lista-pendientes">
            {tablero.pendientes.map(item => (
              <FilaPendiente
                key={item.id}
                item={item}
                to={`${base}/resultados?evaluacion=${item.id}`}
              />
            ))}
          </ul>
        )}
      </section>
    </Pagina>
  )
}

export default Pendientes
