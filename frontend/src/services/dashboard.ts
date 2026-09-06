import { apiFetch } from "./api";


export interface CategoriaNLP {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}


export interface PalabraFrecuente {
  palabra: string;
  frecuencia: number;
}


export interface TiempoAtencion {
  fecha: string;
  promedio: number;
  cantidad: number;
}


export interface DashboardData {
  clientes: number;
  comentarios: number;
  promedio_atencion: number;
  porcentaje_procesados: number;

  categorias_nlp: CategoriaNLP[];
  palabras_frecuentes: PalabraFrecuente[];
  tiempos_atencion: TiempoAtencion[];
}


export function obtenerDashboard() {
  return apiFetch<DashboardData>(
    "/api/dashboard"
  );
}