import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { obtenerDashboard, type DashboardData } from "../services/dashboard";
import {
  obtenerMetricasGuardadas,
  obtenerOptimizaciones,
  type MetricaGuardada,
  type OptimizacionResponse,
} from "../services/scipy";
import { obtenerAnalisisNLP, type AnalisisNLP } from "../services/nlp";

// Compartir el formato evita repetir la comprobación de valores nulos.
const decimal = (valor: number | null | undefined) => valor?.toFixed(2) ?? "—";

function Reportes() {
  // NAVEGACIÓN
  const location = useLocation();

  // ESTADOS
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [metricas, setMetricas] = useState<MetricaGuardada[]>([]);
  const [optimizaciones, setOptimizaciones] = useState<OptimizacionResponse[]>([]);
  const [analisis, setAnalisis] = useState<AnalisisNLP[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CARGAR REPORTE
  useEffect(() => {
    let activo = true;
    async function cargarReporte() {
      try {
        setCargando(true);
        const [datosDashboard, datosMetricas, datosOptimizaciones, datosAnalisis] =
          await Promise.all([
            obtenerDashboard(),
            obtenerMetricasGuardadas(),
            obtenerOptimizaciones(),
            obtenerAnalisisNLP(),
          ]);
        if (!activo) return;
        setDashboard(datosDashboard);
        setMetricas(datosMetricas);
        setOptimizaciones(datosOptimizaciones);
        setAnalisis(datosAnalisis);
        setError(null);
      } catch (error) {
        if (!activo) return;
        console.error("Error al cargar reportes:", error);
        setError("No se pudieron cargar los reportes");
      } finally {
        if (activo) setCargando(false);
      }
    }
    void cargarReporte();

    // Ignorar respuestas pendientes si se abandona la página.
    return () => {
      activo = false;
    };
  }, []);

  // NAVEGACIÓN DESDE EL SIDEBAR
  useEffect(() => {
    // Las secciones existen solo cuando termina la carga.
    if (!location.hash || cargando) {
      return;
    }
    const id = location.hash.replace("#", "");
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location.hash, cargando]);

  // DATOS DERIVADOS
  const totalAnalisis = analisis.length;
  const analisisConConfianza = analisis.filter((item) => item.confianza !== null);
  const confianzaPromedio =
    analisisConConfianza.length > 0
      ? analisisConConfianza.reduce(
        (acumulado, item) => acumulado + (item.confianza ?? 0),
        0,
      ) / analisisConConfianza.length
      : 0;

  // INTERFAZ
  return (
    <main className="dashboard-page">
      {/* El encabezado permanece igual durante la carga, el error y el resultado. */}
      <header className="dashboard-header">
        <div>
          <h1>Reportes</h1>
          <p>Resumen consolidado de atención, NLP y análisis estadístico</p>
        </div>
        <span className="panel-badge">Datos reales</span>
      </header>
      {cargando ? (
        <Loading texto="Generando reportes..." />
      ) : error || !dashboard ? (
        <div className="message-error" role="alert">
          {error ?? "No existen datos disponibles"}
        </div>
      ) : (
        <>
          {/* REPORTE DE ATENCIÓN / RESUMEN */}
          <section id="reporte-atencion" className="kpi-grid">
            <article className="kpi-card">
              <span className="kpi-label">Clientes</span>
              <strong className="kpi-value">{dashboard.clientes}</strong>
              <span className="kpi-description">Registrados</span>
            </article>
            <article className="kpi-card">
              <span className="kpi-label">Comentarios</span>
              <strong className="kpi-value">{dashboard.comentarios}</strong>
              <span className="kpi-description">Recibidos</span>
            </article>
            <article className="kpi-card">
              <span className="kpi-label">Promedio atención</span>
              <strong className="kpi-value">{dashboard.promedio_atencion} min</strong>
              <span className="kpi-description">Tiempo promedio</span>
            </article>
            <article className="kpi-card">
              <span className="kpi-label">NLP procesado</span>
              <strong className="kpi-value">
                {dashboard.porcentaje_procesados}%
              </strong>
              <span className="kpi-description">Comentarios procesados</span>
            </article>
          </section>
          {/* REPORTE NLP */}
          <section id="reporte-nlp" className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Reporte NLP</h2>
                <p>Resultados de clasificación almacenados</p>
              </div>
              <span className="panel-badge">NLTK</span>
            </div>
            <div className="report-summary-grid">
              <div className="scientific-card">
                <span>Análisis realizados</span>
                <strong>{totalAnalisis}</strong>
              </div>
              <div className="scientific-card">
                <span>Confianza promedio</span>
                <strong>{(confianzaPromedio * 100).toFixed(1)}%</strong>
              </div>
              <div className="scientific-card">
                <span>Categorías detectadas</span>
                <strong>{dashboard.categorias_nlp.length}</strong>
              </div>
            </div>
            {dashboard.categorias_nlp.length > 0 && (
              <div className="report-categories">
                {dashboard.categorias_nlp.map((categoria) => (
                  <div className="category-item" key={categoria.categoria}>
                    <div className="category-info">
                      <span>{categoria.categoria}</span>
                      <strong>{categoria.porcentaje}%</strong>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-value"
                        style={{
                          width: `${categoria.porcentaje}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* MÉTRICAS ESTADÍSTICAS */}
          <section id="reporte-estadisticas" className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Historial estadístico</h2>
                <p>Métricas calculadas y guardadas con SciPy</p>
              </div>
              <span className="panel-badge">SciPy</span>
            </div>
            {metricas.length === 0 ? (
              <p>No existen métricas guardadas.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Periodo</th>
                      <th>Registros</th>
                      <th>Media</th>
                      <th>Mediana</th>
                      <th>Desviación</th>
                      <th>Mínimo</th>
                      <th>Máximo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricas.map((metrica) => (
                      <tr key={metrica.id}>
                        <td>{metrica.id}</td>
                        <td>
                          {metrica.fecha_inicio}
                          {" → "}
                          {metrica.fecha_fin}
                        </td>
                        <td>{metrica.cantidad_registros}</td>
                        <td>{decimal(metrica.media)}</td>
                        <td>{decimal(metrica.mediana)}</td>
                        <td>{decimal(metrica.desviacion_estandar)}</td>
                        <td>{decimal(metrica.minimo)}</td>
                        <td>{decimal(metrica.maximo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          {/* OPTIMIZACIONES */}
          <section id="reporte-optimizaciones" className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Historial de optimización</h2>
                <p>Escenarios procesados mediante scipy.optimize</p>
              </div>
              <span className="panel-badge">SciPy Optimize</span>
            </div>
            {optimizaciones.length === 0 ? (
              <p>No existen optimizaciones guardadas.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Costo inicial</th>
                      <th>Costo optimizado</th>
                      <th>Ahorro</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizaciones.map((optimizacion) => (
                      <tr key={optimizacion.id}>
                        <td>{optimizacion.id}</td>
                        <td>
                          <strong>{optimizacion.nombre}</strong>
                        </td>
                        <td>{decimal(optimizacion.costo_inicial)}</td>
                        <td>{decimal(optimizacion.costo_optimizado)}</td>
                        <td>{decimal(optimizacion.resultado?.ahorro)}</td>
                        <td>
                          <span className="status-active">
                            {optimizacion.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
export default Reportes;
