import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NoEncontrada.css'

const RUTA_POR_ROL = {
  admin: '/admin',
  profesor: '/profesor',
  utp: '/utp'
}

function NoEncontrada() {
  const { usuario, rol, cargando } = useAuth()

  if (cargando) {
    return <p className="cargando-sesion">Verificando sesión...</p>
  }

  const destino = (usuario && RUTA_POR_ROL[rol]) || '/'
  const etiqueta = destino === '/' ? 'Ir al inicio de sesión' : 'Volver a mi panel'

  return (
    <main className="pagina-no-encontrada">
      <section className="no-encontrada-contenedor">
        <p className="no-encontrada-codigo">404</p>
        <h1>Página no encontrada</h1>
        <p className="no-encontrada-texto">
          La dirección que intentó abrir no existe o fue modificada.
        </p>
        <Link className="no-encontrada-enlace" to={destino}>{etiqueta}</Link>
      </section>
    </main>
  )
}

export default NoEncontrada
