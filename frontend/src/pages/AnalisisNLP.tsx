import { useEffect, useState } from "react";

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

  const [comentarioProcesando, setComentarioProcesando] =
    useState<number | null>(null);

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
      setAnalisisGuardados(datosAnalisis);
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
        analizarTexto(texto.trim()),
        clasificarTexto(texto.trim()),
      ]);

      setResultadoTexto(analisis);

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
      setComentarioProcesando(null);
    }
  }


  const comentariosPendientes =
    comentarios.filter(
      (comentario) =>
        !comentario.procesado
    );


  return (
    <main className="dashboard-page">

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


      {error && (
        <div className="message-error">
          {error}
        </div>
      )}


      {/* ===================================== */}
      {/* ANÁLISIS LIBRE */}
      {/* ===================================== */}

      <section className="dashboard-panel">

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


        {/* RESULTADO */}

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
                    clasificacion.confianza *
                    100
                  ).toFixed(1)}
                  %
                </strong>
              </div>

            </div>


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


            <div className="nlp-section">
              <h3>
                Palabras frecuentes
              </h3>

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
            </div>

          </div>
        )}

      </section>


      {/* ===================================== */}
      {/* COMENTARIOS PENDIENTES */}
      {/* ===================================== */}

      <section className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>
              Comentarios pendientes
            </h2>

            <p>
              {comentariosPendientes.length}
              {" "}comentarios sin analizar
            </p>
          </div>
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
                  <th>Comentario</th>
                  <th>Canal</th>
                  <th>Categoría manual</th>
                  <th>Acción</th>
                </tr>
              </thead>


              <tbody>

                {comentariosPendientes.map(
                  (comentario) => (
                    <tr key={comentario.id}>

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
                        {comentario.categoria ??
                          "—"}
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
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {/* ===================================== */}
      {/* HISTORIAL NLP */}
      {/* ===================================== */}

      <section className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>
              Análisis realizados
            </h2>

            <p>
              {analisisGuardados.length}
              {" "}resultados almacenados
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
                  <th>ID</th>
                  <th>Comentario</th>
                  <th>Palabras</th>
                  <th>Categoría</th>
                  <th>Confianza</th>
                  <th>Fecha</th>
                </tr>
              </thead>


              <tbody>

                {analisisGuardados.map(
                  (analisis) => (
                    <tr key={analisis.id}>

                      <td>
                        {analisis.id}
                      </td>

                      <td>
                        #{analisis.comentario_id}
                      </td>

                      <td>
                        {analisis.cantidad_palabras}
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
                        {analisis.confianza !==
                        null
                          ? `${(
                              analisis.confianza *
                              100
                            ).toFixed(1)}%`
                          : "—"}
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
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}


export default AnalisisNLPPage;