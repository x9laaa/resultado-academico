export const MENUS_POR_ROL = {
  admin: [
    { to: '/admin', etiqueta: 'Inicio' },
    { to: '/admin/usuarios', etiqueta: 'Usuarios' },
    { to: '/admin/cursos', etiqueta: 'Cursos' },
    { to: '/admin/estudiantes', etiqueta: 'Estudiantes' },
    { to: '/admin/desafios', etiqueta: 'Desafíos' },
    { to: '/admin/resultados', etiqueta: 'Resultados' },
    { to: '/admin/pendientes', etiqueta: 'Pendientes' },
    { to: '/admin/reportes', etiqueta: 'Reportes' },
    { to: '/admin/ficha', etiqueta: 'Fichas' },
    { to: '/admin/evaluaciones', etiqueta: 'Evaluaciones' }
  ],
  utp: [
    { to: '/utp', etiqueta: 'Inicio' },
    { to: '/utp/cursos', etiqueta: 'Cursos' },
    { to: '/utp/estudiantes', etiqueta: 'Estudiantes' },
    { to: '/utp/desafios', etiqueta: 'Desafíos' },
    { to: '/utp/resultados', etiqueta: 'Resultados' },
    { to: '/utp/pendientes', etiqueta: 'Pendientes' },
    { to: '/utp/reportes', etiqueta: 'Reportes' },
    { to: '/utp/ficha', etiqueta: 'Fichas' },
    { to: '/utp/evaluaciones', etiqueta: 'Evaluaciones' }
  ],
  profesor: [
    { to: '/profesor', etiqueta: 'Inicio' },
    { to: '/profesor/resultados', etiqueta: 'Resultados' },
    { to: '/profesor/pendientes', etiqueta: 'Pendientes' },
    { to: '/profesor/reportes', etiqueta: 'Reportes' },
    { to: '/profesor/ficha', etiqueta: 'Fichas' }
  ]
}

export const NOMBRE_PANEL_POR_ROL = {
  admin: 'Panel Admin',
  utp: 'Panel UTP',
  profesor: 'Panel Profesor'
}

export const obtenerIniciales = perfil => {
  if (!perfil) return '?'

  const iniciales = (perfil.nombre?.[0] || '') + (perfil.apellido?.[0] || '')
  return iniciales.toUpperCase() || '?'
}
