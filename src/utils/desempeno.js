const NIVELES = {
  LOGRADO: 'Logrado',
  ADECUADO: 'Adecuado',
  INSUFICIENTE: 'Insuficiente'
}

export const ORDEN_NIVELES = [NIVELES.LOGRADO, NIVELES.ADECUADO, NIVELES.INSUFICIENTE]

export const esVelocidadLectora = desafio => desafio?.tipo === 'Velocidad Lectora'

export const puntajeMaximoDesafio = desafio => Number(desafio?.puntaje_maximo || 0)

export const calcularPuntaje = (desafio, resultado = {}) => {
  if (!desafio) return 0

  if (esVelocidadLectora(desafio)) return Number(resultado.palabras || 0)

  return desafio.campos?.reduce(
    (total, campo) => total + Number(resultado[campo] || 0),
    0
  ) || 0
}

export const tieneResultado = (desafio, resultado = {}) => {
  const completo = valor => valor !== undefined && valor !== ''

  if (esVelocidadLectora(desafio)) return completo(resultado.palabras)

  return desafio?.campos?.some(campo => completo(resultado[campo])) || false
}

export const calcularNivel = (desafio, puntaje) => {
  if (!desafio) return ''

  if (puntaje >= Number(desafio.logrado_desde)) return NIVELES.LOGRADO
  if (puntaje >= Number(desafio.adecuado_desde)) return NIVELES.ADECUADO
  return NIVELES.INSUFICIENTE
}

const TOPES_LENGUAJE = {
  localizar: 'max_localizar',
  interpretar: 'max_interpretar',
  reflexionar: 'max_reflexionar'
}

export const topeCampo = (desafio, campo) => {
  const clave = TOPES_LENGUAJE[campo]
  const tope = clave ? Number(desafio?.[clave] || 0) : 0
  return tope > 0 ? tope : puntajeMaximoDesafio(desafio)
}

export const etiquetaCampo = (desafio, campo) => {
  const posicion = desafio?.campos?.indexOf(campo) ?? -1
  return desafio?.etiquetas?.[posicion] || campo
}

export const validarResultado = (desafio, resultado = {}) => {
  if (!desafio) return null

  const maximo = puntajeMaximoDesafio(desafio)

  if (esVelocidadLectora(desafio)) {
    const palabras = Number(resultado.palabras)
    if (Number.isNaN(palabras) || palabras < 0) return 'Las palabras leídas no pueden ser negativas.'
    if (maximo > 0 && palabras > maximo) return `Las palabras leídas no pueden superar ${maximo}.`
    return null
  }

  for (const campo of desafio.campos || []) {
    const valor = Number(resultado[campo])

    if (Number.isNaN(valor) || valor < 0) {
      return `${etiquetaCampo(desafio, campo)} no puede ser negativo.`
    }

    const tope = topeCampo(desafio, campo)
    if (tope > 0 && valor > tope) {
      return `${etiquetaCampo(desafio, campo)} no puede superar ${tope}.`
    }
  }

  const total = calcularPuntaje(desafio, resultado)
  if (maximo > 0 && total > maximo) {
    return `El puntaje total (${total}) supera el máximo de ${maximo}.`
  }

  return null
}
