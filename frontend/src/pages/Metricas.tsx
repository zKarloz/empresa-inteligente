function Metricas() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Scientific Data</h1>
        <p>
          Estadísticas, interpolación y optimización mediante SciPy.
        </p>
      </div>

      <div className="module-cards">
        <div className="module-card">
          <span>Media</span>
          <strong>17.2</strong>
        </div>

        <div className="module-card">
          <span>Mediana</span>
          <strong>17.5</strong>
        </div>

        <div className="module-card">
          <span>Desviación estándar</span>
          <strong>4.44</strong>
        </div>

        <div className="module-card">
          <span>Máximo</span>
          <strong>25</strong>
        </div>
      </div>

      <div className="three-column-grid">
        <div className="content-panel feature-panel">
          <span className="feature-tag">SciPy</span>

          <h2>Estadísticas</h2>

          <p>
            Cálculo de media, mediana, desviación estándar,
            percentiles, mínimos y máximos.
          </p>

          <button className="secondary-button">
            Ver estadísticas
          </button>
        </div>

        <div className="content-panel feature-panel">
          <span className="feature-tag">SciPy</span>

          <h2>Interpolación</h2>

          <p>
            Estimación de valores utilizando los datos almacenados
            en el sistema.
          </p>

          <button className="secondary-button">
            Ver interpolación
          </button>
        </div>

        <div className="content-panel feature-panel">
          <span className="feature-tag">SciPy</span>

          <h2>Optimización</h2>

          <p>
            Evaluación de escenarios para obtener mejores resultados
            empresariales.
          </p>

          <button className="secondary-button">
            Ver optimización
          </button>
        </div>
      </div>
    </section>
  );
}

export default Metricas;