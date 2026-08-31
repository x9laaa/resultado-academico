import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import ContenedorToasts from '../components/feedback/ContenedorToasts'
import DialogoConfirmar from '../components/feedback/DialogoConfirmar'

const NotificacionesContext = createContext(null)

const DURACION_TOAST = 4500
let secuencia = 0

export function NotificacionesProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialogo, setDialogo] = useState(null)
  const resolverRef = useRef(null)

  const quitarToast = useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const mostrarToast = useCallback((mensaje, tipo) => {
    const id = ++secuencia
    setToasts(prev => [...prev, { id, mensaje, tipo }])
    setTimeout(() => quitarToast(id), DURACION_TOAST)
  }, [quitarToast])

  const toast = useMemo(() => ({
    exito: mensaje => mostrarToast(mensaje, 'exito'),
    error: mensaje => mostrarToast(mensaje, 'error'),
    info: mensaje => mostrarToast(mensaje, 'info')
  }), [mostrarToast])

  const confirmar = useCallback(opciones => new Promise(resolve => {
    resolverRef.current = resolve
    setDialogo({
      mensaje: opciones.mensaje,
      textoConfirmar: opciones.textoConfirmar || 'Confirmar',
      textoCancelar: opciones.textoCancelar || 'Cancelar',
      peligro: Boolean(opciones.peligro)
    })
  }), [])

  const responder = useCallback(valor => {
    setDialogo(null)
    resolverRef.current?.(valor)
    resolverRef.current = null
  }, [])

  const valor = useMemo(() => ({ toast, confirmar }), [toast, confirmar])

  return (
    <NotificacionesContext.Provider value={valor}>
      {children}
      <ContenedorToasts toasts={toasts} onCerrar={quitarToast} />
      {dialogo && (
        <DialogoConfirmar
          {...dialogo}
          onConfirmar={() => responder(true)}
          onCancelar={() => responder(false)}
        />
      )}
    </NotificacionesContext.Provider>
  )
}

export function useToast() {
  return useContext(NotificacionesContext).toast
}

export function useConfirmar() {
  return useContext(NotificacionesContext).confirmar
}
