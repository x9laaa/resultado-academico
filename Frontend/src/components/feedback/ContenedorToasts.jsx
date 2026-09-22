import './feedback.css'

function ContenedorToasts({ toasts, onCerrar }) {
  if (!toasts.length) return null

  return (
    <div className="toasts" role="region" aria-label="Avisos">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.tipo}`} role="status">
          <span className="toast-mensaje">{toast.mensaje}</span>
          <button
            type="button"
            className="toast-cerrar"
            onClick={() => onCerrar(toast.id)}
            aria-label="Cerrar aviso"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ContenedorToasts
