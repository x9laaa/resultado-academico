import Pagina from '../components/common/Pagina'
import Campo from '../components/common/Campo'
import Tabla from '../components/common/Tabla'
import { useGestionUsuarios } from '../hooks/useGestionUsuarios'
import './GestionUsuarios.css'

function GestionUsuarios() {
  const {
    nombre,
    setNombre,
    apellido,
    setApellido,
    correo,
    setCorreo,
    password,
    setPassword,
    rol,
    setRol,
    usuarios,
    mensaje,
    cargando,
    registrarUsuario
  } = useGestionUsuarios()

  const columnas = [
    { titulo: 'Nombre', render: u => `${u.nombre} ${u.apellido}` },
    { titulo: 'Correo', render: u => u.correo },
    { titulo: 'Rol', render: u => u.rol }
  ]

  return (
    <Pagina className="pagina-usuarios" titulo="Gestión de Usuarios">
      <section className="seccion-usuarios">
        <h2>Registrar Usuario</h2>

        <form className="formulario-usuarios" onSubmit={registrarUsuario}>
          <Campo label="Nombre" htmlFor="nombre">
            <input id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </Campo>

          <Campo label="Apellido" htmlFor="apellido">
            <input id="apellido" type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
          </Campo>

          <Campo label="Correo" htmlFor="correo">
            <input id="correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
          </Campo>

          <Campo label="Contraseña" htmlFor="password">
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </Campo>

          <Campo label="Rol" htmlFor="rol">
            <select id="rol" value={rol} onChange={e => setRol(e.target.value)}>
              <option value="admin">Administrador</option>
              <option value="profesor">Profesor</option>
              <option value="utp">UTP</option>
            </select>
          </Campo>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar usuario'}
          </button>
        </form>
      </section>

      <section className="seccion-usuarios">
        <h2>Usuarios registrados</h2>

        <Tabla
          className="tabla-usuarios"
          columnas={columnas}
          datos={usuarios}
          vacio="Aún no hay usuarios registrados."
        />
      </section>
    </Pagina>
  )
}

export default GestionUsuarios
