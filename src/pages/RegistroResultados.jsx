import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { db } from '../config'
import './RegistroResultados.css'

function RegistroResultados() {
  const [evaluaciones, setEvaluaciones] = useState([])
  const [desafios, setDesafios] = useState([])
  const [cursos, setCursos] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [evaluacion, setEvaluacion] = useState('')
  const [resultados, setResultados] = useState({})
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const datosEvaluaciones = await getDocs(collection(db, 'evaluaciones'))
    const datosDesafios = await getDocs(collection(db, 'desafios'))
    const datosCursos = await getDocs(collection(db, 'cursos'))

    setEvaluaciones(datosEvaluaciones.docs.map(item => ({
      id: item.id,
      ...item.data()
    })))

    setDesafios(datosDesafios.docs.map(item => ({
      id: item.id,
      ...item.data()
    })))

    setCursos(datosCursos.docs.map(item => ({
      id: item.id,
      ...item.data()
    })))
  }

  const obtenerCurso = id => {
    const curso = cursos.find(item => item.id === id)
    return curso ? curso.nombre_curso : 'Curso'
  }

  const obtenerDesafio = id => {
    const desafio = desafios.find(item => item.id === id)
    return desafio ? desafio.nombre : 'Desafío'
  }

  const seleccionarEvaluacion = async idEvaluacion => {
    setEvaluacion(idEvaluacion)
    setEstudiantes([])
    setResultados({})

    if (!idEvaluacion) return

    const evaluacionSeleccionada = evaluaciones.find(
      item => item.id === idEvaluacion
    )

    if (!evaluacionSeleccionada) return

    const consulta = query(
      collection(db, 'estudiantes'),
      where('id_curso', '==', evaluacionSeleccionada.id_curso)
    )

    const datos = await getDocs(consulta)

    const lista = datos.docs.map(item => ({
      id: item.id,
      ...item.data()
    }))

    setEstudiantes(lista)

    const resultadosIniciales = {}

    lista.forEach(estudiante => {
      resultadosIniciales[estudiante.id] = {}
    })

    setResultados(resultadosIniciales)
  }

  const evaluacionSeleccionada = evaluaciones.find(
    item => item.id === evaluacion
  )

  const desafioSeleccionado = evaluacionSeleccionada
    ? desafios.find(item => item.id === evaluacionSeleccionada.id_desafio)
    : null

  const cambiarResultado = (idEstudiante, campo, valor) => {
    setResultados(anterior => ({
      ...anterior,
      [idEstudiante]: {
        ...anterior[idEstudiante],
        [campo]: valor
      }
    }))
  }

  const calcularPuntaje = idEstudiante => {
    if (!desafioSeleccionado) return 0

    const resultado = resultados[idEstudiante] || {}

    if (desafioSeleccionado.tipo === 'Velocidad Lectora') {
      return Number(resultado.palabras || 0)
    }

    return desafioSeleccionado.campos.reduce(
      (total, campo) => total + Number(resultado[campo] || 0),
      0
    )
  }

  const calcularNivel = puntaje => {
    if (!desafioSeleccionado) return ''

    if (
      puntaje >= Number(desafioSeleccionado.rango_logrado_desde) &&
      puntaje <= Number(desafioSeleccionado.rango_logrado_hasta)
    ) {
      return 'Logrado'
    }

    if (
      puntaje >= Number(desafioSeleccionado.rango_adecuado_desde) &&
      puntaje <= Number(desafioSeleccionado.rango_adecuado_hasta)
    ) {
      return 'Adecuado'
    }

    if (
      puntaje >= Number(desafioSeleccionado.rango_insuficiente_desde) &&
      puntaje <= Number(desafioSeleccionado.rango_insuficiente_hasta)
    ) {
      return 'Insuficiente'
    }

    return 'Sin clasificación'
  }

  const guardarResultados = async () => {
    if (!evaluacionSeleccionada || !desafioSeleccionado) {
      alert('Seleccione una evaluación')
      return
    }

    if (estudiantes.length === 0) {
      alert('Esta evaluación no tiene estudiantes para registrar')
      return
    }

    setGuardando(true)

    try {
      for (const estudiante of estudiantes) {
        const puntaje = calcularPuntaje(estudiante.id)
        const nivel = calcularNivel(puntaje)

        await addDoc(collection(db, 'resultados'), {
          id_estudiante: estudiante.id,
          id_evaluacion: evaluacionSeleccionada.id,
          id_curso: evaluacionSeleccionada.id_curso,
          id_desafio: evaluacionSeleccionada.id_desafio,
          ...resultados[estudiante.id],
          puntaje_obtenido: puntaje,
          puntaje_maximo: desafioSeleccionado.tipo === 'Velocidad Lectora'
            ? null
            : desafioSeleccionado.puntaje_maximo,
          nivel_desempeno: nivel
        })
      }

      alert('Resultados guardados correctamente')
      setResultados({})
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error al guardar los resultados')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="pagina-resultados">

      <h1>Registro de Resultados</h1>

      <Link className="volver" to="/admin">
        Volver al Dashboard
      </Link>

      <section className="seccion-resultados">

        <h2>Seleccionar evaluación</h2>

        <div className="seleccion-resultados">

          <div>
            <label>Evaluación</label>

            <select
              value={evaluacion}
              onChange={e => seleccionarEvaluacion(e.target.value)}
            >
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

          <p><strong>Fecha de aplicación:</strong> {evaluacionSeleccionada.fecha_aplicacion}</p>

          {desafioSeleccionado.tipo !== 'Velocidad Lectora' && (
            <p>
              <strong>Puntaje máximo:</strong> {desafioSeleccionado.puntaje_maximo}
            </p>
          )}

          <div className="rangos-resultados">

            <p>
              <strong>Logrado:</strong> {desafioSeleccionado.rango_logrado_desde} - {desafioSeleccionado.rango_logrado_hasta}
            </p>

            <p>
              <strong>Adecuado:</strong> {desafioSeleccionado.rango_adecuado_desde} - {desafioSeleccionado.rango_adecuado_hasta}
            </p>

            <p>
              <strong>Insuficiente:</strong> {desafioSeleccionado.rango_insuficiente_desde} - {desafioSeleccionado.rango_insuficiente_hasta}
            </p>

          </div>

          <div className="tabla-contenedor">

            <table className="tabla-resultados">

              <thead>
                <tr>

                  <th>Estudiante</th>

                  {desafioSeleccionado.etiquetas.map(etiqueta => (
                    <th key={etiqueta}>{etiqueta}</th>
                  ))}

                  <th>
                    {desafioSeleccionado.tipo === 'Velocidad Lectora'
                      ? 'Palabras'
                      : 'Puntaje'}
                  </th>

                  <th>Nivel</th>

                </tr>
              </thead>

              <tbody>

                {estudiantes.map(estudiante => {
                  const puntaje = calcularPuntaje(estudiante.id)
                  const nivel = calcularNivel(puntaje)

                  return (
                    <tr key={estudiante.id}>

                      <td>
                        {estudiante.nombre} {estudiante.apellido}
                      </td>

                      {desafioSeleccionado.campos.map(campo => (
                        <td key={campo}>

                          <input
                            type="number"
                            min="0"
                            value={resultados[estudiante.id]?.[campo] || ''}
                            onChange={e => cambiarResultado(
                              estudiante.id,
                              campo,
                              e.target.value
                            )}
                          />

                        </td>
                      ))}

                      <td>
                        {desafioSeleccionado.tipo === 'Velocidad Lectora'
                          ? puntaje
                          : `${puntaje} / ${desafioSeleccionado.puntaje_maximo}`}
                      </td>

                      <td>{nivel}</td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

          {estudiantes.length === 0 && (
            <p>No hay estudiantes registrados en este curso.</p>
          )}

          <button
            onClick={guardarResultados}
            disabled={guardando || estudiantes.length === 0}
          >
            {guardando ? 'Guardando...' : 'Guardar todos los resultados'}
          </button>

        </section>
      )}

    </div>
  )
}

export default RegistroResultados