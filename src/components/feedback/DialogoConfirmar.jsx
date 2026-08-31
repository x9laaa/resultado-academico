import { useEffect, useRef } from 'react'
import './feedback.css'

function DialogoConfirmar({ mensaje, textoConfirmar, textoCancelar, peligro, onConfirmar, onCancelar }) {
  const botonRef = useRef(null)

  useEffect(() => {
    botonRef.current?.focus()

    const alPresionar = e => {
      if (e.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [onCancelar])

  return (
    <div className="dialogo-fondo" onClick={onCancelar}>
      <div
        className="dialogo"
        role="alertdialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <p className="dialogo-mensaje">{mensaje}</p>

        <div className="dialogo-acciones">
          <button type="button" className="dialogo-cancelar" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button
            type="button"
            ref={botonRef}
            className={peligro ? 'dialogo-confirmar peligro' : 'dialogo-confirmar'}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DialogoConfirmar
