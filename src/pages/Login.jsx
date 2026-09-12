import Campo from '../components/common/Campo'
import { useLogin } from '../hooks/useLogin'
import './Login.css'

function Login() {
  const {
    correo,
    setCorreo,
    password,
    setPassword,
    mensaje,
    aviso,
    cargando,
    iniciarSesion,
    recuperarPassword,
    enviandoRecuperacion
  } = useLogin()

  return (
    <main className="pagina-login">
      <section className="login-contenedor">
        <h1>Iniciar sesión</h1>

        <form onSubmit={iniciarSesion}>
          <Campo label="Correo electrónico" htmlFor="login-correo">
            <input
              id="login-correo"
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.cl"
              required
            />
          </Campo>

          <Campo label="Contraseña" htmlFor="login-password">
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </Campo>

          {mensaje && <p className="mensaje">{mensaje}</p>}
          {aviso && <p className="aviso">{aviso}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <button
            type="button"
            className="enlace-recuperar"
            onClick={recuperarPassword}
            disabled={enviandoRecuperacion}
          >
            {enviandoRecuperacion ? 'Enviando correo...' : '¿Olvidó su contraseña?'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
