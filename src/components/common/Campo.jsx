import './Campo.css'

function Campo({ label, htmlFor, children }) {
  return (
    <div className="campo">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}

export default Campo
