import { apiFetch } from "./api";


export interface Comentario {
  id: number;
  cliente_id: number | null;

  // NUEVO
  nombre_cliente: string | null;
  apellido_cliente: string | null;
  empresa_cliente: string | null;
  telefono_cliente: string | null;
  correo_cliente: string | null;
  contenido: string;
  canal: string;
  estado: string;
  categoria: string | null;
  fecha: string | null;
  procesado: boolean;
}

export interface ComentarioCreate {
  cliente_id: number | null;

  // NUEVO
  nombre_cliente: string | null;
  apellido_cliente: string | null;
  empresa_cliente: string | null;
  telefono_cliente: string | null;
  correo_cliente: string | null;
  contenido: string;
  canal: string;
  estado: string;
  categoria: string | null;
}


export function obtenerComentarios() {
  return apiFetch<Comentario[]>(
    "/api/comentarios"
  );
}


export function crearComentario(
  datos: ComentarioCreate
) {
  return apiFetch<Comentario>(
    "/api/comentarios",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );
}


export function eliminarComentario(
  id: number
) {
  return apiFetch<void>(
    `/api/comentarios/${id}`,
    {
      method: "DELETE",
    }
  );
}