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

  if (estado === "cargando") {
    return <p role="status">Comprobando sesión…</p>;
  }

  if (estado === "invalido") {
    return <Navigate to="/login" replace />;
  }

  if (estado === "error") {
    return (
      <div role="alert">
        <p>No se pudo conectar con el servidor.</p>
        <button type="button" onClick={() => {
          setEstado("cargando");
          setIntento((actual) => actual + 1);
        }}
        >Reintentar</button>
      </div>
    );
  }

  return <Outlet />;
}