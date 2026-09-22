import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RutaProtegida({ rolesPermitidos, children }) {
  const { usuario, rol, cargando } = useAuth()

  if (cargando) {
    return <p className="cargando-sesion">Verificando sesión...</p>
  }

  if (!usuario) {
    return <Navigate to="/" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida
