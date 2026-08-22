import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import GestionUsuarios from './pages/GestionUsuarios'
import ProfesorDashboard from './pages/ProfesorDashboard'
import UtpDashboard from './pages/UtpDashboard'
import GestionCursos from './pages/GestionCursos'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route
                path="/admin/usuarios"
                element={<GestionUsuarios />}
            />
            <Route
                path="/admin/cursos"
                element={<GestionCursos />}
            />

            <Route
                path="/profesor"
                element={<ProfesorDashboard />}
            />

            <Route path="/utp" element={<UtpDashboard />} />

            <Route
                path="/utp/cursos"
                element={<GestionCursos />}
            />
        </Routes>
    )
}

export default AppRoutes