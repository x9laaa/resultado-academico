import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config'
import RangoDobleSlider from './RangoDobleSlider'
import './GestionDesafios.css'
import Navbar from '../components/Navbar'

const TIPOS = {
  MATEMATICA: 'Matemática',
  LENGUAJE: 'Lenguaje',
  VELOCIDAD_LECTORA: 'Velocidad Lectora'
}

function GestionDesafios() {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [cantidadDias, setCantidadDias] = useState('')
  const [puntajeMaximo, setPuntajeMaximo] = useState('')
  const [maxLocalizar, setMaxLocalizar] = useState('')
  const [maxInterpretar, setMaxInterpretar] = useState('')
  const [maxReflexionar, setMaxReflexionar] = useState('')
  const [adecuadoDesde, setAdecuadoDesde] = useState(1)
  const [logradoDesde, setLogradoDesde] = useState(2)
  const [desafios, setDesafios] = useState([])
  const [desafioEditar, setDesafioEditar] = useState(null)

  useEffect(() => {
    cargarDesafios()
  }, [])

  const cargarDesafios = async () => {
    const datos = await getDocs(collection(db, 'desafios'))
    const lista = datos.docs.map(item => ({ id: item.id, ...item.data() }))
    setDesafios(lista)
  }

  const obtenerPuntajeMaximo = () => {
    switch (tipo) {
      case TIPOS.MATEMATICA:
      case TIPOS.VELOCIDAD_LECTORA:
        return Number(puntajeMaximo || 0)
      case TIPOS.LENGUAJE:
        return Number(maxLocalizar || 0) + Number(maxInterpretar || 0) + Number(maxReflexionar || 0)
      default:
        return 0
    }
  }

  const ajustarRangos = maximo => {
    if (maximo < 2) return

    let adecuado = Number(adecuadoDesde)
    let logrado = Number(logradoDesde)

    if (adecuado >= maximo) adecuado = maximo - 1
    if (logrado > maximo) logrado = maximo
    if (logrado <= adecuado) logrado = adecuado + 1

    setAdecuadoDesde(adecuado)
    setLogradoDesde(logrado)
  }

  const reiniciarCamposDependientes = () => {
    setCantidadDias('')
    setPuntajeMaximo('')
    setMaxLocalizar('')
    setMaxInterpretar('')
    setMaxReflexionar('')
    setAdecuadoDesde(1)
    setLogradoDesde(2)
  }

  const cambiarTipo = nuevoTipo => {
    setTipo(nuevoTipo)
    reiniciarCamposDependientes()
  }

  const cambiarPuntajeMaximo = valor => {
    setPuntajeMaximo(valor)
    const maximo = Number(valor)
    if (maximo >= 2) ajustarRangos(maximo)
  }

  const cambiarComponenteLenguaje = (setter, valor, otrosComponentes) => {
    setter(valor)
    const maximo = Number(valor || 0) + otrosComponentes.reduce((total, actual) => total + Number(actual || 0), 0)
    if (maximo >= 2) ajustarRangos(maximo)
  }

  const cambiarMaxLocalizar = valor => cambiarComponenteLenguaje(setMaxLocalizar, valor, [maxInterpretar, maxReflexionar])
  const cambiarMaxInterpretar = valor => cambiarComponenteLenguaje(setMaxInterpretar, valor, [maxLocalizar, maxReflexionar])
  const cambiarMaxReflexionar = valor => cambiarComponenteLenguaje(setMaxReflexionar, valor, [maxLocalizar, maxInterpretar])

  const limpiarFormulario = () => {
    setNombre('')
    setTipo('')
    reiniciarCamposDependientes()
    setDesafioEditar(null)
  }

  const obtenerCampos = () => {
    switch (tipo) {
      case TIPOS.MATEMATICA: {
        const campos = []
        const etiquetas = []

        for (let i = 1; i <= Number(cantidadDias); i++) {
          campos.push(`dia${i}`)
          etiquetas.push(`Día ${i}`)
        }

        return { campos, etiquetas }
      }

      case TIPOS.LENGUAJE:
        return { campos: ['localizar', 'interpretar', 'reflexionar'], etiquetas: ['Localizar', 'Interpretar/Inferir', 'Reflexionar'] }

      case TIPOS.VELOCIDAD_LECTORA:
        return { campos: ['palabras'], etiquetas: ['Palabras leídas'] }

      default:
        return { campos: [], etiquetas: [] }
    }
  }

  const validarDesafio = () => {
    if (!nombre || !tipo) {
      alert('Complete todos los campos')
      return false
    }

    if (tipo === TIPOS.MATEMATICA && Number(cantidadDias) < 1) {
      alert('Ingrese la cantidad de días')
      return false
    }

    if (tipo === TIPOS.MATEMATICA && Number(puntajeMaximo) < 2) {
      alert('Ingrese un puntaje máximo válido')
      return false
    }

    if (tipo === TIPOS.LENGUAJE && obtenerPuntajeMaximo() < 2) {
      alert('Ingrese los puntajes máximos')
      return false
    }

    if (tipo === TIPOS.VELOCIDAD_LECTORA && Number(puntajeMaximo) < 2) {
      alert('Ingrese la cantidad máxima de palabras leídas')
      return false
    }

    if (Number(adecuadoDesde) >= Number(logradoDesde)) {
      alert('El nivel Logrado debe comenzar después de Adecuado')
      return false
    }

    return true
  }

  const crearDatos = () => {
    const estructura = obtenerCampos()

    return {
      nombre,
      tipo,
      cantidad_dias: tipo === TIPOS.MATEMATICA ? Number(cantidadDias) : null,
      puntaje_maximo: obtenerPuntajeMaximo(),
      max_localizar: tipo === TIPOS.LENGUAJE ? Number(maxLocalizar) : null,
      max_interpretar: tipo === TIPOS.LENGUAJE ? Number(maxInterpretar) : null,
      max_reflexionar: tipo === TIPOS.LENGUAJE ? Number(maxReflexionar) : null,
      campos: estructura.campos,
      etiquetas: estructura.etiquetas,
      adecuado_desde: Number(adecuadoDesde),
      logrado_desde: Number(logradoDesde)
    }
  }

  const registrarDesafio = async e => {
    e.preventDefault()
    if (!validarDesafio()) return

    await addDoc(collection(db, 'desafios'), { ...crearDatos(), fecha_creacion: serverTimestamp() })

    alert('Desafío registrado correctamente')
    limpiarFormulario()
    cargarDesafios()
  }

  const seleccionarEditar = item => {
    setDesafioEditar(item)
    setNombre(item.nombre || '')
    setTipo(item.tipo || '')
    setCantidadDias(item.cantidad_dias || '')
    setPuntajeMaximo(item.puntaje_maximo || '')
    setMaxLocalizar(item.max_localizar || '')
    setMaxInterpretar(item.max_interpretar || '')
    setMaxReflexionar(item.max_reflexionar || '')
    setAdecuadoDesde(Number(item.adecuado_desde || 1))
    setLogradoDesde(Number(item.logrado_desde || 2))
  }

  const guardarCambios = async e => {
    e.preventDefault()
    if (!validarDesafio()) return

    await updateDoc(doc(db, 'desafios', desafioEditar.id), crearDatos())

    alert('Desafío actualizado correctamente')
    limpiarFormulario()
    cargarDesafios()
  }

  const eliminarDesafio = async id => {
    const confirmar = window.confirm('¿Desea eliminar este desafío?')
    if (!confirmar) return

    await deleteDoc(doc(db, 'desafios', id))

    alert('Desafío eliminado correctamente')
    cargarDesafios()
  }

  const maximoVisual = obtenerPuntajeMaximo()

  return (
    <>
    <Navbar />

    <div className="pagina-desafios">
      <h1>Gestión de Desafíos</h1>

      <section className="seccion-desafios">
        <h2>{desafioEditar ? 'Editar desafío' : 'Registrar desafío'}</h2>

        <form className="formulario-desafios" onSubmit={desafioEditar ? guardarCambios : registrarDesafio}>
          <div>
            <label>Nombre del desafío</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>

          <div>
            <label>Tipo de desafío</label>
            <select value={tipo} onChange={e => cambiarTipo(e.target.value)} required>
              <option value="">Seleccione un tipo</option>
              <option value={TIPOS.MATEMATICA}>{TIPOS.MATEMATICA}</option>
              <option value={TIPOS.LENGUAJE}>{TIPOS.LENGUAJE}</option>
              <option value={TIPOS.VELOCIDAD_LECTORA}>{TIPOS.VELOCIDAD_LECTORA}</option>
            </select>
          </div>

          {tipo === TIPOS.MATEMATICA && (
            <>
              <div>
                <label>Cantidad de días</label>
                <input type="number" min="1" value={cantidadDias} onChange={e => setCantidadDias(e.target.value)} required />
              </div>
              <div>
                <label>Puntaje máximo</label>
                <input type="number" min="2" value={puntajeMaximo} onChange={e => cambiarPuntajeMaximo(e.target.value)} required />
              </div>
            </>
          )}

          {tipo === TIPOS.LENGUAJE && (
            <>
              <div>
                <label>Puntaje máximo Localizar</label>
                <input type="number" min="0" value={maxLocalizar} onChange={e => cambiarMaxLocalizar(e.target.value)} required />
              </div>
              <div>
                <label>Puntaje máximo Interpretar/Inferir</label>
                <input type="number" min="0" value={maxInterpretar} onChange={e => cambiarMaxInterpretar(e.target.value)} required />
              </div>
              <div>
                <label>Puntaje máximo Reflexionar</label>
                <input type="number" min="0" value={maxReflexionar} onChange={e => cambiarMaxReflexionar(e.target.value)} required />
              </div>
              <div>
                <label>Puntaje máximo total</label>
                <input type="number" value={obtenerPuntajeMaximo()} disabled />
              </div>
            </>
          )}

          {tipo === TIPOS.VELOCIDAD_LECTORA && (
            <>
              <div>
                <label>Cantidad máxima de palabras leídas</label>
                <input type="number" min="2" value={puntajeMaximo} onChange={e => cambiarPuntajeMaximo(e.target.value)} required />
              </div>
            </>
          )}

          {tipo && maximoVisual > 0 && (
            <div className="clasificacion">
              <h3>Clasificación del desafío</h3>

              <RangoDobleSlider
                minimo={0}
                maximo={maximoVisual}
                adecuadoDesde={Number(adecuadoDesde)}
                logradoDesde={Number(logradoDesde)}
                onCambiarAdecuado={setAdecuadoDesde}
                onCambiarLogrado={setLogradoDesde}
              />

              <div className="resultado-rangos">
                <div><strong>Insuficiente</strong><span>0 - {Number(adecuadoDesde) - 1}</span></div>
                <div><strong>Adecuado</strong><span>{adecuadoDesde} - {Number(logradoDesde) - 1}</span></div>
                <div><strong>Logrado</strong><span>{logradoDesde} - {maximoVisual}</span></div>
              </div>
            </div>
          )}

          <div className="botones-desafio">
            <button type="submit">{desafioEditar ? 'Guardar cambios' : 'Registrar desafío'}</button>
            {desafioEditar && <button type="button" onClick={limpiarFormulario}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className="seccion-desafios">
        <h2>Desafíos registrados</h2>

        <div className="tabla-contenedor">
          <table className="tabla-desafios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Puntaje máximo</th>
                <th>Adecuado desde</th>
                <th>Logrado desde</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {desafios.map(item => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>{item.tipo}</td>
                  <td>{item.puntaje_maximo}</td>
                  <td>{item.adecuado_desde}</td>
                  <td>{item.logrado_desde}</td>
                  <td>
                    <button type="button" onClick={() => seleccionarEditar(item)}>Editar</button>
                    <button type="button" onClick={() => eliminarDesafio(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
        </>
  )
}

export default GestionDesafios
