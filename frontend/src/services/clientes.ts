import { apiFetch } from "./api";


export interface Cliente {
  id: number;
  nombre: string;
  email: string | null;
  telefono: string | null;
  empresa: string | null;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}


export interface ClienteCreate {
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  empresa?: string | null;
  activo?: boolean;
}


export interface ClienteUpdate {
  nombre?: string;
  email?: string | null;
  telefono?: string | null;
  empresa?: string | null;
  activo?: boolean;
}


export function obtenerClientes() {
  return apiFetch<Cliente[]>(
    "/api/clientes"
  );
}


export function obtenerCliente(
  id: number
) {
  return apiFetch<Cliente>(
    `/api/clientes/${id}`
  );
}


export function crearCliente(
  datos: ClienteCreate
) {
  return apiFetch<Cliente>(
    "/api/clientes",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );
}


export function actualizarCliente(
  id: number,
  datos: ClienteUpdate
) {
  return apiFetch<Cliente>(
    `/api/clientes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(datos),
    }
  );
}


export function eliminarCliente(
  id: number
) {
  return apiFetch<void>(
    `/api/clientes/${id}`,
    {
      method: "DELETE",
    }
  );
}