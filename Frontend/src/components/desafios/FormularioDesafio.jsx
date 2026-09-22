import RangoDobleSlider from './RangoDobleSlider'
import Campo from '../common/Campo'
import { TIPOS } from '../../utils/desafio'

function FormularioDesafio({
  valores,
  desafioEditar,
  maximoVisual,
  obtenerPuntajeMaximo,
  setNombre,
  cambiarTipo,
  setCantidadDias,
  cambiarPuntajeMaximo,
  cambiarMaxLocalizar,
  cambiarMaxInterpretar,
  cambiarMaxReflexionar,
  setAdecuadoDesde,
  setLogradoDesde,
  onSubmit,
  onCancelar
}) {
  const { nombre, tipo, cantidadDias, puntajeMaximo, maxLocalizar, maxInterpretar, maxReflexionar, adecuadoDesde, logradoDesde } = valores

  return (
    <form className="formulario-desafios" onSubmit={onSubmit}>
      <Campo label="Nombre del desafío">
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </Campo>

      <Campo label="Tipo de desafío">
        <select value={tipo} onChange={e => cambiarTipo(e.target.value)} required>
          <option value="">Seleccione un tipo</option>
          <option value={TIPOS.MATEMATICA}>{TIPOS.MATEMATICA}</option>
          <option value={TIPOS.LENGUAJE}>{TIPOS.LENGUAJE}</option>
          <option value={TIPOS.VELOCIDAD_LECTORA}>{TIPOS.VELOCIDAD_LECTORA}</option>
        </select>
      </Campo>

      {tipo === TIPOS.MATEMATICA && (
        <>
          <Campo label="Cantidad de días">
            <input type="number" min="1" value={cantidadDias} onChange={e => setCantidadDias(e.target.value)} required />
          </Campo>
          <Campo label="Puntaje máximo">
            <input type="number" min="2" value={puntajeMaximo} onChange={e => cambiarPuntajeMaximo(e.target.value)} required />
          </Campo>
        </>
      )}

      {tipo === TIPOS.LENGUAJE && (
        <>
          <Campo label="Puntaje máximo Localizar">
            <input type="number" min="0" value={maxLocalizar} onChange={e => cambiarMaxLocalizar(e.target.value)} required />
          </Campo>
          <Campo label="Puntaje máximo Interpretar/Inferir">
            <input type="number" min="0" value={maxInterpretar} onChange={e => cambiarMaxInterpretar(e.target.value)} required />
          </Campo>
          <Campo label="Puntaje máximo Reflexionar">
            <input type="number" min="0" value={maxReflexionar} onChange={e => cambiarMaxReflexionar(e.target.value)} required />
          </Campo>
          <Campo label="Puntaje máximo total">
            <input type="number" value={obtenerPuntajeMaximo()} disabled />
          </Campo>
        </>
      )}

      {tipo === TIPOS.VELOCIDAD_LECTORA && (
        <Campo label="Cantidad máxima de palabras leídas">
          <input type="number" min="2" value={puntajeMaximo} onChange={e => cambiarPuntajeMaximo(e.target.value)} required />
        </Campo>
      )}

      {tipo && maximoVisual > 0 && (
        <div className="clasificacion">
          <h3>Clasificación del desafío</h3>

          <RangoDobleSlider
            minimo={0}
            maximo={maximoVisual}
            adecuadoDesde={Number(adecuadoDesde)}
            logradoDesde={Number(logradoDesde)}
            onCambiarAdecuado={setAdecuadoDesde}
            onCambiarLogrado={setLogradoDesde}
          />

          <div className="resultado-rangos">
            <div><strong>Insuficiente</strong><span>0 - {Number(adecuadoDesde) - 1}</span></div>
            <div><strong>Adecuado</strong><span>{adecuadoDesde} - {Number(logradoDesde) - 1}</span></div>
            <div><strong>Logrado</strong><span>{logradoDesde} - {maximoVisual}</span></div>
          </div>
        </div>
      )}

      <div className="botones-desafio">
        <button type="submit">{desafioEditar ? 'Guardar cambios' : 'Registrar desafío'}</button>
        {desafioEditar && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}

export default FormularioDesafio
