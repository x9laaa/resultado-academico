import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'

import { db, firebaseConfig } from '../config'
import './GestionUsuarios.css'

const appRegistro = initializeApp(firebaseConfig, 'registro-usuarios')
const authRegistro = getAuth(appRegistro)

function GestionUsuarios() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('profesor')
  const [usuarios, setUsuarios] = useState([])

  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cancelarSuscripcion = onSnapshot(
      collection(db, 'usuarios'),
      (resultado) => {
        const listaUsuarios = resultado.docs.map((usuario) => ({
          id: usuario.id,
          ...usuario.data()
        }))

        listaUsuarios.sort((a, b) => {
          const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase()
          const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase()
          return nombreA.localeCompare(nombreB)
        })

        setUsuarios(listaUsuarios)
      },
      () => setMensaje('No fue posible cargar los usuarios registrados.')
    )

    return cancelarSuscripcion
  }, [])

  const registrarUsuario = async (e) => {
    e.preventDefault()

    setMensaje('')
    setCargando(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authRegistro,
        correo,
        password
      )

      const uid = userCredential.user.uid

      await setDoc(doc(db, 'usuarios', uid), {
        uid,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim().toLowerCase(),
        rol
      })

      await signOut(authRegistro)

      setMensaje('Usuario creado correctamente')

      setNombre('')
      setApellido('')
      setCorreo('')
      setPassword('')
      setRol('profesor')

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setMensaje('Ya existe un usuario registrado con ese correo.')
      } else if (error.code === 'auth/weak-password') {
        setMensaje('La contraseña debe tener al menos 6 caracteres.')
      } else {
        setMensaje('No fue posible registrar al usuario. Intenta nuevamente.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="pagina-usuarios">
      <h1>Gestión de Usuarios</h1>

      <Link className="volver" to="/admin">Volver al panel</Link>

      <section className="seccion-usuarios">
      <h2>Registrar Usuario</h2>

      <form className="formulario-usuarios" onSubmit={registrarUsuario}>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="admin">Administrador</option>
            <option value="profesor">Profesor</option>
            <option value="utp">UTP</option>
          </select>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrar usuario'}
        </button>
      </form>
      </section>

      <section className="seccion-usuarios">
      <h2>Usuarios registrados</h2>

      {usuarios.length === 0 ? (
        <p>Aún no hay usuarios registrados.</p>
      ) : (
        <div className="tabla-contenedor">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      </section>
    </main>
  )
}

export default GestionUsuarios
