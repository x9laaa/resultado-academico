import Pagina from '../components/common/Pagina'
import Tabla from '../components/common/Tabla'
import FormularioDesafio from '../components/desafios/FormularioDesafio'
import { useGestionDesafios } from '../hooks/useGestionDesafios'
import './GestionDesafios.css'

function GestionDesafios() {
  const gestion = useGestionDesafios()
  const { desafios, desafioEditar, seleccionarEditar, eliminarDesafioActual } = gestion

  const columnas = [
    { titulo: 'Nombre', render: item => item.nombre },
    { titulo: 'Tipo', render: item => item.tipo },
    { titulo: 'Puntaje máximo', render: item => item.puntaje_maximo },
    { titulo: 'Adecuado desde', render: item => item.adecuado_desde },
    { titulo: 'Logrado desde', render: item => item.logrado_desde },
    {
      titulo: 'Acciones',
      render: item => (
        <>
          <button type="button" onClick={() => seleccionarEditar(item)}>Editar</button>
          <button type="button" onClick={() => eliminarDesafioActual(item.id)}>Eliminar</button>
        </>
      )
    }
  ]

  return (
    <Pagina className="pagina-desafios" titulo="Gestión de Desafíos">
      <section className="seccion-desafios">
        <h2>{desafioEditar ? 'Editar desafío' : 'Registrar desafío'}</h2>

        <FormularioDesafio
          valores={gestion.valores}
          desafioEditar={desafioEditar}
          maximoVisual={gestion.maximoVisual}
          obtenerPuntajeMaximo={gestion.obtenerPuntajeMaximo}
          setNombre={gestion.setNombre}
          cambiarTipo={gestion.cambiarTipo}
          setCantidadDias={gestion.setCantidadDias}
          cambiarPuntajeMaximo={gestion.cambiarPuntajeMaximo}
          cambiarMaxLocalizar={gestion.cambiarMaxLocalizar}
          cambiarMaxInterpretar={gestion.cambiarMaxInterpretar}
          cambiarMaxReflexionar={gestion.cambiarMaxReflexionar}
          setAdecuadoDesde={gestion.setAdecuadoDesde}
          setLogradoDesde={gestion.setLogradoDesde}
          onSubmit={gestion.guardar}
          onCancelar={gestion.limpiarFormulario}
        />
      </section>

      <section className="seccion-desafios">
        <h2>Desafíos registrados</h2>

        <Tabla
          className="tabla-desafios"
          columnas={columnas}
          datos={desafios}
          vacio="No hay desafíos registrados."
        />
      </section>
    </Pagina>
  )
}

export default GestionDesafios
