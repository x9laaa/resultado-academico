import Pagina from '../components/common/Pagina'
import CrearEvaluacion from '../components/resultados/CrearEvaluacion'
import SeleccionEvaluacion from '../components/resultados/SeleccionEvaluacion'
import DetalleEvaluacion from '../components/resultados/DetalleEvaluacion'
import { useRegistroResultados } from '../hooks/useRegistroResultados'
import './RegistroResultados.css'

function RegistroResultados() {
  const r = useRegistroResultados()

  if (r.cargando) {
    return (
      <Pagina className="pagina-resultados">
        <p>Cargando resultados...</p>
      </Pagina>
    )
  }

  const enDetalle = r.evaluacion && r.evaluacionSeleccionada && r.desafioSeleccionado

  return (
    <Pagina className="pagina-resultados" titulo="Registro de Resultados">
      {!r.evaluacion && (
        <>
          <CrearEvaluacion
            cursos={r.cursosParaCrear}
            desafios={r.desafios}
            valores={r.nuevaEvaluacion}
            onCampo={r.cambiarCampoNuevaEvaluacion}
            onCrear={r.crearNuevaEvaluacion}
            creando={r.creandoEvaluacion}
          />

          <SeleccionEvaluacion
            cursosConEvaluacion={r.cursosConEvaluacion}
            desafiosDisponibles={r.desafiosDisponibles}
            cursoFiltro={r.cursoFiltro}
            desafioFiltro={r.desafioFiltro}
            busqueda={r.busqueda}
            onCursoChange={r.seleccionarCurso}
            onDesafioChange={r.setDesafioFiltro}
            onBusquedaChange={r.setBusqueda}
            evaluacionesFiltradas={r.evaluacionesFiltradas}
            cantidadAlumnos={r.cantidadAlumnos}
            cantidadResultados={r.cantidadResultados}
            obtenerDesafio={r.obtenerDesafio}
            obtenerCurso={r.obtenerCurso}
            onSeleccionar={r.seleccionarEvaluacion}
          />
        </>
      )}

      {enDetalle && (
        <DetalleEvaluacion
          evaluacionSeleccionada={r.evaluacionSeleccionada}
          desafioSeleccionado={r.desafioSeleccionado}
          esVelocidadLectora={r.esVelocidadLectora}
          puntajeMaximo={r.puntajeMaximo}
          estudiantes={r.estudiantes}
          resultados={r.resultados}
          registrados={r.registrados}
          pendientes={r.pendientes}
          guardando={r.guardando}
          obtenerCurso={r.obtenerCurso}
          onVolver={r.volverEvaluaciones}
          calcularPuntaje={r.calcularPuntaje}
          calcularNivel={r.calcularNivel}
          cambiarResultado={r.cambiarResultado}
          onGuardar={r.guardarResultados}
        />
      )}
    </Pagina>
  )
}

export default RegistroResultados
