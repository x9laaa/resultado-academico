import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../config'
import './Login.css'

function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setMensaje("");
        setCargando(true);

        try {
            const credenciales = await signInWithEmailAndPassword(
                auth,
                correo,
                password
            );
            const uid = credenciales.user.uid;
            const usuarioRef = doc(db, "usuarios", uid);
            const usuarioSnap = await getDoc(usuarioRef);

            if (!usuarioSnap.exists()) {
                setMensaje("El usuario no tiene información registrada.");
                return;
            }

            const usuario = usuarioSnap.data();

            switch (usuario.rol) {
                case "admin":
                    navigate("/admin");
                    break;
                case "profesor":
                    navigate("/profesor");
                    break;
                case "utp":
                    navigate("/utp");
                    break;
                default:
                    setMensaje("El usuario tiene un rol no válido.");
            }

        } catch (error) {
            console.error(error);
            switch (error.code) {
                case "auth/wrong-password":
                    setMensaje("Contraseña incorrecta.");
                    break;
                default:
                    setMensaje("Ocurrió un error al iniciar sesión.");
            }

        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="pagina-login">
            <section className="login-contenedor">
                <h1>Iniciar sesion</h1>
                <form onSubmit={iniciarSesion}>
                    <div className="campo">
                        <label>Correo electronico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="correo@ejemplo.cl"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Contrasena</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>

                    {mensaje && (
                        <p className="mensaje">{mensaje}</p>
                    )}
                    <button type="submit" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;
