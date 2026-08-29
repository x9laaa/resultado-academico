import Navbar from '../components/Navbar'
import './Dashboard.css'

function AdminDashboard() {
  return (
    <>
      <Navbar />

      <main className="pagina-panel">
        <section className="tarjeta-panel">
          <h1>Panel de Administración</h1>
          <p>Bienvenido al panel de administración.</p>
        </section>
      </main>
    </>
  )
}

export default AdminDashboard