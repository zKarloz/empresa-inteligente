import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../components/Loading";

import {
  obtenerEstadisticas,
  guardarEstadisticas,
  interpolar,
  optimizar,
  type Estadisticas,
  type MetricaGuardada,
  type InterpolacionResponse,
  type OptimizacionResponse,
} from "../services/scipy";


function Metricas() {

  // ============================================
  // NAVEGACIÓN
  // ============================================

  const location = useLocation();


  // ============================================
  // ESTADOS GENERALES
  // ============================================

  const [estadisticas, setEstadisticas] =
    useState<Estadisticas | null>(null);

  const [metricaGuardada, setMetricaGuardada] =
    useState<MetricaGuardada | null>(null);

  const [
    resultadoInterpolacion,
    setResultadoInterpolacion,
  ] =
    useState<InterpolacionResponse | null>(null);

  const [
    resultadoOptimizacion,
    setResultadoOptimizacion,
  ] =
    useState<OptimizacionResponse | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [procesando, setProcesando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [mensaje, setMensaje] =
    useState<string | null>(null);


  // ============================================
  // INTERPOLACIÓN
  // ============================================

  const [xConocidos, setXConocidos] =
    useState("1, 3, 4, 6");

  const [yConocidos, setYConocidos] =
    useState("12000, 14500, 15000, 18000");

  const [xEstimar, setXEstimar] =
    useState("2, 5");


  // ============================================
  // OPTIMIZACIÓN
  // ============================================

  const [
    nombreOptimizacion,
    setNombreOptimizacion,
  ] =
    useState(
      "Optimización de recursos"
    );

  const [
    descripcionOptimizacion,
    setDescripcionOptimizacion,
  ] =
    useState(
      "Escenario para reducir costos"
    );

  const [recursoA, setRecursoA] =
    useState("2");

  const [recursoB, setRecursoB] =
    useState("4");

  const [
    capacidadMinima,
    setCapacidadMinima,
  ] =
    useState("40");


  // ============================================
  // CARGAR ESTADÍSTICAS
  // ============================================

  async function cargarEstadisticas() {
    try {
      setCargando(true);

      const datos =
        await obtenerEstadisticas();

      setEstadisticas(datos);

      setError(null);

    } catch (error) {

      console.error(error);

      setError(
        "No se pudieron cargar las estadísticas"
      );

    } finally {

      setCargando(false);
    }
  }


  useEffect(() => {
    cargarEstadisticas();
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
  // CONVERTIR "1, 2, 3" → [1, 2, 3]
  // ============================================

  function convertirListaNumeros(
    texto: string
  ): number[] {

    const partes = texto
      .split(",")
      .map(
        (parte) =>
          parte.trim()
      );


    if (
      partes.length === 0 ||
      partes.some(
        (parte) =>
          parte === ""
      )
    ) {

      throw new Error(
        "Las listas deben contener números separados por comas"
      );
    }


    const numeros =
      partes.map(Number);


    if (
      numeros.some(
        (numero) =>
          !Number.isFinite(numero)
      )
    ) {

      throw new Error(
        "Todos los valores deben ser numéricos"
      );
    }


    return numeros;
  }


  // ============================================
  // GUARDAR MÉTRICA
  // ============================================

  async function ejecutarGuardarEstadisticas() {

    try {

      setProcesando(true);

      setError(null);

      setMensaje(null);


      const resultado =
        await guardarEstadisticas();


      setMetricaGuardada(
        resultado
      );


      setMensaje(
        "Las estadísticas se guardaron correctamente."
      );


    } catch (error) {

      console.error(error);

      setError(
        "No se pudieron guardar las estadísticas"
      );


    } finally {

      setProcesando(false);
    }
  }


  // ============================================
  // INTERPOLAR
  // ============================================

  async function ejecutarInterpolacion(
    evento: React.FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault();


    try {

      setProcesando(true);

      setError(null);

      setMensaje(null);


      const x =
        convertirListaNumeros(
          xConocidos
        );

      const y =
        convertirListaNumeros(
          yConocidos
        );

      const estimar =
        convertirListaNumeros(
          xEstimar
        );


      const resultado =
        await interpolar({

          x_conocidos: x,

          y_conocidos: y,

          x_estimar: estimar,

        });


      setResultadoInterpolacion(
        resultado
      );


    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo realizar la interpolación"
      );


    } finally {

      setProcesando(false);
    }
  }


  // ============================================
  // OPTIMIZAR
  // ============================================

  async function ejecutarOptimizacion(
    evento: React.FormEvent<HTMLFormElement>
  ) {

    evento.preventDefault();


    const valorA =
      Number(recursoA);

    const valorB =
      Number(recursoB);

    const capacidad =
      Number(
        capacidadMinima
      );


    if (
      !Number.isFinite(valorA) ||
      !Number.isFinite(valorB) ||
      !Number.isFinite(capacidad)
    ) {

      setError(
        "Los valores de optimización deben ser numéricos"
      );

      return;
    }


    if (
      valorA < 0 ||
      valorB < 0 ||
      capacidad <= 0
    ) {

      setError(
        "Los recursos no pueden ser negativos y la capacidad debe ser mayor que cero"
      );

      return;
    }


    try {

      setProcesando(true);

      setError(null);

      setMensaje(null);


      const resultado =
        await optimizar({

          nombre:
            nombreOptimizacion.trim() ||
            "Optimización de recursos",

          descripcion:
            descripcionOptimizacion.trim() ||
            null,

          recurso_a_inicial:
            valorA,

          recurso_b_inicial:
            valorB,

          capacidad_minima:
            capacidad,

        });


      setResultadoOptimizacion(
        resultado
      );


    } catch (error) {

      console.error(error);

      setError(
        "No se pudo realizar la optimización"
      );


    } finally {

      setProcesando(false);
    }
  }


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
            Scientific Data
          </h1>

          <p>
            Estadística, interpolación y
            optimización mediante SciPy
          </p>

        </div>


        <span className="panel-badge">
          SciPy
        </span>

      </header>


      {/* ===================================== */}
      {/* MENSAJES */}
      {/* ===================================== */}

      {error && (

        <div className="message-error">
          {error}
        </div>

      )}


      {mensaje && (

        <div className="message-success">
          {mensaje}
        </div>

      )}


      {/* ===================================== */}
      {/* ESTADÍSTICAS */}
      {/* ===================================== */}

      <section
        id="estadisticas"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Estadísticas de atención
            </h2>

            <p>
              Indicadores calculados con los
              tiempos registrados
            </p>

          </div>


          <button
            type="button"
            className="primary-button"
            onClick={
              ejecutarGuardarEstadisticas
            }
            disabled={
              procesando ||
              !estadisticas
            }
          >

            Guardar métricas

          </button>

        </div>


        {cargando ? (

          <Loading
            texto="Calculando estadísticas..."
          />

        ) : estadisticas ? (

          <div className="scientific-grid">


            <div className="scientific-card">

              <span>
                Registros
              </span>

              <strong>
                {
                  estadisticas
                    .cantidad
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Media
              </span>

              <strong>
                {
                  estadisticas
                    .media
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Mediana
              </span>

              <strong>
                {
                  estadisticas
                    .mediana
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Desviación estándar
              </span>

              <strong>
                {
                  estadisticas
                    .desviacion_estandar
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Mínimo
              </span>

              <strong>
                {
                  estadisticas
                    .minimo
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Máximo
              </span>

              <strong>
                {
                  estadisticas
                    .maximo
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Percentil 25
              </span>

              <strong>
                {
                  estadisticas
                    .percentil_25
                    .toFixed(2)
                }
              </strong>

            </div>


            <div className="scientific-card">

              <span>
                Percentil 75
              </span>

              <strong>
                {
                  estadisticas
                    .percentil_75
                    .toFixed(2)
                }
              </strong>

            </div>


          </div>

        ) : (

          <p>
            No existen datos estadísticos.
          </p>

        )}


        {metricaGuardada && (

          <div className="scientific-result">

            <strong>
              Última métrica guardada:
            </strong>


            <span>

              ID #{metricaGuardada.id}

              {" · "}

              {
                metricaGuardada
                  .cantidad_registros
              }

              {" "}registros

            </span>

          </div>

        )}

      </section>


      {/* ===================================== */}
      {/* INTERPOLACIÓN */}
      {/* ===================================== */}

      <section
        id="interpolacion"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Interpolación
            </h2>

            <p>
              Estimar valores intermedios a
              partir de datos conocidos
            </p>

          </div>


          <span className="panel-badge">
            interp1d
          </span>

        </div>


        <form
          className="client-form"
          onSubmit={
            ejecutarInterpolacion
          }
        >


          <div className="form-grid">


            <div className="form-group">

              <label>
                Valores X conocidos
              </label>


              <input
                type="text"
                value={xConocidos}
                onChange={(evento) =>
                  setXConocidos(
                    evento.target.value
                  )
                }
                placeholder="1, 3, 4, 6"
              />

            </div>


            <div className="form-group">

              <label>
                Valores Y conocidos
              </label>


              <input
                type="text"
                value={yConocidos}
                onChange={(evento) =>
                  setYConocidos(
                    evento.target.value
                  )
                }
                placeholder="12000, 14500, 15000, 18000"
              />

            </div>


            <div className="form-group">

              <label>
                Valores X a estimar
              </label>


              <input
                type="text"
                value={xEstimar}
                onChange={(evento) =>
                  setXEstimar(
                    evento.target.value
                  )
                }
                placeholder="2, 5"
              />

            </div>


          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={procesando}
            >

              {procesando
                ? "Procesando..."
                : "Calcular interpolación"}

            </button>

          </div>


        </form>


        {resultadoInterpolacion && (

          <div className="scientific-result">

            <h3>
              Resultados estimados
            </h3>


            <div className="scientific-grid">

              {
                resultadoInterpolacion
                  .resultados
                  .map(
                    (resultado) => (

                      <div
                        className="scientific-card"
                        key={resultado.x}
                      >

                        <span>
                          X = {resultado.x}
                        </span>


                        <strong>

                          {
                            resultado
                              .valor_estimado
                              .toFixed(2)
                          }

                        </strong>

                      </div>

                    )
                  )
              }

            </div>

          </div>

        )}

      </section>


      {/* ===================================== */}
      {/* OPTIMIZACIÓN */}
      {/* ===================================== */}

      <section
        id="optimizacion"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Optimización
            </h2>

            <p>
              Minimización de costos bajo una
              restricción de capacidad
            </p>

          </div>


          <span className="panel-badge">
            minimize
          </span>

        </div>


        <form
          className="client-form"
          onSubmit={
            ejecutarOptimizacion
          }
        >


          <div className="form-grid">


            <div className="form-group">

              <label>
                Nombre
              </label>


              <input
                type="text"
                value={
                  nombreOptimizacion
                }
                onChange={(evento) =>
                  setNombreOptimizacion(
                    evento.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                Descripción
              </label>


              <input
                type="text"
                value={
                  descripcionOptimizacion
                }
                onChange={(evento) =>
                  setDescripcionOptimizacion(
                    evento.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                Recurso A inicial
              </label>


              <input
                type="number"
                min="0"
                step="0.01"
                value={recursoA}
                onChange={(evento) =>
                  setRecursoA(
                    evento.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                Recurso B inicial
              </label>


              <input
                type="number"
                min="0"
                step="0.01"
                value={recursoB}
                onChange={(evento) =>
                  setRecursoB(
                    evento.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                Capacidad mínima
              </label>


              <input
                type="number"
                min="0.01"
                step="0.01"
                value={capacidadMinima}
                onChange={(evento) =>
                  setCapacidadMinima(
                    evento.target.value
                  )
                }
              />

            </div>


          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={procesando}
            >

              {procesando
                ? "Procesando..."
                : "Ejecutar optimización"}

            </button>

          </div>


        </form>


        {resultadoOptimizacion &&
          resultadoOptimizacion.resultado && (

          <div className="scientific-result">

            <h3>
              Resultado de optimización
            </h3>


            <div className="scientific-grid">


              <div className="scientific-card">

                <span>
                  Recurso A óptimo
                </span>

                <strong>

                  {
                    resultadoOptimizacion
                      .resultado
                      .recurso_a
                      .toFixed(2)
                  }

                </strong>

              </div>


              <div className="scientific-card">

                <span>
                  Recurso B óptimo
                </span>

                <strong>

                  {
                    resultadoOptimizacion
                      .resultado
                      .recurso_b
                      .toFixed(2)
                  }

                </strong>

              </div>


              <div className="scientific-card">

                <span>
                  Costo inicial
                </span>

                <strong>

                  {
                    resultadoOptimizacion
                      .costo_inicial
                      ?.toFixed(2)
                  }

                </strong>

              </div>


              <div className="scientific-card">

                <span>
                  Costo optimizado
                </span>

                <strong>

                  {
                    resultadoOptimizacion
                      .costo_optimizado
                      ?.toFixed(2)
                  }

                </strong>

              </div>


              <div className="scientific-card">

                <span>
                  Ahorro
                </span>

                <strong>

                  {
                    resultadoOptimizacion
                      .resultado
                      .ahorro
                      .toFixed(2)
                  }

                </strong>

              </div>


            </div>

          </div>

        )}

      </section>

    </main>
  );
}


export default Metricas;