import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-contenido">
        <Link className="navbar-logo" to="/admin">Panel Admin</Link>

        <div className="navbar-links">
          <Link to="/admin">Inicio</Link>
          <Link to="/admin/usuarios">Usuarios</Link>
          <Link to="/admin/cursos">Cursos</Link>
          <Link to="/admin/estudiantes">Estudiantes</Link>
          <Link to="/admin/desafios">Desafíos</Link>
          <Link to="/admin/resultados">Resultados</Link>
          <Link to="/admin/evaluaciones">Evaluaciones</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar