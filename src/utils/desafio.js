export const TIPOS = {
  MATEMATICA: 'Matemática',
  LENGUAJE: 'Lenguaje',
  VELOCIDAD_LECTORA: 'Velocidad Lectora'
}

export const obtenerCamposDesafio = (tipo, cantidadDias) => {
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
      return {
        campos: ['localizar', 'interpretar', 'reflexionar'],
        etiquetas: ['Localizar', 'Interpretar/Inferir', 'Reflexionar']
      }

    case TIPOS.VELOCIDAD_LECTORA:
      return { campos: ['palabras'], etiquetas: ['Palabras leídas'] }

    default:
      return { campos: [], etiquetas: [] }
  }
}

export const puntajeMaximoFormulario = (tipo, { puntajeMaximo, maxLocalizar, maxInterpretar, maxReflexionar }) => {
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
