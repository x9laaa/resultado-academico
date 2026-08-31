import Navbar from '../layout/Navbar'

function Pagina({ className, titulo, children }) {
  return (
    <>
      <Navbar />

      <main className={className}>
        {titulo && <h1>{titulo}</h1>}
        {children}
      </main>
    </>
  )
}

export default Pagina
