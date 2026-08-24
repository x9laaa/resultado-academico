import { Link } from 'react-router-dom'
import './Dashboard.css'

function AdminDashboard() {
  return (
    <main className="pagina-panel">
      <section className="tarjeta-panel">
        <h1>Panel de Administración</h1>
        <p>Bienvenido al panel de administración.</p>
        <Link className="enlace-panel" to="/admin/usuarios">Gestionar usuarios</Link>
        <br />
        <Link className="enlace-panel" to="/admin/cursos">Gestionar cursos</Link>
        <br />
        <Link className="enlace-panel" to="/admin/estudiantes">Gestionar estudiantes</Link>
        <br />
        <Link className="enlace-panel" to="/admin/desafios">Gestionar desafíos</Link>
        <br />
        <Link className="enlace-panel" to="/admin/resultados">Registrar resultados</Link>
        <br />
        <Link className="enlace-panel" to="/admin/evaluaciones">Gestionar evaluaciones</Link>
      </section>
    </main>
  )
}

export default AdminDashboard