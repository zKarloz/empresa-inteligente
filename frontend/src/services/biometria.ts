import { apiFetch } from "./api";

export interface EstadoBiometria {
  registrado: boolean;
  usuario_email: string;
  cantidad_muestras: number;
}
export interface VerificacionBiometria {
  verificado: boolean;
  similitud: number;
  coincidencias: number;
  token: string | null;
  usuario_email: string;
}
export const obtenerEstadoBiometria = () => apiFetch<EstadoBiometria>("/api/biometria/estado");
export function registrarBiometria(embeddings: number[][]) {
  return apiFetch<EstadoBiometria>("/api/biometria/registrar", {
    method: "POST",
    body: JSON.stringify({ embeddings }),
  });
}
export function verificarBiometria(challenge: string, embedding: number[]) {
  // El reto sirve únicamente para verificar el rostro; no es la sesión del dashboard.
  return apiFetch<VerificacionBiometria>("/api/biometria/verificar", {
    method: "POST",
    headers: { Authorization: `Bearer ${challenge}` },
    body: JSON.stringify({ embedding }),
  });
}
