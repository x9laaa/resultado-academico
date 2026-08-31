import { useRef, useCallback } from 'react'
import './RangoDobleSlider.css'

function RangoDobleSlider({ minimo = 0, maximo, adecuadoDesde, logradoDesde, onCambiarAdecuado, onCambiarLogrado }) {
  const trackRef = useRef(null)

  const calcularValorDesdeClientX = useCallback(clientX => {
    const track = trackRef.current
    if (!track) return minimo

    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(minimo + ratio * (maximo - minimo))
  }, [minimo, maximo])

  const iniciarArrastre = manija => e => {
    e.preventDefault()

    const mover = eMove => {
      const clientX = eMove.clientX ?? eMove.touches?.[0]?.clientX
      const valor = calcularValorDesdeClientX(clientX)

      if (manija === 'adecuado') {
        onCambiarAdecuado(Math.min(valor, logradoDesde - 1))
      } else {
        onCambiarLogrado(Math.max(valor, adecuadoDesde + 1))
      }
    }

    const soltar = () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
    }

    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
  }

  const moverConTeclado = (manija, direccion) => {
    if (manija === 'adecuado') {
      const nuevo = adecuadoDesde + direccion
      if (nuevo >= minimo + 1 && nuevo < logradoDesde) onCambiarAdecuado(nuevo)
    } else {
      const nuevo = logradoDesde + direccion
      if (nuevo > adecuadoDesde && nuevo <= maximo) onCambiarLogrado(nuevo)
    }
  }

  const porcentaje = valor => (maximo > minimo ? ((valor - minimo) / (maximo - minimo)) * 100 : 0)
  const posAdecuado = porcentaje(adecuadoDesde)
  const posLogrado = porcentaje(logradoDesde)

  return (
    <div className="rango-doble-slider">
      <div className="rango-doble-slider__track" ref={trackRef}>
        <div
          className="rango-doble-slider__zona rango-doble-slider__zona--insuficiente"
          style={{ left: '0%', width: `${posAdecuado}%` }}
        />
        <div
          className="rango-doble-slider__zona rango-doble-slider__zona--adecuado"
          style={{ left: `${posAdecuado}%`, width: `${posLogrado - posAdecuado}%` }}
        />
        <div
          className="rango-doble-slider__zona rango-doble-slider__zona--logrado"
          style={{ left: `${posLogrado}%`, width: `${100 - posLogrado}%` }}
        />

        <div
          className="rango-doble-slider__manija"
          style={{ left: `${posAdecuado}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Adecuado desde"
          aria-valuemin={minimo}
          aria-valuemax={logradoDesde - 1}
          aria-valuenow={adecuadoDesde}
          onPointerDown={iniciarArrastre('adecuado')}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') moverConTeclado('adecuado', 1)
            if (e.key === 'ArrowLeft') moverConTeclado('adecuado', -1)
          }}
        >
          <span className="rango-doble-slider__etiqueta">{adecuadoDesde}</span>
        </div>

        <div
          className="rango-doble-slider__manija"
          style={{ left: `${posLogrado}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Logrado desde"
          aria-valuemin={adecuadoDesde + 1}
          aria-valuemax={maximo}
          aria-valuenow={logradoDesde}
          onPointerDown={iniciarArrastre('logrado')}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') moverConTeclado('logrado', 1)
            if (e.key === 'ArrowLeft') moverConTeclado('logrado', -1)
          }}
        >
          <span className="rango-doble-slider__etiqueta">{logradoDesde}</span>
        </div>
      </div>

      <div className="rango-doble-slider__extremos">
        <span>{minimo}</span>
        <span>{maximo}</span>
      </div>
    </div>
  )
}

export default RangoDobleSlider
