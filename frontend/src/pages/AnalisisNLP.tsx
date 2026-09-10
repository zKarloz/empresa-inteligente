import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  obtenerComentarios,
  type Comentario,
} from "../services/comentarios";

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

  // ============================================
  // NAVEGACIÓN
  // ============================================

  const location = useLocation();


  // ============================================
  // ESTADOS
  // ============================================

  const [texto, setTexto] =
    useState("");

  const [resultadoTexto, setResultadoTexto] =
    useState<AnalisisTexto | null>(null);

  const [clasificacion, setClasificacion] =
    useState<Clasificacion | null>(null);

  const [comentarios, setComentarios] =
    useState<Comentario[]>([]);

  const [analisisGuardados, setAnalisisGuardados] =
    useState<AnalisisNLP[]>([]);

  const [procesando, setProcesando] =
    useState(false);

  const [
    comentarioProcesando,
    setComentarioProcesando,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  // ============================================
  // CARGAR DATOS
  // ============================================

  async function cargarDatos() {
    try {

      const [
        datosComentarios,
        datosAnalisis,
      ] = await Promise.all([
        obtenerComentarios(),
        obtenerAnalisisNLP(),
      ]);

      setComentarios(datosComentarios);

      setAnalisisGuardados(
        datosAnalisis
      );

      setError(null);

    } catch (error) {

      console.error(error);

      setError(
        "No se pudieron cargar los datos NLP"
      );
    }
  }


  useEffect(() => {
    cargarDatos();
  }, []);


  // ============================================
  // NAVEGACIÓN DESDE EL SIDEBAR
  // ============================================

  useEffect(() => {

    if (!location.hash) {
      return;
    }

    const id =
      location.hash.replace("#", "");

    const elemento =
      document.getElementById(id);

    if (elemento) {

      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

  }, [location.hash]);


  // ============================================
  // ANALIZAR TEXTO LIBRE
  // ============================================

  async function ejecutarAnalisis(
    evento: React.FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault();

    if (!texto.trim()) {

      setError(
        "Escribe un comentario para analizar"
      );

      return;
    }


    try {

      setProcesando(true);

      setError(null);


      const [
        analisis,
        resultadoClasificacion,
      ] = await Promise.all([
        analizarTexto(
          texto.trim()
        ),

        clasificarTexto(
          texto.trim()
        ),
      ]);


      setResultadoTexto(
        analisis
      );

      setClasificacion(
        resultadoClasificacion
      );


    } catch (error) {

      console.error(error);

      setError(
        "No se pudo analizar el texto"
      );


    } finally {

      setProcesando(false);
    }
  }


  // ============================================
  // ANALIZAR COMENTARIO GUARDADO
  // ============================================

  async function procesarComentario(
    comentario: Comentario
  ) {

    try {

      setComentarioProcesando(
        comentario.id
      );

      setError(null);


      await analizarComentarioGuardado(
        comentario.id
      );


      await cargarDatos();


    } catch (error) {

      console.error(error);

      setError(
        "No se pudo procesar el comentario"
      );


    } finally {

      setComentarioProcesando(
        null
      );
    }
  }


  // ============================================
  // COMENTARIOS PENDIENTES
  // ============================================

  const comentariosPendientes =
    comentarios.filter(
      (comentario) =>
        !comentario.procesado
    );


  // ============================================
  // RESUMEN DE CATEGORÍAS NLP
  // ============================================

  const resumenCategorias =
    analisisGuardados.reduce<
      Record<string, number>
    >(
      (acumulador, analisis) => {

        const categoria =
          analisis.categoria_detectada ??
          "SIN CATEGORÍA";

        acumulador[categoria] =
          (acumulador[categoria] ?? 0) + 1;

        return acumulador;

      },
      {}
    );


  const categoriasOrdenadas =
    Object.entries(
      resumenCategorias
    ).sort(
      (a, b) => b[1] - a[1]
    );


  // ============================================
  // INTERFAZ
  // ============================================

  return (

    <main className="dashboard-page">

      {/* ===================================== */}
      {/* ENCABEZADO */}
      {/* ===================================== */}

      <header className="dashboard-header">

        <div>

          <h1>
            Inteligencia NLP
          </h1>

          <p>
            Tokenización, palabras frecuentes
            y clasificación de comentarios
          </p>

        </div>

      </header>


      {/* ===================================== */}
      {/* ERROR */}
      {/* ===================================== */}

      {error && (

        <div className="message-error">
          {error}
        </div>

      )}


      {/* ===================================== */}
      {/* ANALIZAR COMENTARIO */}
      {/* ===================================== */}

      <section
        id="analizar"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Analizar comentario
            </h2>

            <p>
              Prueba el procesamiento NLP
              con cualquier texto
            </p>

          </div>


          <span className="panel-badge">
            NLTK
          </span>

        </div>


        <form
          className="client-form"
          onSubmit={ejecutarAnalisis}
        >

          <div className="form-group">

            <label htmlFor="texto-nlp">
              Comentario
            </label>


            <textarea
              id="texto-nlp"
              rows={5}
              value={texto}
              onChange={(evento) =>
                setTexto(
                  evento.target.value
                )
              }
              placeholder="Ejemplo: Necesito ayuda porque el sistema presenta un error"
            />

          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={procesando}
            >

              {procesando
                ? "Analizando..."
                : "Analizar con NLTK"}

            </button>

          </div>

        </form>


        {/* ================================= */}
        {/* RESULTADO GENERAL */}
        {/* ================================= */}

        {resultadoTexto &&
          clasificacion && (

          <div className="nlp-result">

            <div className="nlp-summary">


              <div className="nlp-result-card">

                <span>
                  Palabras útiles
                </span>

                <strong>
                  {
                    resultadoTexto
                      .cantidad_palabras
                  }
                </strong>

              </div>


              <div className="nlp-result-card">

                <span>
                  Categoría
                </span>

                <strong>
                  {
                    clasificacion
                      .categoria
                  }
                </strong>

              </div>


              <div className="nlp-result-card">

                <span>
                  Confianza
                </span>

                <strong>

                  {(
                    clasificacion
                      .confianza * 100
                  ).toFixed(1)}

                  %

                </strong>

              </div>

            </div>


            {/* TOKENS */}

            <div className="nlp-section">

              <h3>
                Tokens limpios
              </h3>


              <div className="word-list">

                {
                  resultadoTexto.tokens.map(
                    (token, index) => (

                      <span
                        key={`${token}-${index}`}
                      >
                        {token}
                      </span>

                    )
                  )
                }

              </div>

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* PALABRAS FRECUENTES */}
        {/* ================================= */}

        <div
          id="palabras"
          className="nlp-section"
        >

          <h3>
            Palabras frecuentes
          </h3>


          {!resultadoTexto ? (

            <p>
              Analiza un comentario para
              visualizar las palabras más
              frecuentes.
            </p>

          ) : (

            <div className="word-list">

              {
                resultadoTexto
                  .palabras_frecuentes
                  .map(
                    (palabra) => (

                      <span
                        key={
                          palabra.palabra
                        }
                      >

                        {palabra.palabra}
                        {" "}
                        ({palabra.frecuencia})

                      </span>

                    )
                  )
              }

            </div>

          )}

        </div>

      </section>


      {/* ===================================== */}
      {/* CLASIFICACIÓN */}
      {/* ===================================== */}

      <section
        id="clasificacion"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Clasificación de comentarios
            </h2>

            <p>
              {comentariosPendientes.length}
              {" "}
              comentario
              {comentariosPendientes.length !== 1
                ? "s"
                : ""}
              {" "}
              pendiente
              {comentariosPendientes.length !== 1
                ? "s"
                : ""}
              {" "}
              de análisis
            </p>

          </div>


          <span className="panel-badge">
            Clasificación NLP
          </span>

        </div>


        {comentariosPendientes.length === 0 ? (

          <p>
            Todos los comentarios han sido
            procesados.
          </p>

        ) : (

          <div className="table-container">

            <table className="data-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>
                    Comentario
                  </th>

                  <th>
                    Canal
                  </th>

                  <th>
                    Categoría manual
                  </th>

                  <th>
                    Acción
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  comentariosPendientes.map(
                    (comentario) => (

                      <tr
                        key={
                          comentario.id
                        }
                      >

                        <td>
                          {comentario.id}
                        </td>


                        <td>
                          {comentario.contenido}
                        </td>


                        <td>
                          {comentario.canal}
                        </td>


                        <td>

                          {
                            comentario.categoria ??
                            "—"
                          }

                        </td>


                        <td>

                          <button
                            type="button"
                            className="primary-button"
                            disabled={
                              comentarioProcesando ===
                              comentario.id
                            }
                            onClick={() =>
                              procesarComentario(
                                comentario
                              )
                            }
                          >

                            {
                              comentarioProcesando ===
                              comentario.id
                                ? "Procesando..."
                                : "Analizar"
                            }

                          </button>

                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ===================================== */}
      {/* CATEGORÍAS */}
      {/* ===================================== */}

      <section
        id="categorias"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Categorías detectadas
            </h2>

            <p>
              Distribución de los comentarios
              procesados por NLTK
            </p>

          </div>


          <span className="panel-badge">
            NLP
          </span>

        </div>


        {categoriasOrdenadas.length === 0 ? (

          <p>
            Todavía no existen categorías
            detectadas. Procesa comentarios
            para generar resultados.
          </p>

        ) : (

          <div className="category-list">

            {
              categoriasOrdenadas.map(
                ([categoria, cantidad]) => {

                  const porcentaje =
                    analisisGuardados.length > 0
                      ? (
                          cantidad /
                          analisisGuardados.length
                        ) * 100
                      : 0;


                  return (

                    <div
                      className="category-item"
                      key={categoria}
                    >

                      <div className="category-info">

                        <span>
                          {categoria}
                        </span>


                        <strong>

                          {cantidad}

                          {" · "}

                          {porcentaje.toFixed(1)}
                          %

                        </strong>

                      </div>


                      <div className="progress">

                        <div
                          className="progress-value"
                          style={{
                            width:
                              `${porcentaje}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )
            }

          </div>

        )}

      </section>


      {/* ===================================== */}
      {/* HISTORIAL NLP */}
      {/* ===================================== */}

      <section
        id="historial-nlp"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Análisis realizados
            </h2>

            <p>

              {analisisGuardados.length}

              {" "}

              resultado
              {analisisGuardados.length !== 1
                ? "s"
                : ""}
              {" "}
              almacenado
              {analisisGuardados.length !== 1
                ? "s"
                : ""}

            </p>

          </div>

        </div>


        {analisisGuardados.length === 0 ? (

          <p>
            Todavía no existen análisis
            almacenados.
          </p>

        ) : (

          <div className="table-container">

            <table className="data-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Comentario
                  </th>

                  <th>
                    Palabras
                  </th>

                  <th>
                    Categoría
                  </th>

                  <th>
                    Confianza
                  </th>

                  <th>
                    Fecha
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  analisisGuardados.map(
                    (analisis) => (

                      <tr
                        key={
                          analisis.id
                        }
                      >

                        <td>
                          {analisis.id}
                        </td>


                        <td>

                          #
                          {
                            analisis
                              .comentario_id
                          }

                        </td>


                        <td>

                          {
                            analisis
                              .cantidad_palabras
                          }

                        </td>


                        <td>

                          <strong>

                            {
                              analisis
                                .categoria_detectada ??
                              "—"
                            }

                          </strong>

                        </td>


                        <td>

                          {
                            analisis.confianza !==
                            null
                              ? `${(
                                  analisis.confianza *
                                  100
                                ).toFixed(1)}%`
                              : "—"
                          }

                        </td>


                        <td>

                          {
                            analisis.fecha_analisis
                              ? new Date(
                                  analisis
                                    .fecha_analisis
                                ).toLocaleString()
                              : "—"
                          }

                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>

  );
}


export default AnalisisNLPPage;