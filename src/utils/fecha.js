export const convertirFecha = fecha => {
  if (!fecha) return 0

  if (typeof fecha?.toDate === 'function') return fecha.toDate().getTime()
  if (fecha instanceof Date) return fecha.getTime()

  if (typeof fecha === 'string') {
    if (fecha.includes('-')) {
      const [anio, mes, dia] = fecha.split('-')
      return new Date(Number(anio), Number(mes) - 1, Number(dia)).getTime()
    }

    if (fecha.includes('/')) {
      const [dia, mes, anio] = fecha.split('/')
      return new Date(Number(anio), Number(mes) - 1, Number(dia)).getTime()
    }

    return new Date(fecha).getTime() || 0
  }

  return 0
}
