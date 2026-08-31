import AppRoutes from './AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { NotificacionesProvider } from './context/NotificacionesContext'

function App() {
  return (
    <AuthProvider>
      <NotificacionesProvider>
        <AppRoutes />
      </NotificacionesProvider>
    </AuthProvider>
  )
}

export default App
