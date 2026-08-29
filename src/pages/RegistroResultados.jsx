import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import './RegistroResultados.css'
import Navbar from '../components/Navbar'

const NIVELES = { LOGRADO: 'Logrado', ADECUADO: 'Adecuado', INSUFICIENTE: 'Insuficiente' }

function RegistroResultados() {
  const [evaluaciones, setEvaluaciones] = useState([])
  const [desafios, setDesafios] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [evaluacion, setEvaluacion] = useState('')
  const [resultados, setResultados] = useState({})
  const [guardando, setGuardando] = useState(false)

  useEffect(() => { cargarDatos() }, [])

  const cargarColeccion = async nombre => {
    const datos = await getDocs(collection(db, nombre))
    return datos.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const cargarDatos = async () => {
    try {
      const [evals, des, cur] = await Promise.all([cargarColeccion('evaluaciones'), cargarColeccion('desafios'), cargarColeccion('cursos')])
      setEvaluaciones(evals)
      setDesafios(des)
      setCursos(cur)
    } catch (error) {
      console.error(error)
      alert('Error al cargar los datos')
    }
  }

  const obtenerCurso = id => cursos.find(c => c.id === id)?.nombre_curso || 'Curso'
  const obtenerDesafio = id => desafios.find(d => d.id === id)?.nombre || 'Desafío'

  const seleccionarEvaluacion = async id => {
    setEvaluacion(id)
    setEstudiantes([])
    setResultados({})

    if (!id) return

    const evaluacionActual = evaluaciones.find(e => e.id === id)
    if (!evaluacionActual) return

    try {
      const estudiantesQuery = query(collection(db, 'estudiantes'), where('id_curso', '==', evaluacionActual.id_curso))
      const estudiantesData = await getDocs(estudiantesQuery)
      const lista = estudiantesData.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      setEstudiantes(lista)

      const resultadosIniciales = Object.fromEntries(lista.map(e => [e.id, { id_resultado: null }]))

      const resultadosQuery = query(collection(db, 'resultados'), where('id_evaluacion', '==', id))
      const resultadosData = await getDocs(resultadosQuery)

      resultadosData.forEach(docResultado => {
        const resultado = docResultado.data()
        if (resultadosIniciales[resultado.id_estudiante]) resultadosIniciales[resultado.id_estudiante] = { ...resultado, id_resultado: docResultado.id }
      })

      setResultados(resultadosIniciales)
    } catch (error) {
      console.error(error)
      alert('Error al cargar estudiantes y resultados')
    }
  }

  const evaluacionSeleccionada = evaluaciones.find(e => e.id === evaluacion)
  const desafioSeleccionado = evaluacionSeleccionada ? desafios.find(d => d.id === evaluacionSeleccionada.id_desafio) : null
  const esVelocidadLectora = desafioSeleccionado?.tipo === 'Velocidad Lectora'
  const puntajeMaximo = esVelocidadLectora ? 200 : Number(desafioSeleccionado?.puntaje_maximo || 0)

  const cambiarResultado = (id, campo, valor) => {
    setResultados(prev => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }))
  }

  const calcularPuntaje = id => {
    if (!desafioSeleccionado) return 0

    const resultado = resultados[id] || {}

    if (esVelocidadLectora) return Number(resultado.palabras || 0)

    return desafioSeleccionado.campos?.reduce((total, campo) => total + Number(resultado[campo] || 0), 0) || 0
  }

  const calcularNivel = puntaje => {
    if (!desafioSeleccionado) return ''

    const adecuado = Number(desafioSeleccionado.adecuado_desde)
    const logrado = Number(desafioSeleccionado.logrado_desde)

    if (puntaje >= logrado) return NIVELES.LOGRADO
    if (puntaje >= adecuado) return NIVELES.ADECUADO
    return NIVELES.INSUFICIENTE
  }

  const guardarResultados = async () => {
    if (!evaluacionSeleccionada || !desafioSeleccionado) return alert('Seleccione una evaluación')
    if (!estudiantes.length) return alert('Esta evaluación no tiene estudiantes para registrar')

    setGuardando(true)

    try {
      for (const estudiante of estudiantes) {
        const resultado = resultados[estudiante.id] || {}
        const puntaje = calcularPuntaje(estudiante.id)

        const datos = {
          id_estudiante: estudiante.id,
          id_evaluacion: evaluacionSeleccionada.id,
          id_curso: evaluacionSeleccionada.id_curso,
          id_desafio: evaluacionSeleccionada.id_desafio,
          puntaje_obtenido: puntaje,
          puntaje_maximo: esVelocidadLectora ? null : Number(desafioSeleccionado.puntaje_maximo),
          nivel_desempeno: calcularNivel(puntaje)
        }

        if (esVelocidadLectora) datos.palabras = resultado.palabras || 0
        else desafioSeleccionado.campos?.forEach(campo => datos[campo] = Number(resultado[campo] || 0))

        if (resultado.id_resultado) await updateDoc(doc(db, 'resultados', resultado.id_resultado), datos)
        else {
          const nuevo = await addDoc(collection(db, 'resultados'), datos)
          setResultados(prev => ({ ...prev, [estudiante.id]: { ...prev[estudiante.id], id_resultado: nuevo.id } }))
        }
      }

      alert('Resultados guardados correctamente')
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error al guardar los resultados')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="pagina-resultados">
        <h1>Registro de Resultados</h1>
        <section className="seccion-resultados">
          <h2>Seleccionar evaluación</h2>

          <div className="seleccion-resultados">
            <div>
              <label>Evaluación</label>

              <select value={evaluacion} onChange={e => seleccionarEvaluacion(e.target.value)}>
                <option value="">Seleccione una evaluación</option>

                {evaluaciones.map(item => (
                  <option key={item.id} value={item.id}>
                    {obtenerCurso(item.id_curso)} - {obtenerDesafio(item.id_desafio)} - {item.fecha_aplicacion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {evaluacionSeleccionada && desafioSeleccionado && (
          <section className="seccion-resultados">

            <h2>{desafioSeleccionado.nombre}</h2>

            <p><strong>Curso:</strong> {obtenerCurso(evaluacionSeleccionada.id_curso)}</p>
            <p><strong>Tipo:</strong> {desafioSeleccionado.tipo}</p>
            <p><strong>Fecha:</strong> {evaluacionSeleccionada.fecha_aplicacion}</p>

            {!esVelocidadLectora && <p><strong>Puntaje máximo:</strong> {desafioSeleccionado.puntaje_maximo}</p>}

            <div className="rangos-resultados">
              <p><strong>Insuficiente:</strong> 0 - {Number(desafioSeleccionado.adecuado_desde) - 1}</p>
              <p><strong>Adecuado:</strong> {desafioSeleccionado.adecuado_desde} - {Number(desafioSeleccionado.logrado_desde) - 1}</p>
              <p><strong>Logrado:</strong> {desafioSeleccionado.logrado_desde} - {puntajeMaximo}</p>
            </div>

            <div className="tabla-contenedor">
              <table className="tabla-resultados">
                <thead>
                  <tr>
                    <th>Estudiante</th>

                    {esVelocidadLectora ? <th>Palabras</th> : desafioSeleccionado.etiquetas?.map(etiqueta => <th key={etiqueta}>{etiqueta}</th>)}

                    <th>Puntaje</th>
                    <th>Nivel</th>
                  </tr>
                </thead>

                <tbody>
                  {estudiantes.map(estudiante => {
                    const puntaje = calcularPuntaje(estudiante.id)

                    return (
                      <tr key={estudiante.id}>
                        <td>{estudiante.nombre} {estudiante.apellido}</td>

                        {esVelocidadLectora ? (
                          <td>
                            <input type="number" min="0" value={resultados[estudiante.id]?.palabras ?? ''} onChange={e => cambiarResultado(estudiante.id, 'palabras', e.target.value)} />
                          </td>
                        ) : (
                          desafioSeleccionado.campos?.map(campo => (
                            <td key={campo}>
                              <input type="number" min="0" value={resultados[estudiante.id]?.[campo] ?? ''} onChange={e => cambiarResultado(estudiante.id, campo, e.target.value)} />
                            </td>
                          ))
                        )}

                        <td>{esVelocidadLectora ? puntaje : `${puntaje} / ${desafioSeleccionado.puntaje_maximo}`}</td>
                        <td>{calcularNivel(puntaje)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!estudiantes.length && <p>No hay estudiantes registrados en este curso.</p>}

            <button onClick={guardarResultados} disabled={guardando || !estudiantes.length}>
              {guardando ? 'Guardando...' : 'Guardar todos los resultados'}
            </button>

          </section>
        )}
      </div>
    </>
  )
}

export default RegistroResultados