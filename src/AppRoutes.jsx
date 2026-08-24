import { Routes, Route } from 'react-router-dom'
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/usuarios" element={<GestionUsuarios />} />
      <Route path="/admin/cursos" element={<GestionCursos />} />
      <Route path="/admin/estudiantes" element={<GestionEstudiantes />} />
      <Route path="/admin/desafios" element={<GestionDesafios />} />
      <Route path="/admin/resultados" element={<RegistroResultados />} />
      <Route path="/admin/evaluaciones" element={<GestionEvaluaciones />} />
      <Route path="/profesor" element={<ProfesorDashboard />} />
      <Route path="/utp" element={<UtpDashboard />} />
      <Route path="/utp/cursos" element={<GestionCursos />} />
      <Route path="/utp/estudiantes" element={<GestionEstudiantes />} />
      <Route path="/utp/desafios" element={<GestionDesafios />} />
      <Route path="/utp/resultados" element={<RegistroResultados />} />
    </Routes>
  )
}

export default AppRoutes