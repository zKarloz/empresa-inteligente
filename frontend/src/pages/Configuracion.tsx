import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserCircle, ShieldCheck, Mail, LogOut, Camera, CameraOff } from "lucide-react";
import FaceRecognition from "../components/FaceRecognition";
import GestionUsuarios from "../components/GestionUsuarios";
import CambiarPassword from "../components/CambiarPassword";
import { registrarBiometria, obtenerEstadoBiometria } from "../services/biometria";
import { cerrarSesion as revocarSesion, obtenerUsuario, type Usuario } from "../services/auth";
import { ApiError } from "../services/api";
function Configuracion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [camaraRegistroActiva, setCamaraRegistroActiva] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [registrado, setRegistrado] = useState(false);
  const [passwordBiometria, setPasswordBiometria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const usuarioActual = {
    nombre: usuario?.nombre ?? "Cargando…",
    correo: usuario?.usuario_email ?? "",
    rol: usuario?.rol ?? "",
    estado: "Activo",
  };
  // Consultar perfil y estado real del registro, sin un correo escrito en el componente.
  useEffect(() => {
    let vigente = true;
    Promise.all([obtenerUsuario(), obtenerEstadoBiometria()])
      .then(([perfil, biometria]) => {
        if (vigente) {
          setUsuario(perfil);
          setRegistrado(biometria.registrado);
        }
      })
      .catch(() => {
        if (vigente) setMensaje("No se pudo cargar el perfil o el estado facial");
      });
    return () => {
      vigente = false;
    };
  }, []);
  // NAVEGACIÓN DESDE SIDEBAR
  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const id = location.hash.replace("#", "");
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location.hash, usuario]);
  // CERRAR SESIÓN
  async function cerrarSesion() {
    try {
      await revocarSesion();
      navigate("/login", { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        sessionStorage.removeItem("authToken");
        navigate("/login", { replace: true });
      } else setMensaje("No se pudo cerrar la sesión en el servidor. Vuelve a intentarlo");
    }
  }
  return (
    <main className="dashboard-page">
      {/* ENCABEZADO */}
      <header className="dashboard-header">
        <div>
          <h1>Configuración</h1>
          <p>Administración general y configuración del sistema</p>
        </div>
      </header>
      {/* PERFIL */}
      <section id="perfil" className="dashboard-panel profile-panel">
        <div className="profile-header">
          <div className="profile-avatar">
            <UserCircle size={38} />
          </div>
          <div className="profile-main-info">
            <span className="profile-label">Usuario actual</span>
            <h2>{usuarioActual.nombre}</h2>
            <p>
              <Mail size={14} />
              {usuarioActual.correo}
            </p>
          </div>
          <span className="profile-role">
            <ShieldCheck size={15} />
            {usuarioActual.rol}
          </span>
        </div>
        <div className="profile-details">
          <div className="profile-detail">
            <span>Rol</span>
            <strong>{usuarioActual.rol}</strong>
          </div>
          <div className="profile-detail">
            <span>Estado</span>
            <strong className="profile-active">● {usuarioActual.estado}</strong>
          </div>
          <div className="profile-detail">
            <span>Autenticación</span>
            <strong>Sesión del servidor</strong>
          </div>
          <div className="profile-detail">
            <span>Biometría facial</span>
            <strong className="profile-pending">
              {registrado ? "Registrada" : "Sin registrar"}
            </strong>
          </div>
        </div>
        <div className="profile-actions">
          <button type="button" className="logout-button" onClick={cerrarSesion}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </section>
      {mensaje && <p role="status">{mensaje}</p>}
      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Registrar rostro</h2>
            <p>Registro facial personal de {usuarioActual.nombre}.</p>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password-biometria">
            Tu contraseña actual para guardar el rostro
          </label>
          <input
            id="password-biometria"
            type="password"
            autoComplete="current-password"
            maxLength={256}
            value={passwordBiometria}
            onChange={(e) => setPasswordBiometria(e.target.value)}
          />
          <p>
            Guardar reemplaza únicamente las muestras de tu cuenta. Introduce tu
            contraseña antes de pulsar Guardar rostro.
          </p>
        </div>
        <div className="form-actions">
          {!camaraRegistroActiva ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setCamaraRegistroActiva(true)}
            >
              <Camera size={16} />
              Encender cámara
            </button>
          ) : (
            <button
              type="button"
              className="delete-button"
              onClick={() => setCamaraRegistroActiva(false)}
            >
              <CameraOff size={16} />
              Apagar cámara
            </button>
          )}
        </div>
        {camaraRegistroActiva ? (
          <FaceRecognition
            onRegistroCompleto={async (embeddings) => {
              if (!passwordBiometria)
                throw new Error(
                  "Introduce tu contraseña actual para guardar el rostro",
                );
              await registrarBiometria(embeddings, passwordBiometria);
              setPasswordBiometria("");
              setRegistrado(true);
              setMensaje("Biometría guardada correctamente");
            }}
          />
        ) : (
          <p>
            La cámara está apagada. Enciéndela únicamente cuando quieras registrar un
            rostro.
          </p>
        )}
      </section>
      <CambiarPassword />
      {/* La API también comprueba el rol; ocultar el panel no es la protección. */}
      {usuario?.rol === "Administrador" && <GestionUsuarios />}
      {/* CATEGORÍAS */}
      <section id="categorias-config" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Categorías</h2>
            <p>Configuración de categorías utilizadas para clasificar comentarios</p>
          </div>
        </div>
        <p>
          Próximamente podrás crear, modificar y administrar las categorías del sistema.
        </p>
      </section>
      {/* AUDITORÍA */}
      <section id="auditoria" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Auditoría</h2>
            <p>Consulta de las acciones realizadas dentro de la aplicación</p>
          </div>
        </div>
        <p>
          Próximamente se mostrarán los eventos y acciones registradas por los usuarios.
        </p>
      </section>
    </main>
  );
}
export default Configuracion;
