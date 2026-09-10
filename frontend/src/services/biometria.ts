import {
  apiFetch,
} from "./api";


export interface RegistroBiometriaResponse {
  id: number;

  usuario_email: string;

  cantidad_muestras: number;

  registrado: boolean;

  mensaje: string;
}


export interface EstadoBiometria {
  usuario_email: string;

  registrado: boolean;

  cantidad_muestras: number;

  activo: boolean;
}


export async function registrarBiometria(
  usuarioEmail: string,
  embeddings: number[][]
) {

  return apiFetch<RegistroBiometriaResponse>(
    "/api/biometria/registrar",
    {
      method: "POST",

      body: JSON.stringify({
        usuario_email:
          usuarioEmail,

        embeddings,
      }),
    }
  );

}


export async function obtenerEstadoBiometria(
  usuarioEmail: string
) {

  return apiFetch<EstadoBiometria>(
    `/api/biometria/estado/${
      encodeURIComponent(
        usuarioEmail
      )
    }`
  );

}

export interface VerificacionBiometriaResponse {
  verificado: boolean;

  usuario_email: string;

  similitud: number;

  muestra_coincidente:
    number | null;

  mensaje: string;
}


export async function verificarBiometria(
  usuarioEmail: string,
  embedding: number[]
) {

  return apiFetch<VerificacionBiometriaResponse>(
    "/api/biometria/verificar",
    {
      method: "POST",

      body: JSON.stringify({
        usuario_email:
          usuarioEmail,

        embedding,
      }),
    }
  );

}