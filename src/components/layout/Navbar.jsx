import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../config'
import { useAuth } from '../../context/AuthContext'
import { MENUS_POR_ROL, NOMBRE_PANEL_POR_ROL, obtenerIniciales } from './navbar.config'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { rol, perfil } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  const links = MENUS_POR_ROL[rol] || []

  useEffect(() => {
    const cerrarSiEsAfuera = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
    }

    document.addEventListener('mousedown', cerrarSiEsAfuera)
    return () => document.removeEventListener('mousedown', cerrarSiEsAfuera)
  }, [])

  const cerrarSesion = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-contenido">
        <Link className="navbar-logo" to={links[0]?.to || '/'}>
          {NOMBRE_PANEL_POR_ROL[rol] || 'Panel'}
        </Link>

        <div className="navbar-links">
          {links.map(link => (
            <Link key={link.to} to={link.to}>{link.etiqueta}</Link>
          ))}
        </div>

        <div className="navbar-usuario" ref={menuRef}>
          <button
            type="button"
            className="navbar-avatar"
            onClick={() => setMenuAbierto(anterior => !anterior)}
            aria-label="Menú de usuario"
          >
            {obtenerIniciales(perfil)}
          </button>

          {menuAbierto && (
            <div className="navbar-menu-usuario">
              <p className="navbar-menu-nombre">
                {perfil ? `${perfil.nombre} ${perfil.apellido}` : 'Usuario'}
              </p>
              <p className="navbar-menu-correo">{perfil?.correo}</p>
              <button type="button" onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
