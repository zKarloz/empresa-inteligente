function Atencion() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Atención</h1>
        <p>
          Seguimiento de solicitudes, comentarios y tiempos de atención.
        </p>
      </div>

      <div className="module-cards">
        <div className="module-card">
          <span>Solicitudes pendientes</span>
          <strong>18</strong>
        </div>

        <div className="module-card">
          <span>Comentarios recibidos</span>
          <strong>1,248</strong>
        </div>

        <div className="module-card">
          <span>Tiempo promedio</span>
          <strong>16.4 min</strong>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="content-panel">
          <div className="panel-title">
            <div>
              <h2>Solicitudes recientes</h2>
              <p>Últimas solicitudes registradas</p>
            </div>
          </div>

          <div className="simple-list">
            <div className="simple-list-item">
              <div>
                <strong>Consulta sobre servicio</strong>
                <span>Cliente 01</span>
              </div>

              <span className="status pending-status">Pendiente</span>
            </div>

            <div className="simple-list-item">
              <div>
                <strong>Problema con atención</strong>
                <span>Cliente 02</span>
              </div>

              <span className="status active-status">Atendido</span>
            </div>

            <div className="simple-list-item">
              <div>
                <strong>Solicitud de información</strong>
                <span>Cliente 03</span>
              </div>

              <span className="status pending-status">Pendiente</span>
            </div>
          </div>
        </div>

        <div className="content-panel">
          <div className="panel-title">
            <div>
              <h2>Tiempos de atención</h2>
              <p>Resumen general</p>
            </div>
          </div>

          <div className="attention-summary">
            <div>
              <span>Promedio</span>
              <strong>16.4 min</strong>
            </div>

            <div>
              <span>Mínimo</span>
              <strong>11 min</strong>
            </div>

            <div>
              <span>Máximo</span>
              <strong>25 min</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Atencion;