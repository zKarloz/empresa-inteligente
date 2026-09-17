import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ApiError } from "../services/api";
import GraficaInterpolacion from "../components/GraficaInterpolacion";
import Loading from "../components/Loading";
import {
  obtenerEstadisticas,
  guardarEstadisticas,
  interpolar,
  optimizar,
  type FiltroFechas,
  type Estadisticas,
  type MetricaGuardada,
  type InterpolacionResponse,
  type OptimizacionResponse,
} from "../services/scipy";
// Cada indicador utiliza la misma tarjeta y el mismo formato decimal.
const indicadores = [
  { campo: "media", etiqueta: "Media" },
  { campo: "mediana", etiqueta: "Mediana" },
  { campo: "desviacion_estandar", etiqueta: "Desviación estándar" },
  { campo: "minimo", etiqueta: "Mínimo" },
  { campo: "maximo", etiqueta: "Máximo" },
  { campo: "percentil_25", etiqueta: "Percentil 25" },
  { campo: "percentil_75", etiqueta: "Percentil 75" },
] as const;

function Metricas() {
  // NAVEGACIÓN
  const location = useLocation();

  // ESTADOS GENERALES
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [metricaGuardada, setMetricaGuardada] = useState<MetricaGuardada | null>(null);
  const [resultadoInterpolacion, setResultadoInterpolacion] =
    useState<InterpolacionResponse | null>(null);
  const [resultadoOptimizacion, setResultadoOptimizacion] = useState<OptimizacionResponse | null>(
    null,
  );
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState<FiltroFechas>({});
  const [sinDatos, setSinDatos] = useState(false);
  const solicitud = useRef(0);
  const filtroPendiente = fechaInicio !== (filtroAplicado.fecha_inicio ?? "")
    || fechaFin !== (filtroAplicado.fecha_fin ?? "");

  // INTERPOLACIÓN
  const [xConocidos, setXConocidos] = useState("1, 3, 4, 6");
  const [yConocidos, setYConocidos] = useState("12000, 14500, 15000, 18000");
  const [xEstimar, setXEstimar] = useState("2, 5");

  const [puntosConocidos, setPuntosConocidos] = useState<{ x: number; y: number }[]>([]);

  // OPTIMIZACIÓN
  const [nombreOptimizacion, setNombreOptimizacion] = useState("Optimización de recursos");
  const [descripcionOptimizacion, setDescripcionOptimizacion] = useState(
    "Escenario para reducir costos",
  );
  const [recursoA, setRecursoA] = useState("2");
  const [recursoB, setRecursoB] = useState("4");
  const [capacidadMinima, setCapacidadMinima] = useState("40");

  // Cada respuesta pertenece a un periodo; ignorar respuestas antiguas.
  async function cargarEstadisticas(filtro: FiltroFechas = {}) {
    const id = ++solicitud.current;
    setCargando(true);
    setEstadisticas(null);
    setMetricaGuardada(null);
    setMensaje(null);
    setError(null);
    setSinDatos(false);
    setFiltroAplicado(filtro);
    try {
      const datos = await obtenerEstadisticas(filtro);
      if (id === solicitud.current) setEstadisticas(datos);
    } catch (error) {
      if (id !== solicitud.current) return;
      if (error instanceof ApiError && error.status === 404) setSinDatos(true);
      else setError("No se pudieron cargar las estadísticas del periodo.");
    } finally {
      if (id === solicitud.current) setCargando(false);
    }
  }
  useEffect(() => {
    void cargarEstadisticas();
    return () => { solicitud.current += 1; };
  }, []);

  function aplicarFechas(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      setError("La fecha inicial no puede superar la final.");
      return;
    }
    void cargarEstadisticas({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
  }

  function mostrarTodo() {
    setFechaInicio("");
    setFechaFin("");
    void cargarEstadisticas();
  }

  // NAVEGACIÓN DESDE EL SIDEBAR
  useEffect(() => {
    if (!location.hash) {
      return;
    }
    const id = location.hash.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  // CONVERTIR "1, 2, 3" → [1, 2, 3]
  function convertirListaNumeros(texto: string): number[] {
    const partes = texto.split(",").map((parte) => parte.trim());
    if (partes.some((parte) => parte === "")) {
      throw new Error("Las listas deben contener números separados por comas");
    }
    const numeros = partes.map(Number);
    if (numeros.some((numero) => !Number.isFinite(numero))) {
      throw new Error("Todos los valores deben ser numéricos");
    }
    return numeros;
  }

  // GUARDAR MÉTRICA
  async function ejecutarGuardarEstadisticas() {
    if (procesando || cargando || filtroPendiente || !estadisticas) return;
    try {
      setProcesando(true);
      setError(null);
      setMensaje(null);
      const resultado = await guardarEstadisticas(filtroAplicado);
      setMetricaGuardada(resultado);
      // Mostrar lo efectivamente guardado si llegaron nuevos registros entre consultas.
      setEstadisticas({
        cantidad: resultado.cantidad_registros,
        media: resultado.media!, mediana: resultado.mediana!,
        desviacion_estandar: resultado.desviacion_estandar,
        minimo: resultado.minimo!, maximo: resultado.maximo!,
        percentil_25: resultado.percentil_25!, percentil_75: resultado.percentil_75!,
      });
      setMensaje("Las estadísticas se guardaron correctamente.");
    } catch (error) {
      console.error(error);
      setError("No se pudieron guardar las estadísticas. Revisa el periodo y los tiempos registrados.");
    } finally {
      setProcesando(false);
    }
  }

  // INTERPOLAR
  async function ejecutarInterpolacion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setResultadoInterpolacion(null);
    setPuntosConocidos([]);
    try {
      setProcesando(true);
      setError(null);
      setMensaje(null);
      const x = convertirListaNumeros(xConocidos);
      const y = convertirListaNumeros(yConocidos);
      const estimar = convertirListaNumeros(xEstimar);
      const resultado = await interpolar({
        x_conocidos: x,
        y_conocidos: y,
        x_estimar: estimar,
      });
      // Guardar los puntos de ESTA petición junto a su respuesta.
      setPuntosConocidos(x.map((valor, i) => ({ x: valor, y: y[i] })));
      setResultadoInterpolacion(resultado);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "No se pudo realizar la interpolación",
      );
    } finally {
      setProcesando(false);
    }
  }

  // OPTIMIZAR
  async function ejecutarOptimizacion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const valorA = Number(recursoA);
    const valorB = Number(recursoB);
    const capacidad = Number(capacidadMinima);
    if (!Number.isFinite(valorA) || !Number.isFinite(valorB) || !Number.isFinite(capacidad)) {
      setError("Los valores de optimización deben ser numéricos");
      return;
    }
    if (valorA < 0 || valorA > 10 || valorB < 0 || valorB > 10 || capacidad <= 0 || capacidad > 150) {
      setError("Cada recurso debe estar entre 0 y 10; la capacidad debe ser mayor que 0 y como máximo 150");
      return;
    }
    try {
      setProcesando(true);
      setError(null);
      setMensaje(null);
      const resultado = await optimizar({
        nombre: nombreOptimizacion.trim() || "Optimización de recursos",
        descripcion: descripcionOptimizacion.trim() || null,
        recurso_a_inicial: valorA,
        recurso_b_inicial: valorB,
        capacidad_minima: capacidad,
      });
      setResultadoOptimizacion(resultado);
    } catch (error) {
      console.error(error);
      setError("No se pudo optimizar. Comprueba los límites, el nombre (hasta 150 caracteres) y la descripción (hasta 2000).");
    } finally {
      setProcesando(false);
    }
  }

  // INTERFAZ
  return (
    <main className="dashboard-page">
      {/* ENCABEZADO */}
      <header className="dashboard-header">
        <div>
          <h1>Scientific Data</h1>
          <p>Estadística, interpolación y optimización mediante SciPy</p>
        </div>
        <span className="panel-badge">SciPy</span>
      </header>
      {/* MENSAJES */}
      {error && <div className="message-error">{error}</div>}
      {mensaje && <div className="message-success">{mensaje}</div>}
      {/* ESTADÍSTICAS */}
      <section id="estadisticas" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Estadísticas de atención</h2>
            <p>Indicadores calculados con los tiempos registrados</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={ejecutarGuardarEstadisticas}
            disabled={procesando || cargando || filtroPendiente || !estadisticas}
          >
            Guardar métricas
          </button>
        </div>
        <form className="client-form" onSubmit={aplicarFechas}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="metricas-desde">Desde</label>
              <input id="metricas-desde" type="date" value={fechaInicio}
                disabled={cargando || procesando} max={fechaFin || undefined}
                onChange={e => setFechaInicio(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="metricas-hasta">Hasta</label>
              <input id="metricas-hasta" type="date" value={fechaFin}
                disabled={cargando || procesando} min={fechaInicio || undefined}
                onChange={e => setFechaFin(e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={cargando || procesando}>Aplicar fechas</button>
            <button className="secondary-button" type="button" disabled={cargando || procesando}
              onClick={mostrarTodo}>Ver todo</button>
          </div>
        </form>
        <p role="status">
          Periodo aplicado: {filtroAplicado.fecha_inicio || "desde el primer registro"}
          {" — "}{filtroAplicado.fecha_fin || "hasta el último registro"}. Ambos días incluidos.
          {filtroPendiente && " Hay cambios pendientes: pulsa Aplicar fechas antes de guardar."}
        </p>
        {cargando ? (
          <Loading texto="Calculando estadísticas..." />
        ) : estadisticas ? (
          <div className="scientific-grid">
            <div className="scientific-card">
              <span>Registros</span>
              <strong>{estadisticas.cantidad}</strong>
            </div>
            {indicadores.map(({ campo, etiqueta }) => (
              <div className="scientific-card" key={campo}>
                <span>{etiqueta}</span>
                <strong>{estadisticas[campo]?.toFixed(2) ?? "No disponible"}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>{sinDatos ? "No hay tiempos de atención en este periodo." : "No hay estadísticas disponibles."}</p>
        )}
        {estadisticas && !cargando && (
          <div className="scientific-result">
            <h3>Cómo interpretar estos indicadores</h3>
            <p>Los tiempos están expresados en minutos. La media es el promedio;
              la mediana es el valor central y suele verse menos afectada por tiempos extremos.</p>
            <p>Los percentiles 25 y 75 delimitan aproximadamente el 50 % central de los tiempos.
              Su diferencia es {(estadisticas.percentil_75 - estadisticas.percentil_25).toFixed(2)} minutos.</p>
            <p>{estadisticas.cantidad < 2
              ? "Solo hay un registro: no hay suficientes observaciones para estimar la desviación estándar muestral."
              : `La desviación estándar muestral es ${estadisticas.desviacion_estandar?.toFixed(2)} minutos: describe la dispersión alrededor de la media. Para decidir si es aceptable hay que compararla con una meta de atención.`}</p>
          </div>
        )}
        {metricaGuardada && (
          <div className="scientific-result">
            <strong>Última métrica guardada:</strong>
            <span>
              ID #{metricaGuardada.id}
              {" · "}
              {metricaGuardada.cantidad_registros} registros
              {" · "}{metricaGuardada.fecha_inicio} — {metricaGuardada.fecha_fin}
            </span>
          </div>
        )}
      </section>
      {/* INTERPOLACIÓN */}
      <section id="interpolacion" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Interpolación</h2>
            <p>Estimar valores intermedios a partir de datos conocidos</p>
          </div>
          <span className="panel-badge">interp1d</span>
        </div>
        <form className="client-form" onSubmit={ejecutarInterpolacion}>
          <div className="form-grid">
            <div className="form-group">
              <label>Valores X conocidos</label>
              <input
                type="text"
                disabled={procesando}
                value={xConocidos}
                onChange={(evento) => {
                  setXConocidos(evento.target.value);
                  setResultadoInterpolacion(null);
                }}
                placeholder="1, 3, 4, 6"
              />
            </div>
            <div className="form-group">
              <label>Valores Y conocidos</label>
              <input
                type="text"
                disabled={procesando}
                value={yConocidos}
                onChange={(evento) => {
                  setYConocidos(evento.target.value);
                  setResultadoInterpolacion(null);
                }}
                placeholder="12000, 14500, 15000, 18000"
              />
            </div>
            <div className="form-group">
              <label>Valores X a estimar</label>
              <input
                type="text"
                disabled={procesando}
                value={xEstimar}
                onChange={(evento) => {
                  setXEstimar(evento.target.value);
                  setResultadoInterpolacion(null);
                }}
                placeholder="2, 5"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={procesando}>
              {procesando ? "Procesando..." : "Calcular interpolación"}
            </button>
          </div>
        </form>
        {resultadoInterpolacion && (
          <div className="scientific-result">
            <h3>Resultados estimados</h3>
            <GraficaInterpolacion conocidos={puntosConocidos} estimados={resultadoInterpolacion.resultados} />
            <div className="scientific-grid">
              {resultadoInterpolacion.resultados.map((resultado) => (
                <div className="scientific-card" key={resultado.x}>
                  <span>X = {resultado.x}</span>
                  <strong>{resultado.valor_estimado.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      {/* OPTIMIZACIÓN */}
      <section id="optimizacion" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Optimización</h2>
            <p>Minimización de costos bajo una restricción de capacidad</p>
            <p>Escenario didáctico: A y B son cantidades divisibles de recursos (entre 0 y 10).
              Cada unidad de A aporta 10 unidades de capacidad y cada unidad de B aporta 5.
              La capacidad máxima es 150.</p>
            <p>El costo es 80 × A + 50 × B + 10 × (A − 3)², expresado en unidades monetarias.
              El último término penaliza alejar A de 3. Estos valores son supuestos del ejemplo,
              no tarifas reales de la empresa ni cantidades de trabajadores.</p>
          </div>
          <span className="panel-badge">minimize</span>
        </div>
        <form className="client-form" onSubmit={ejecutarOptimizacion}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                maxLength={150}
                value={nombreOptimizacion}
                onChange={(evento) => setNombreOptimizacion(evento.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <input
                type="text"
                maxLength={2000}
                value={descripcionOptimizacion}
                onChange={(evento) =>
                  setDescripcionOptimizacion(evento.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Recurso A inicial</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={recursoA}
                onChange={(evento) => setRecursoA(evento.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Recurso B inicial</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={recursoB}
                onChange={(evento) => setRecursoB(evento.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Capacidad mínima</label>
              <input
                type="number"
                max="150"
                min="0.01"
                step="0.01"
                value={capacidadMinima}
                onChange={(evento) => setCapacidadMinima(evento.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={procesando}>
              {procesando ? "Procesando..." : "Ejecutar optimización"}
            </button>
          </div>
        </form>
        {resultadoOptimizacion && resultadoOptimizacion.resultado && (
          <div className="scientific-result">
            <h3>Resultado de optimización</h3>
            <p>{resultadoOptimizacion.resultado.inicial_factible === false
              ? "El escenario inicial no cubría la capacidad solicitada. La diferencia de costos no representa un ahorro entre alternativas que cumplen la misma demanda."
              : resultadoOptimizacion.resultado.inicial_factible === true
                ? "El escenario inicial cubría la capacidad. Una diferencia positiva representa una reducción estimada del costo dentro de este modelo."
                : "Este resultado antiguo no incluye la comprobación de capacidad inicial. Ejecuta una nueva optimización."}</p>
            <p>Capacidad inicial: {resultadoOptimizacion.resultado.capacidad_inicial?.toFixed(2) ?? "No disponible"}.
              Capacidad optimizada: {resultadoOptimizacion.resultado.capacidad_optima?.toFixed(2) ?? "No disponible"}.
              Demanda: {resultadoOptimizacion.parametros_entrada.capacidad_minima}.</p>
            <div className="scientific-grid">
              <div className="scientific-card">
                <span>Recurso A óptimo</span>
                <strong>
                  {resultadoOptimizacion.resultado.recurso_a.toFixed(2)}
                </strong>
              </div>
              <div className="scientific-card">
                <span>Recurso B óptimo</span>
                <strong>
                  {resultadoOptimizacion.resultado.recurso_b.toFixed(2)}
                </strong>
              </div>
              <div className="scientific-card">
                <span>Costo inicial</span>
                <strong>{resultadoOptimizacion.costo_inicial?.toFixed(2)}</strong>
              </div>
              <div className="scientific-card">
                <span>Costo optimizado</span>
                <strong>
                  {resultadoOptimizacion.costo_optimizado?.toFixed(2)}
                </strong>
              </div>
              <div className="scientific-card">
                <span>Diferencia de costos (inicial − optimizado)</span>
                <strong>{resultadoOptimizacion.resultado.ahorro.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
export default Metricas;
