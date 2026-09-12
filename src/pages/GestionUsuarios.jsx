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
    registrarUsuario,
    roles,
    usuarioEditar,
    edicion,
    cambiarCampoEdicion,
    seleccionarEditar,
    cancelarEdicion,
    guardarCambios,
    restablecerPassword,
    procesando,
    esUsuarioActual,
    nombreCompleto,
    etiquetaDeRol
  } = useGestionUsuarios()

  const columnas = [
    { titulo: 'Nombre', render: u => nombreCompleto(u) },
    { titulo: 'Correo', render: u => u.correo },
    { titulo: 'Rol', render: u => etiquetaDeRol(u.rol) },
    {
      titulo: 'Acciones',
      render: u => (
        <div className="acciones-usuario">
          <button type="button" onClick={() => seleccionarEditar(u)}>Editar</button>

          <button type="button" onClick={() => restablecerPassword(u)} disabled={procesando}>
            Restablecer contraseña
          </button>
        </div>
      )
    }
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
              {roles.map(item => (
                <option key={item.valor} value={item.valor}>{item.etiqueta}</option>
              ))}
            </select>
          </Campo>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar usuario'}
          </button>
        </form>
      </section>

      {usuarioEditar && (
        <section className="seccion-usuarios">
          <h2>Editar usuario</h2>

          <form className="formulario-usuarios" onSubmit={guardarCambios}>
            <Campo label="Nombre" htmlFor="editar-nombre">
              <input
                id="editar-nombre"
                type="text"
                value={edicion.nombre}
                onChange={e => cambiarCampoEdicion('nombre', e.target.value)}
                required
              />
            </Campo>

            <Campo label="Apellido" htmlFor="editar-apellido">
              <input
                id="editar-apellido"
                type="text"
                value={edicion.apellido}
                onChange={e => cambiarCampoEdicion('apellido', e.target.value)}
                required
              />
            </Campo>

            <Campo label="Correo" htmlFor="editar-correo">
              <input id="editar-correo" type="email" value={usuarioEditar.correo || ''} disabled />
              <small className="nota-campo">
                El correo es la credencial de acceso y no se puede modificar desde aquí.
              </small>
            </Campo>

            <Campo label="Rol" htmlFor="editar-rol">
              <select
                id="editar-rol"
                value={edicion.rol}
                onChange={e => cambiarCampoEdicion('rol', e.target.value)}
                disabled={esUsuarioActual(usuarioEditar.id)}
              >
                {roles.map(item => (
                  <option key={item.valor} value={item.valor}>{item.etiqueta}</option>
                ))}
              </select>
              {esUsuarioActual(usuarioEditar.id) && (
                <small className="nota-campo">No puede modificar su propio rol.</small>
              )}
            </Campo>

            <div className="acciones-usuario">
              <button type="submit" disabled={procesando}>
                {procesando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button type="button" onClick={cancelarEdicion}>Cancelar</button>
            </div>
          </form>
        </section>
      )}

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
