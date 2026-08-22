import { Link } from 'react-router-dom'
import './Dashboard.css'

function AdminDashboard() {
    return (
        <main className="pagina-panel">
            <section className="tarjeta-panel">
                <h1>Panel de Administración</h1>
                <p>Bienvenido al panel de administración.</p>
                <Link className="enlace-panel" to="/admin/usuarios">Gestionar usuarios</Link>
                <Link className="enlace-panel" to="/admin/cursos">Gestionar cursos</Link>
            </section>
        </main>
    );
}

export default AdminDashboard