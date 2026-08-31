import { useState, useEffect } from 'react'
import { obtenerDesafios, crearDesafio, actualizarDesafio, eliminarDesafio } from '../services/desafioService'
import { TIPOS, obtenerCamposDesafio, puntajeMaximoFormulario } from '../utils/desafio'
import { useToast, useConfirmar } from '../context/NotificacionesContext'

export function useGestionDesafios() {
  const toast = useToast()
  const confirmar = useConfirmar()

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

  const cargarDesafios = async () => setDesafios(await obtenerDesafios())

  useEffect(() => {
    cargarDesafios()
  }, [])

  const obtenerPuntajeMaximo = () =>
    puntajeMaximoFormulario(tipo, { puntajeMaximo, maxLocalizar, maxInterpretar, maxReflexionar })

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
    if (Number(valor) >= 2) ajustarRangos(Number(valor))
  }

  const cambiarComponenteLenguaje = (setter, valor, otros) => {
    setter(valor)
    const maximo = Number(valor || 0) + otros.reduce((total, actual) => total + Number(actual || 0), 0)
    if (maximo >= 2) ajustarRangos(maximo)
  }

  const limpiarFormulario = () => {
    setNombre('')
    setTipo('')
    reiniciarCamposDependientes()
    setDesafioEditar(null)
  }

  const alerta = mensaje => {
    toast.error(mensaje)
    return false
  }

  const validarDesafio = () => {
    if (!nombre || !tipo) return alerta('Complete todos los campos')

    if (tipo === TIPOS.MATEMATICA && Number(cantidadDias) < 1) return alerta('Ingrese la cantidad de días')
    if (tipo === TIPOS.MATEMATICA && Number(puntajeMaximo) < 2) return alerta('Ingrese un puntaje máximo válido')
    if (tipo === TIPOS.LENGUAJE && obtenerPuntajeMaximo() < 2) return alerta('Ingrese los puntajes máximos')
    if (tipo === TIPOS.VELOCIDAD_LECTORA && Number(puntajeMaximo) < 2)
      return alerta('Ingrese la cantidad máxima de palabras leídas')
    if (Number(adecuadoDesde) >= Number(logradoDesde))
      return alerta('El nivel Logrado debe comenzar después de Adecuado')

    return true
  }

  const crearDatos = () => {
    const { campos, etiquetas } = obtenerCamposDesafio(tipo, cantidadDias)

    return {
      nombre,
      tipo,
      cantidad_dias: tipo === TIPOS.MATEMATICA ? Number(cantidadDias) : null,
      puntaje_maximo: obtenerPuntajeMaximo(),
      max_localizar: tipo === TIPOS.LENGUAJE ? Number(maxLocalizar) : null,
      max_interpretar: tipo === TIPOS.LENGUAJE ? Number(maxInterpretar) : null,
      max_reflexionar: tipo === TIPOS.LENGUAJE ? Number(maxReflexionar) : null,
      campos,
      etiquetas,
      adecuado_desde: Number(adecuadoDesde),
      logrado_desde: Number(logradoDesde)
    }
  }

  const guardar = async e => {
    e.preventDefault()
    if (!validarDesafio()) return

    if (desafioEditar) {
      await actualizarDesafio(desafioEditar.id, crearDatos())
      toast.exito('Desafío actualizado correctamente')
    } else {
      await crearDesafio(crearDatos())
      toast.exito('Desafío registrado correctamente')
    }

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

  const eliminarDesafioActual = async id => {
    const ok = await confirmar({
      mensaje: '¿Desea eliminar este desafío?',
      textoConfirmar: 'Eliminar',
      peligro: true
    })
    if (!ok) return

    await eliminarDesafio(id)
    toast.exito('Desafío eliminado correctamente')
    cargarDesafios()
  }

  return {
    valores: {
      nombre,
      tipo,
      cantidadDias,
      puntajeMaximo,
      maxLocalizar,
      maxInterpretar,
      maxReflexionar,
      adecuadoDesde,
      logradoDesde
    },
    setNombre,
    setAdecuadoDesde,
    setLogradoDesde,
    cambiarTipo,
    cambiarPuntajeMaximo,
    cambiarMaxLocalizar: valor => cambiarComponenteLenguaje(setMaxLocalizar, valor, [maxInterpretar, maxReflexionar]),
    cambiarMaxInterpretar: valor => cambiarComponenteLenguaje(setMaxInterpretar, valor, [maxLocalizar, maxReflexionar]),
    cambiarMaxReflexionar: valor => cambiarComponenteLenguaje(setMaxReflexionar, valor, [maxLocalizar, maxInterpretar]),
    setCantidadDias,
    desafios,
    desafioEditar,
    maximoVisual: obtenerPuntajeMaximo(),
    obtenerPuntajeMaximo,
    guardar,
    seleccionarEditar,
    limpiarFormulario,
    eliminarDesafioActual
  }
}
