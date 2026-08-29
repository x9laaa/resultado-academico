import './Dashboard.css'
import Navbar from '../components/Navbar'

function ProfesorDashboard() {
    return (
        <>
        <Navbar />
        <main className="pagina-panel">
            <section className="tarjeta-panel">
                <h1>Panel del Profesor</h1>
                <p>Bienvenido al panel del profesor.</p>
            </section>
        </main>
        </>
    );
}
export default ProfesorDashboard;
