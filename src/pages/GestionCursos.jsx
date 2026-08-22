import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../config'

function GestionCursos() {
    const [nombre, setNombre] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)
    const [cursos, setCursos] = useState([])

    const cargarCursos = async () => {
        const consulta = await getDocs(collection(db, 'cursos'))

        const listaCursos = consulta.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

        setCursos(listaCursos)
    }

    const registrarCurso = async (e) => {
        e.preventDefault()

        if (nombre.trim() === '') {
            setMensaje('Debes ingresar el nombre del curso')
            return
        }

        setCargando(true)
        setMensaje('')

        try {
            await addDoc(collection(db, 'cursos'), {
                nombre: nombre,
                fechaCreacion: new Date()
            })

            setMensaje('Curso registrado correctamente')
            setNombre('')

            cargarCursos()

        } catch (error) {
            console.error(error)
            setMensaje('Error al registrar el curso')

        } finally {
            setCargando(false)
        }
    }

    return (
        <div>
            <h1>Gestión de Cursos</h1>

            <Link to="/admin">
                Volver al Dashboard
            </Link>

            <hr />

            <h2>Registrar Curso</h2>

            <form onSubmit={registrarCurso}>
                <div>
                    <label>Nombre del curso</label>

                    <br />

                    <select
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un curso</option>

                        <option value="1° Básico">1° Básico</option>
                        <option value="2° Básico">2° Básico</option>
                        <option value="3° Básico">3° Básico</option>
                        <option value="4° Básico">4° Básico</option>
                        <option value="5° Básico">5° Básico</option>
                        <option value="6° Básico">6° Básico</option>
                        <option value="7° Básico">7° Básico</option>
                    </select>
                </div>

                <br />

                {mensaje && <p>{mensaje}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Registrando...' : 'Registrar curso'}
                </button>
            </form>

            <hr />

            <h2>Cursos registrados</h2>

            <button onClick={cargarCursos}>
                Ver cursos
            </button>

            <ul>
                {cursos.map((curso) => (
                    <li key={curso.id}>
                        {curso.nombre}
                    </li>
                ))}
            </ul>
        </div>
    )
}export default GestionCursos
