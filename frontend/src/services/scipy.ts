import { apiFetch } from "./api";


export interface Estadisticas {
  cantidad: number;
  media: number;
  mediana: number;
  desviacion_estandar: number;
  minimo: number;
  maximo: number;
  percentil_25: number;
  percentil_75: number;
}


export interface MetricaGuardada {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad_registros: number;
  media: number | null;
  mediana: number | null;
  desviacion_estandar: number | null;
  minimo: number | null;
  maximo: number | null;
  percentil_25: number | null;
  percentil_75: number | null;
  created_at: string | null;
}


export interface InterpolacionRequest {
  x_conocidos: number[];
  y_conocidos: number[];
  x_estimar: number[];
}


export interface ValorInterpolado {
  x: number;
  valor_estimado: number;
}


export interface InterpolacionResponse {
  resultados: ValorInterpolado[];
}


export interface OptimizacionRequest {
  nombre: string;
  descripcion?: string | null;
  recurso_a_inicial: number;
  recurso_b_inicial: number;
  capacidad_minima: number;
}


export interface OptimizacionResponse {
  id: number;
  nombre: string;
  descripcion: string | null;

  parametros_entrada: {
    recurso_a_inicial: number;
    recurso_b_inicial: number;
    capacidad_minima: number;
  };

  resultado: {
    recurso_a: number;
    recurso_b: number;
    ahorro: number;
  } | null;

  costo_inicial: number | null;
  costo_optimizado: number | null;
  estado: string;
  created_at: string | null;
}


export function obtenerEstadisticas() {
  return apiFetch<Estadisticas>(
    "/api/scipy/estadisticas"
  );
}


export function guardarEstadisticas() {
  return apiFetch<MetricaGuardada>(
    "/api/scipy/estadisticas",
    {
      method: "POST",
    }
  );
}


export function interpolar(
  datos: InterpolacionRequest
) {
  return apiFetch<InterpolacionResponse>(
    "/api/scipy/interpolacion",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );
}


export function optimizar(
  datos: OptimizacionRequest
) {
  return apiFetch<OptimizacionResponse>(
    "/api/scipy/optimizacion",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );
}

export function obtenerMetricasGuardadas() {
  return apiFetch<MetricaGuardada[]>(
    "/api/scipy/metricas-guardadas"
  );
}


export function obtenerOptimizaciones() {
  return apiFetch<OptimizacionResponse[]>(
    "/api/scipy/optimizaciones"
  );
}