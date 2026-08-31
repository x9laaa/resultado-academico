import Campo from '../components/common/Campo'
import { useLogin } from '../hooks/useLogin'
import './Login.css'

function Login() {
  const { correo, setCorreo, password, setPassword, mensaje, cargando, iniciarSesion } = useLogin()

  return (
    <main className="pagina-login">
      <section className="login-contenedor">
        <h1>Iniciar sesion</h1>

        <form onSubmit={iniciarSesion}>
          <Campo label="Correo electronico">
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.cl"
              required
            />
          </Campo>

          <Campo label="Contrasena">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </Campo>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
