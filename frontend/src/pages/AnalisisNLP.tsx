import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtenerComentarios, type Comentario } from "../services/comentarios";
import {
  analizarTexto,
  clasificarTexto,
  analizarComentarioGuardado,
  obtenerAnalisisNLP,
  type AnalisisTexto,
  type Clasificacion,
  type AnalisisNLP,
} from "../services/nlp";
function AnalisisNLPPage() {
  // NAVEGACIÓN
  const location = useLocation();

  // ESTADOS
  const [avisoComentario, setAvisoComentario] = useState("");
  const [idioma, setIdioma] = useState("es");
  const [texto, setTexto] = useState("");
  const [resultadoTexto, setResultadoTexto] = useState<AnalisisTexto | null>(null);
  const [clasificacion, setClasificacion] = useState<Clasificacion | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [analisisGuardados, setAnalisisGuardados] = useState<AnalisisNLP[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [comentarioProcesando, setComentarioProcesando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [comentarioOriginal, setComentarioOriginal] = useState<Comentario | null>(null);

  // CARGAR DATOS
  async function cargarDatos() {
    try {
      const [datosComentarios, datosAnalisis] = await Promise.all([
        obtenerComentarios(),
        obtenerAnalisisNLP(),
      ]);
      setComentarios(datosComentarios);
      setAnalisisGuardados(datosAnalisis);
      setError(null);

      // Limpiar resultados anteriores para no mezclarlos

      // con los de otro comentario.
      setComentarioOriginal(null);
      setTexto("");
      setResultadoTexto(null);
      setClasificacion(null);
      setIdioma("es");
      setAvisoComentario("");

      // Encontrar el más reciente en un recorrido; desempatar por ID.
      const fechaEnMilisegundos = (fecha: string | null) => {
        const valor = fecha ? Date.parse(fecha) : NaN;
        return Number.isFinite(valor) ? valor : 0;
      };
      const ultimoComentario = datosComentarios.reduce<Comentario | undefined>(
        (ultimo, actual) => {
          if (!ultimo) return actual;
          const diferencia =
            fechaEnMilisegundos(actual.fecha) - fechaEnMilisegundos(ultimo.fecha);
          return diferencia > 0 || (diferencia === 0 && actual.id > ultimo.id)
            ? actual
            : ultimo;
        },
        undefined,
      );
      if (!ultimoComentario) {
        setAvisoComentario("Todavía no hay comentarios recibidos.");
        return;
      }

      // Mostrar el contenido original del último comentario.
      setComentarioOriginal(ultimoComentario);
      setTexto(ultimoComentario.contenido);

      // Buscar el análisis de ESE comentario por su ID.
      const analisis = datosAnalisis.find(
        (item) => item.comentario_id === ultimoComentario.id,
      );
      if (!ultimoComentario.procesado || !analisis) {
        setAvisoComentario(
          `Último comentario recibido: #${ultimoComentario.id}. ` +
          "Su análisis todavía no está disponible.",
        );
        return;
      }
      setIdioma(analisis.idioma);
      setResultadoTexto({
        cantidad_palabras: analisis.cantidad_palabras,
        tokens: analisis.palabras_limpias ?? [],
        palabras_frecuentes: analisis.palabras_frecuentes ?? [],
      });
      if (analisis.categoria_detectada !== null && analisis.confianza !== null) {
        setClasificacion({
          categoria: analisis.categoria_detectada,
          confianza: analisis.confianza,
          sentimiento: analisis.sentimiento,
          prioridad: analisis.prioridad,
        });
        setAvisoComentario(
          `Último comentario recibido: #${ultimoComentario.id}. ` +
          "Mostrando el análisis NLTK guardado.",
        );
      } else {
        setAvisoComentario(
          `Último comentario recibido: #${ultimoComentario.id}. ` +
          "El análisis guardado tiene una clasificación incompleta.",
        );
      }
    } catch (error) {
      console.error(error);
      setComentarioOriginal(null);
      setTexto("");
      setResultadoTexto(null);
      setClasificacion(null);
      setAvisoComentario("");
      setIdioma("es");
      setError("No se pudieron cargar los datos NLP");
    }
  }
  useEffect(() => {
    cargarDatos();
  }, []);

  // NAVEGACIÓN DESDE EL SIDEBAR
  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const id = location.hash.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  // ANALIZAR TEXTO LIBRE
  async function ejecutarAnalisis(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!texto.trim()) {
      setError("Escribe un comentario para analizar");
      return;
    }
    try {
      setProcesando(true);
      setError(null);
      // Solo persistimos si el texto sigue siendo el comentario original.
      // Una edición manual es una prueba y no sobrescribe datos del cliente.
      if (comentarioOriginal && texto === comentarioOriginal.contenido) {
        await analizarComentarioGuardado(comentarioOriginal.id);
        await cargarDatos();
        return;
      }
      const [analisis, resultadoClasificacion] = await Promise.all([
        analizarTexto(texto.trim()),
        clasificarTexto(texto.trim()),
      ]);
      setResultadoTexto(analisis);
      setClasificacion(resultadoClasificacion);
      setIdioma("es");
      setAvisoComentario("Prueba de texto libre: resultado calculado sin guardar en Supabase.");
    } catch (error) {
      console.error(error);
      setError("No se pudo analizar el texto");
    } finally {
      setProcesando(false);
    }
  }

  // ANALIZAR COMENTARIO GUARDADO
  async function procesarComentario(comentario: Comentario) {
    try {
      setComentarioProcesando(comentario.id);
      setError(null);
      await analizarComentarioGuardado(comentario.id);
      await cargarDatos();
    } catch (error) {
      console.error(error);
      setError("No se pudo procesar el comentario");
    } finally {
      setComentarioProcesando(null);
    }
  }

  // COMENTARIOS PENDIENTES
  const comentariosPendientes = comentarios.filter((comentario) => !comentario.procesado);

  // RESUMEN DE CATEGORÍAS NLP
  const resumenCategorias = analisisGuardados.reduce<Record<string, number>>(
    (acumulador, analisis) => {
      const categoria = analisis.categoria_detectada ?? "SIN CATEGORÍA";
      acumulador[categoria] = (acumulador[categoria] ?? 0) + 1;
      return acumulador;
    },
    {},
  );
  const categoriasOrdenadas = Object.entries(resumenCategorias).sort((a, b) => b[1] - a[1]);
  function claseConfianza(confianza: number) {
    if (confianza >= 0.7) {
      return "nlp-card-green";
    }
    if (confianza >= 0.4) {
      return "nlp-card-yellow";
    }
    return "nlp-card-red";
  }

  // Sentimiento y prioridad usan los mismos tres colores del semáforo.
  function claseEtiqueta(valor: string | null) {
    const colores: Record<string, string> = {
      POSITIVO: "nlp-card-green",
      NEUTRAL: "nlp-card-yellow",
      NEGATIVO: "nlp-card-red",
      ALTA: "nlp-card-red",
      MEDIA: "nlp-card-yellow",
      BAJA: "nlp-card-green",
    };
    return colores[valor?.toUpperCase() ?? ""] ?? "";
  }

  // INTERFAZ
  return (
    <main className="dashboard-page">
      {/* ENCABEZADO */}
      <header className="dashboard-header">
        <div>
          <h1>Inteligencia NLP</h1>
          <p>Tokenización, palabras frecuentes y clasificación de comentarios</p>
        </div>
      </header>
      {/* ERROR */}
      {error && <div className="message-error">{error}</div>}
      {/* ANALIZAR COMENTARIO */}
      <section id="analizar" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Analizar comentario</h2>
            <p>
              Al entrar se muestra el último comentario recibido y su análisis
              guardado. Puedes actualizar ese análisis o editar el texto para hacer una prueba sin guardar.
            </p>
          </div>
          <span className="panel-badge">NLTK</span>
        </div>
        {avisoComentario && <p role="status">{avisoComentario}</p>}
        <form className="client-form" onSubmit={ejecutarAnalisis}>
          <div className="form-group">
            <label htmlFor="texto-nlp">Comentario</label>
            <textarea
              id="texto-nlp"
              rows={5}
              value={texto}
              disabled={procesando || comentarioProcesando !== null}
              onChange={(evento) => {
                setTexto(evento.target.value);
                setResultadoTexto(null);
                setClasificacion(null);
                setIdioma("es");
                setAvisoComentario(
                  "Texto editado. Pulsa Analizar con NLTK para obtener sus resultados.",
                );
              }}
              placeholder="Ejemplo: Necesito ayuda porque el sistema presenta un error"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={procesando || comentarioProcesando !== null}>
              {procesando ? "Analizando..." : comentarioOriginal && texto === comentarioOriginal.contenido
                ? "Analizar y guardar" : "Analizar texto sin guardar"}
            </button>
          </div>
        </form>
        {/* RESULTADO GENERAL */}
        {resultadoTexto && clasificacion && (
          <div className="nlp-result">
            <div className="nlp-summary">
              {[
                {
                  titulo: "Idioma",
                  valor: idioma === "es" ? "Español" : idioma.toUpperCase(),
                  clase: "",
                },
                {
                  titulo: "Palabras útiles",
                  valor: resultadoTexto.cantidad_palabras,
                  clase: "",
                },
                { titulo: "Categoría", valor: clasificacion.categoria, clase: "" },
                {
                  titulo: "Confianza",
                  valor: `${(clasificacion.confianza * 100).toFixed(1)}%`,
                  clase: claseConfianza(clasificacion.confianza),
                },
                {
                  titulo: "Sentimiento",
                  valor: clasificacion.sentimiento ?? "—",
                  clase: claseEtiqueta(clasificacion.sentimiento),
                },
                {
                  titulo: "Prioridad",
                  valor: clasificacion.prioridad ?? "—",
                  clase: claseEtiqueta(clasificacion.prioridad),
                },
              ].map(({ titulo, valor, clase }) => (
                <div className={`nlp-result-card ${clase}`} key={titulo}>
                  <span>{titulo}</span>
                  <strong>{valor}</strong>
                </div>
              ))}
            </div>
            {/* TOKENS */}
            <div className="nlp-section">
              <h3>Tokens limpios</h3>
              <div className="word-list">
                {resultadoTexto.tokens.map((token, index) => (
                  <span key={`${token}-${index}`}>{token}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* PALABRAS FRECUENTES */}
        <div id="palabras" className="nlp-section">
          <h3>Palabras frecuentes</h3>
          {!resultadoTexto ? (
            <p>Analiza un comentario para visualizar las palabras más frecuentes.</p>
          ) : (
            <div className="word-list">
              {resultadoTexto.palabras_frecuentes.map((palabra) => (
                <span key={palabra.palabra}>
                  {palabra.palabra} ({palabra.frecuencia})
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* CLASIFICACIÓN */}
      <section id="clasificacion" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Clasificación de comentarios</h2>
            <p>
              {comentariosPendientes.length} comentario
              {comentariosPendientes.length !== 1 ? "s" : ""} pendiente
              {comentariosPendientes.length !== 1 ? "s" : ""} de análisis
            </p>
          </div>
          <span className="panel-badge">Clasificación NLP</span>
        </div>
        {comentariosPendientes.length === 0 ? (
          <p>Todos los comentarios han sido procesados.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Comentario</th>
                  <th>Canal</th>
                  <th>Categoría manual</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {comentariosPendientes.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>{comentario.id}</td>
                    <td>{comentario.contenido}</td>
                    <td>{comentario.canal}</td>
                    <td>{comentario.categoria ?? "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="primary-button"
                        disabled={procesando || comentarioProcesando !== null}
                        onClick={() => procesarComentario(comentario)}
                      >
                        {comentarioProcesando === comentario.id
                          ? "Procesando..."
                          : "Analizar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* CATEGORÍAS */}
      <section id="categorias" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Categorías detectadas</h2>
            <p>Distribución de los comentarios procesados por NLTK</p>
          </div>
          <span className="panel-badge">NLP</span>
        </div>
        {categoriasOrdenadas.length === 0 ? (
          <p>
            Todavía no existen categorías detectadas. Procesa comentarios para generar
            resultados.
          </p>
        ) : (
          <div className="category-list">
            {categoriasOrdenadas.map(([categoria, cantidad]) => {
              const porcentaje =
                analisisGuardados.length > 0
                  ? (cantidad / analisisGuardados.length) * 100
                  : 0;
              return (
                <div className="category-item" key={categoria}>
                  <div className="category-info">
                    <span>{categoria}</span>
                    <strong>
                      {cantidad}
                      {" · "}
                      {porcentaje.toFixed(1)}%
                    </strong>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-value"
                      style={{
                        width: `${porcentaje}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* HISTORIAL NLP */}
      <section id="historial-nlp" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Análisis realizados</h2>
            <p>
              {analisisGuardados.length} resultado
              {analisisGuardados.length !== 1 ? "s" : ""} almacenado
              {analisisGuardados.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {analisisGuardados.length === 0 ? (
          <p>Todavía no existen análisis almacenados.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Comentario</th>
                  <th>Palabras</th>
                  <th>Categoría</th>
                  <th>Confianza</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {analisisGuardados.map((analisis) => (
                  <tr key={analisis.id}>
                    <td>{analisis.id}</td>
                    <td>#{analisis.comentario_id}</td>
                    <td>{analisis.cantidad_palabras}</td>
                    <td>
                      <strong>{analisis.categoria_detectada ?? "—"}</strong>
                    </td>
                    <td>
                      {analisis.confianza !== null
                        ? `${(analisis.confianza * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td>
                      {analisis.fecha_analisis
                        ? new Date(analisis.fecha_analisis).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <button type="button" className="primary-button"
                        disabled={procesando || comentarioProcesando !== null}
                        onClick={() => {
                          const comentario = comentarios.find(item => item.id === analisis.comentario_id);
                          if (comentario) void procesarComentario(comentario);
                          else setError("No se encontró el comentario. Recarga la página.");
                        }}>
                        {comentarioProcesando === analisis.comentario_id ? "Guardando..." : "Reanalizar y guardar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
export default AnalisisNLPPage;
