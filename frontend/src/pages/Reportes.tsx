function Reportes() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Reportes</h1>
        <p>
          Consulta de reportes generados a partir de la información empresarial.
        </p>
      </div>

      <div className="three-column-grid">
        <div className="content-panel feature-panel">
          <span className="feature-tag">Atención</span>

          <h2>Reporte de atención</h2>

          <p>
            Resumen de solicitudes, comentarios y tiempos de atención.
          </p>

          <button className="secondary-button">
            Ver reporte
          </button>
        </div>

        <div className="content-panel feature-panel">
          <span className="feature-tag">NLTK</span>

          <h2>Reporte NLP</h2>

          <p>
            Categorías, clasificación y palabras frecuentes detectadas.
          </p>

          <button className="secondary-button">
            Ver reporte
          </button>
        </div>

        <div className="content-panel feature-panel">
          <span className="feature-tag">SciPy</span>

          <h2>Reporte estadístico</h2>

          <p>
            Métricas estadísticas generadas a partir de los datos empresariales.
          </p>

          <button className="secondary-button">
            Ver reporte
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reportes;