import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { obtenerUsuario } from "../services/auth";
import { ApiError } from "../services/api";

type EstadoSesion = "cargando" | "valido" | "invalido" | "error";

export default function ProtectedRoute() {
  const [estado, setEstado] = useState<EstadoSesion>("cargando");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    // Comprobar la sesión al entrar al área privada.
    // Cambiar de sección no vuelve a ejecutar este efecto.
    obtenerUsuario()
      .then(() => {
        if (activo) setEstado("valido");
      })
      .catch((error: unknown) => {
        if (!activo) return;

        if (error instanceof ApiError && error.status === 401) {
          sessionStorage.removeItem("authToken");
          setEstado("invalido");
        } else {
          setEstado("error");
        }
      });

    // Ignorar respuestas si el usuario abandona el área privada.
    return () => {
      activo = false;
    };
  }, [intento]);

  if (estado === "invalido") {
    return <Navigate to="/login" replace />;
  }

  // La pantalla dura únicamente lo que tarde la comprobación real.
  if (estado === "cargando" || estado === "error") {
    const hayError = estado === "error";
    return (
      <main className="session-screen">
        <section className="session-screen-content" aria-labelledby="session-title">
          <p className="session-screen-brand">Centro Inteligente</p>
          <div className={hayError ? "session-screen-icon session-screen-icon--error" : "session-screen-icon"}
            aria-hidden="true">
            {hayError ? "!" : <span className="session-screen-spinner" />}
          </div>
          <div role={hayError ? "alert" : "status"} aria-atomic="true">
            <h1 id="session-title">
              {hayError ? "No pudimos verificar tu sesión" : "Verificando tu sesión"}
            </h1>
            <p className="session-screen-description">
              {hayError
                ? "No se pudo conectar con el servidor. Inténtalo nuevamente."
                : "Estamos preparando tu acceso al dashboard."}
            </p>
          </div>
          {hayError ? (
            <button type="button" className="session-screen-retry" onClick={() => {
              setEstado("cargando");
              setIntento((actual) => actual + 1);
            }}>Reintentar</button>
          ) : (
            <p className="session-screen-note">Un momento, por favor.</p>
          )}
        </section>
      </main>
    );
  }

  return <Outlet />;
}