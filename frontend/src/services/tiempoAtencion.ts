import { apiFetch } from "./api";


export interface TiempoAtencion {
  id: number;
  cliente_id: number | null;
  comentario_id: number | null;
  tiempo_minutos: number;
  fecha: string | null;
  operador: string | null;
  created_at: string | null;
}


export interface TiempoAtencionCreate {
  cliente_id?: number | null;
  comentario_id?: number | null;
  tiempo_minutos: number;
  operador?: string | null;
}


export function obtenerTiemposAtencion() {
  return apiFetch<TiempoAtencion[]>(
    "/api/tiempos-atencion"
  );
}


export function crearTiempoAtencion(
  datos: TiempoAtencionCreate
) {
  return apiFetch<TiempoAtencion>(
    "/api/tiempos-atencion",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );
}


export function eliminarTiempoAtencion(
  id: number
) {
  return apiFetch<void>(
    `/api/tiempos-atencion/${id}`,
    {
      method: "DELETE",
    }
  );
}