export const NIVELES = {
  LOGRADO: 'Logrado',
  ADECUADO: 'Adecuado',
  INSUFICIENTE: 'Insuficiente'
}

export const ORDEN_NIVELES = [NIVELES.LOGRADO, NIVELES.ADECUADO, NIVELES.INSUFICIENTE]

export const esVelocidadLectora = desafio => desafio?.tipo === 'Velocidad Lectora'

export const puntajeMaximoDesafio = desafio =>
  esVelocidadLectora(desafio) ? 200 : Number(desafio?.puntaje_maximo || 0)

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
