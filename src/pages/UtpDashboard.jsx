import './Dashboard.css'
import Navbar from '../components/Navbar'

function UtpDashboard() {
    return (
        <>
        <Navbar />
        <main className="pagina-panel">
            <section className="tarjeta-panel">
                <h1>Panel UTP</h1>
                <p>Bienvenido al panel de la UTP.</p>
            </section>
        </main>
        </>
    );
}
export default UtpDashboard;
