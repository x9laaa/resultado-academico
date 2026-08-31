import Navbar from './Navbar'
import './Dashboard.css'

function PanelBienvenida({ titulo, mensaje }) {
  return (
    <>
      <Navbar />

      <main className="pagina-panel">
        <section className="tarjeta-panel">
          <h1>{titulo}</h1>
          <p>{mensaje}</p>
        </section>
      </main>
    </>
  )
}

export default PanelBienvenida
