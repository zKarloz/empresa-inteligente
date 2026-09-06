import { apiFetch } from "./api";


export interface PalabraFrecuente {
  palabra: string;
  frecuencia: number;
}


export interface AnalisisTexto {
  cantidad_palabras: number;
  tokens: string[];
  palabras_frecuentes: PalabraFrecuente[];
}


export interface Clasificacion {
  categoria: string;
  confianza: number;
}


export interface AnalisisNLP {
  id: number;
  comentario_id: number;
  idioma: string;
  cantidad_palabras: number;

  palabras_limpias: string[] | null;

  palabras_frecuentes:
    | PalabraFrecuente[]
    | null;

  categoria_detectada:
    | string
    | null;

  confianza:
    | number
    | null;

  fecha_analisis:
    | string
    | null;
}


export function analizarTexto(
  texto: string
) {
  return apiFetch<AnalisisTexto>(
    "/api/nltk/analizar",
    {
      method: "POST",
      body: JSON.stringify({
        texto,
      }),
    }
  );
}


export function clasificarTexto(
  texto: string
) {
  return apiFetch<Clasificacion>(
    "/api/nltk/clasificar",
    {
      method: "POST",
      body: JSON.stringify({
        texto,
      }),
    }
  );
}


export function analizarComentarioGuardado(
  comentarioId: number
) {
  return apiFetch<AnalisisNLP>(
    `/api/nltk/comentarios/${comentarioId}/analizar`,
    {
      method: "POST",
    }
  );
}


export function obtenerAnalisisNLP() {
  return apiFetch<AnalisisNLP[]>(
    "/api/nltk/analisis"
  );
}