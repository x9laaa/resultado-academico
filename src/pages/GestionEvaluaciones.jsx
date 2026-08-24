import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import './GestionEvaluaciones.css'

function GestionEvaluaciones() {
    const [cursos, setCursos] = useState([])
    const [desafios, setDesafios] = useState([])
    const [curso, setCurso] = useState('')
    const [desafio, setDesafio] = useState('')
    const [fechaAplicacion, setFechaAplicacion] = useState('')
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [evaluaciones, setEvaluaciones] = useState([])

    useEffect(() => {
        cargarCursos()
        cargarDesafios()
        cargarEvaluaciones()
    }, [])

    const cargarCursos = async () => {
        const datos = await getDocs(collection(db, 'cursos'))

        const lista = datos.docs.map(item => ({
            id: item.id,
            ...item.data()
        }))

        setCursos(lista)
    }

    const cargarDesafios = async () => {
        const datos = await getDocs(collection(db, 'desafios'))

        const lista = datos.docs.map(item => ({
            id: item.id,
            ...item.data()
        }))

        setDesafios(lista)
    }

    const cargarEvaluaciones = async () => {
        const datos = await getDocs(collection(db, 'evaluaciones'))

        const lista = datos.docs.map(item => ({
            id: item.id,
            ...item.data()
        }))

        setEvaluaciones(lista)
    }

    const registrarEvaluacion = async (e) => {
        e.preventDefault()

        if (!curso || !desafio || !fechaAplicacion) {
            alert('Complete todos los campos')
            return
        }

        await addDoc(collection(db, 'evaluaciones'), {
            id_curso: curso,
            id_desafio: desafio,
            fecha_aplicacion: fechaAplicacion,
            anio: Number(anio),
            fecha_creacion: serverTimestamp()
        })

        alert('Evaluación registrada correctamente')

        setCurso('')
        setDesafio('')
        setFechaAplicacion('')
        setAnio(new Date().getFullYear())

        cargarEvaluaciones()
    }

    const obtenerCurso = id => {
        const encontrado = cursos.find(item => item.id === id)

        return encontrado ? encontrado.nombre_curso : 'No encontrado'
    }

    const obtenerDesafio = id => {
        const encontrado = desafios.find(item => item.id === id)

        return encontrado ? encontrado.nombre : 'No encontrado'
    }

    return (
        <div className="pagina-evaluaciones">
            <h1>Gestión de Evaluaciones</h1>

            <Link className="volver" to="/admin">
                Volver al Dashboard
            </Link>

            <section className="seccion-evaluaciones">
                <h2>Registrar evaluación</h2>

                <form className="formulario-evaluaciones" onSubmit={registrarEvaluacion}>

                    <div>
                        <label>Curso</label>

                        <select
                            value={curso}
                            onChange={e => setCurso(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un curso</option>

                            {cursos.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre_curso}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Desafío</label>

                        <select
                            value={desafio}
                            onChange={e => setDesafio(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un desafío</option>

                            {desafios.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre} - {item.tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Fecha de aplicación</label>

                        <input
                            type="date"
                            value={fechaAplicacion}
                            onChange={e => setFechaAplicacion(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Año</label>

                        <input
                            type="number"
                            value={anio}
                            onChange={e => setAnio(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">
                        Registrar evaluación
                    </button>

                </form>
            </section>

            <section className="seccion-evaluaciones">
                <h2>Evaluaciones registradas</h2>

                <div className="tabla-contenedor">
                    <table className="tabla-evaluaciones">

                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Desafío</th>
                                <th>Fecha</th>
                                <th>Año</th>
                            </tr>
                        </thead>

                        <tbody>
                            {evaluaciones.map(item => (
                                <tr key={item.id}>
                                    <td>{obtenerCurso(item.id_curso)}</td>
                                    <td>{obtenerDesafio(item.id_desafio)}</td>
                                    <td>{item.fecha_aplicacion}</td>
                                    <td>{item.anio}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </section>

        </div>
    )
}

export default GestionEvaluaciones