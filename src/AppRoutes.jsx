import { Routes, Route } from 'react-router-dom'
import RutaProtegida from './components/common/RutaProtegida'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import GestionUsuarios from './pages/GestionUsuarios'
import ProfesorDashboard from './pages/ProfesorDashboard'
import UtpDashboard from './pages/UtpDashboard'
import GestionCursos from './pages/GestionCursos'
import GestionEstudiantes from './pages/GestionEstudiantes'
import GestionDesafios from './pages/GestionDesafios'
import RegistroResultados from './pages/RegistroResultados'
import GestionEvaluaciones from './pages/GestionEvaluaciones'
import Reportes from './pages/Reportes'
import Pendientes from './pages/Pendientes'
import Ficha from './pages/Ficha'
import NoEncontrada from './pages/NoEncontrada'

const RUTAS = [
  { path: '/admin', roles: ['admin'], Pagina: AdminDashboard },
  { path: '/admin/usuarios', roles: ['admin'], Pagina: GestionUsuarios },
  { path: '/admin/cursos', roles: ['admin'], Pagina: GestionCursos },
  { path: '/admin/estudiantes', roles: ['admin'], Pagina: GestionEstudiantes },
  { path: '/admin/desafios', roles: ['admin'], Pagina: GestionDesafios },
  { path: '/admin/resultados', roles: ['admin'], Pagina: RegistroResultados },
  { path: '/admin/pendientes', roles: ['admin'], Pagina: Pendientes },
  { path: '/admin/reportes', roles: ['admin'], Pagina: Reportes },
  { path: '/admin/ficha', roles: ['admin'], Pagina: Ficha },
  { path: '/admin/evaluaciones', roles: ['admin'], Pagina: GestionEvaluaciones },

  { path: '/profesor', roles: ['profesor'], Pagina: ProfesorDashboard },
  { path: '/profesor/resultados', roles: ['profesor'], Pagina: RegistroResultados },
  { path: '/profesor/pendientes', roles: ['profesor'], Pagina: Pendientes },
  { path: '/profesor/reportes', roles: ['profesor'], Pagina: Reportes },
  { path: '/profesor/ficha', roles: ['profesor'], Pagina: Ficha },

  { path: '/utp', roles: ['utp'], Pagina: UtpDashboard },
  { path: '/utp/cursos', roles: ['utp'], Pagina: GestionCursos },
  { path: '/utp/estudiantes', roles: ['utp'], Pagina: GestionEstudiantes },
  { path: '/utp/desafios', roles: ['utp'], Pagina: GestionDesafios },
  { path: '/utp/resultados', roles: ['utp'], Pagina: RegistroResultados },
  { path: '/utp/pendientes', roles: ['utp'], Pagina: Pendientes },
  { path: '/utp/reportes', roles: ['utp'], Pagina: Reportes },
  { path: '/utp/ficha', roles: ['utp'], Pagina: Ficha },
  { path: '/utp/evaluaciones', roles: ['utp'], Pagina: GestionEvaluaciones }
]

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {RUTAS.map(({ path, roles, Pagina }) => (
        <Route
          key={path}
          path={path}
          element={
            <RutaProtegida rolesPermitidos={roles}>
              <Pagina />
            </RutaProtegida>
          }
        />
      ))}

      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}

export default AppRoutes
