import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { obtenerDashboard, type DashboardData } from "../services/dashboard";
function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CARGAR DATOS DEL BACKEND
  useEffect(() => {
    let activo = true;
    async function cargarDashboard() {
      try {
        setCargando(true);
        const datos = await obtenerDashboard();
        if (!activo) return;
        setDashboard(datos);
        setError(null);
      } catch (error) {
        if (!activo) return;
        console.error("Error al cargar el dashboard:", error);
        setError("No se pudieron cargar los datos del dashboard");
      } finally {
        if (activo) setCargando(false);
      }
    }
    void cargarDashboard();
    return () => {
      activo = false;
    };
  }, []);

  // Formatear YYYY-MM-DD sin convertir la fecha a otra zona horaria.
  function formatearFecha(fecha: string) {
    const partes = fecha.split("-");
    if (partes.length !== 3) {
      return fecha;
    }
    const [, mes, dia] = partes;
    return `${dia}/${mes}`;
  }

  // FORMATEAR NOMBRE DE CATEGORÍA
  function formatearCategoria(categoria: string) {
    const texto = categoria.replaceAll("_", " ").toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // ESCALA DEL GRÁFICO
  const maximoTiempo =
    dashboard && dashboard.tiempos_atencion.length > 0
      ? Math.max(...dashboard.tiempos_atencion.map((item) => item.promedio))
      : 0;
  return (
    <main className="dashboard-page">
      {/* ENCABEZADO */}
      <header className="dashboard-header">
        <div>
          <h1>Centro Inteligente</h1>
          <p>Resumen general de atención, clientes y análisis NLP</p>
        </div>
        {!cargando && !error && dashboard && (
          <div className="dashboard-status">Datos actualizados</div>
        )}
      </header>
      {cargando ? (
        <Loading texto="Cargando dashboard..." />
      ) : error || !dashboard ? (
        <div className="message-error" role="alert">
          {error ?? "No existen datos disponibles"}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <section className="kpi-grid">
            {[
              {
                titulo: "Clientes",
                valor: dashboard.clientes,
                descripcion: "Clientes registrados",
              },
              {
                titulo: "Comentarios",
                valor: dashboard.comentarios,
                descripcion: "Comentarios recibidos",
              },
              {
                titulo: "Promedio",
                valor: `${dashboard.promedio_atencion} min`,
                descripcion: "Tiempo promedio de atención",
              },
              {
                titulo: "Procesados",
                valor: `${dashboard.porcentaje_procesados}%`,
                descripcion: "Comentarios analizados por NLP",
              },
            ].map(({ titulo, valor, descripcion }) => (
              <article className="kpi-card" key={titulo}>
                <span className="kpi-label">{titulo}</span>
                <strong className="kpi-value">{valor}</strong>
                <span className="kpi-description">{descripcion}</span>
              </article>
            ))}
          </section>
          {/* PANELES PRINCIPALES */}
          <section className="dashboard-grid">
            {/* TIEMPOS DE ATENCIÓN */}
            <article className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Tiempos de atención</h2>
                  <p>Promedio diario en minutos</p>
                </div>
                <span className="panel-badge">Últimos registros</span>
              </div>
              {dashboard.tiempos_atencion.length > 0 ? (
                <div className="fake-chart">
                  <div className="chart-bars">
                    {dashboard.tiempos_atencion.map((tiempo, index) => {
                      const altura =
                        maximoTiempo > 0
                          ? Math.max(
                            (tiempo.promedio / maximoTiempo) * 100,
                            8,
                          )
                          : 8;
                      return (
                        <div
                          key={tiempo.fecha}
                          className={`chart-bar bar-${index + 1}`}
                          style={{
                            height: `${altura}%`,
                          }}
                          title={`${tiempo.promedio} min`}
                        />
                      );
                    })}
                  </div>
                  <div className="chart-labels">
                    {dashboard.tiempos_atencion.map((tiempo) => (
                      <span key={tiempo.fecha}>
                        {formatearFecha(tiempo.fecha)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No existen tiempos de atención registrados.</p>
              )}
            </article>
            {/* CATEGORÍAS NLP */}
            <article className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Categorías NLP</h2>
                  <p>Clasificación automática de comentarios</p>
                </div>
                <span className="panel-badge">NLTK</span>
              </div>
              <div className="category-list">
                {dashboard.categorias_nlp.length > 0 ? (
                  dashboard.categorias_nlp.map((categoria) => (
                    <div className="category-item" key={categoria.categoria}>
                      <div className="category-info">
                        <span>
                          {formatearCategoria(categoria.categoria)}
                        </span>
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
                  ))
                ) : (
                  <p>Todavía no existen análisis NLP clasificados.</p>
                )}
              </div>
            </article>
          </section>
          {/* PALABRAS FRECUENTES */}
          <section className="dashboard-panel frequent-panel">
            <div className="panel-header">
              <div>
                <h2>Palabras más frecuentes</h2>
                <p>Términos encontrados en los comentarios procesados</p>
              </div>
              <span className="panel-badge">NLP</span>
            </div>
            <div className="word-list">
              {dashboard.palabras_frecuentes.length > 0 ? (
                dashboard.palabras_frecuentes.map((palabra) => (
                  <span key={palabra.palabra}>
                    {palabra.palabra} ({palabra.frecuencia})
                  </span>
                ))
              ) : (
                <p>Todavía no existen palabras analizadas.</p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
export default Dashboard;
