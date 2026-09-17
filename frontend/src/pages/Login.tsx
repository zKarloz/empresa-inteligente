import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FaceLogin from "../components/FaceLogin";
import { iniciarSesion as autenticar, guardarSesion } from "../services/auth";
import { apiFetch, ApiError } from "../services/api";
import { Sparkles, Mail, LockKeyhole, ShieldCheck, ScanFace, MessageSquare } from "lucide-react";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [loginFacial, setLoginFacial] = useState(false);
  const bloqueo = useRef(false);
  const [challenge, setChallenge] = useState("");
  // Si el Sidebar antiguo vuelve a /login, también revocar su sesión de servidor.
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("isAuthenticated");
    if (token)
      void apiFetch<void>("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch((e: unknown) => {
        if (!(e instanceof ApiError && e.status === 401)) {
          setError(
            "Se cerró el acceso local, pero no se pudo revocar la sesión en el servidor",
          );
        }
      });
  }, []);

  // La contraseña se comprueba en FastAPI. El modo facial aún no abre una sesión.
  async function iniciarSesion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (bloqueo.current) return;
    bloqueo.current = true;
    setError(null);
    setCargando(true);
    try {
      const respuesta = await autenticar(email, password, loginFacial);
      setPassword("");
      if (respuesta.facial_pendiente) setChallenge(respuesta.token);
      else accesoFacialCorrecto(respuesta.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión");
    } finally {
      bloqueo.current = false;
      setCargando(false);
    }
  }
  function accesoFacialCorrecto(token: string) {
    guardarSesion(token);
    navigate("/dashboard", { replace: true });
  }
  return (
    <main className="login-page">
      {/* PANEL IZQUIERDO */}
      <section className="login-hero">
        <div className="login-hero-content">
          <div className="login-badge">
            <Sparkles size={15} />
            <span>IA & ANALÍTICA EMPRESARIAL</span>
          </div>
          <h1>
            Centro <span>Inteligente</span>
          </h1>
          <p>
            Plataforma empresarial para la gestión de clientes, análisis NLP, métricas
            científicas y automatización de procesos.
          </p>
          <div className="login-security-info">
            <ShieldCheck size={18} />
            <span>Acceso seguro al sistema empresarial</span>
          </div>
          <div className="login-landing-action">
            <button
              type="button"
              className="login-landing-button"
              onClick={() => navigate("/")}
            >
              <MessageSquare size={16} />
              Ir al formulario público
            </button>
          </div>
        </div>
      </section>
      {/* PANEL DERECHO */}
      <section className="login-panel">
        <div className="login-card">
          {/* LOGO */}
          <div className="login-logo">
            <Sparkles size={28} />
          </div>
          <div className="login-title">
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus credenciales para acceder al Centro Inteligente.</p>
          </div>
          {/* ERROR */}
          {error && <div className="login-error">{error}</div>}
          {/* FORMULARIO */}
          {!challenge && (
            <form className="login-form" onSubmit={iniciarSesion}>
              {/* CORREO */}
              <div className="login-form-group">
                <label htmlFor="login-email">Correo electrónico</label>
                <div className="login-input-container">
                  <Mail size={17} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    placeholder="tu.correo@empresa.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              {/* CONTRASEÑA */}
              <div className="login-form-group">
                <label htmlFor="login-password">Contraseña</label>
                <div className="login-input-container">
                  <LockKeyhole size={17} className="login-input-icon" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              {/* BOTÓN */}
              <button type="submit" className="login-button" disabled={cargando}>
                {cargando
                  ? "Verificando..."
                  : loginFacial
                    ? "Continuar con el rostro"
                    : "Ingresar al sistema"}
              </button>
            </form>
          )}
          {!challenge ? (
            <label className="login-face-button">
              <ScanFace size={17} />
              <input
                type="checkbox"
                checked={loginFacial}
                disabled={cargando}
                onChange={(e) => setLoginFacial(e.target.checked)}
              />
              Añadir verificación facial después de la contraseña
            </label>
          ) : (
            <div className="login-face-area">
              <FaceLogin challenge={challenge} onSuccess={accesoFacialCorrecto} />
              <button
                type="button"
                className="login-face-cancel"
                onClick={() => setChallenge("")}
              >
                Volver al formulario
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
export default Login;
