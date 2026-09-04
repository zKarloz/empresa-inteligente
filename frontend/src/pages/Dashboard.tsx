function Dashboard() {
  return (
    <section className="dashboard-page">

      {/* ENCABEZADO */}
      <div className="dashboard-header">
        <div>
          <h1>Centro Inteligente</h1>
          <p>Resumen general de la actividad empresarial</p>
        </div>

        <span className="dashboard-status">Sistema activo</span>
      </div>


      {/* KPIs */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <span className="kpi-label">Clientes</span>
          <strong className="kpi-value">245</strong>
          <span className="kpi-description">
            Clientes registrados
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Comentarios</span>
          <strong className="kpi-value">1,248</strong>
          <span className="kpi-description">
            Comentarios recibidos
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Promedio</span>
          <strong className="kpi-value">16.4 min</strong>
          <span className="kpi-description">
            Tiempo promedio de atención
          </span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Procesados</span>
          <strong className="kpi-value">94%</strong>
          <span className="kpi-description">
            Comentarios analizados
          </span>
        </div>

      </div>


      {/* PANEL CENTRAL */}
      <div className="dashboard-grid">

        {/* TIEMPOS DE ATENCIÓN */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Tiempos de atención</h2>
              <p>Comportamiento reciente</p>
            </div>

            <span className="panel-badge">SciPy</span>
          </div>

          <div className="fake-chart">

            <div className="chart-bars">
              <div className="chart-bar bar-1"></div>
              <div className="chart-bar bar-2"></div>
              <div className="chart-bar bar-3"></div>
              <div className="chart-bar bar-4"></div>
              <div className="chart-bar bar-5"></div>
              <div className="chart-bar bar-6"></div>
              <div className="chart-bar bar-7"></div>
            </div>

            <div className="chart-labels">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mié</span>
              <span>Jue</span>
              <span>Vie</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>

          </div>
        </div>


        {/* CATEGORÍAS NLP */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Categorías NLP</h2>
              <p>Distribución de comentarios</p>
            </div>

            <span className="panel-badge">NLTK</span>
          </div>

          <div className="category-list">

            <div className="category-item">
              <div className="category-info">
                <span>Soporte</span>
                <strong>42%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-value"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span>Ventas</span>
                <strong>27%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-value"
                  style={{ width: "27%" }}
                ></div>
              </div>
            </div>


            <div className="category-item">
              <div className="category-info">
                <span>Reclamos</span>
                <strong>18%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-value"
                  style={{ width: "18%" }}
                ></div>
              </div>
            </div>

          </div>
        </div>

      </div>


      {/* PALABRAS FRECUENTES */}
      <div className="dashboard-panel frequent-panel">

        <div className="panel-header">
          <div>
            <h2>Palabras más frecuentes</h2>
            <p>
              Términos detectados en los comentarios analizados
            </p>
          </div>

          <span className="panel-badge">NLP</span>
        </div>

        <div className="word-list">
          <span>servicio</span>
          <span>atención</span>
          <span>rápido</span>
          <span>producto</span>
          <span>soporte</span>
        </div>

      </div>

    </section>
  );
}

export default Dashboard;