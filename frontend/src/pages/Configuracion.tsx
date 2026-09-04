function Configuracion() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Configuración</h1>
        <p>
          Administración general y configuración del sistema.
        </p>
      </div>

      <div className="module-cards">
        <div className="module-card">
          <span>Usuarios</span>
          <strong>12</strong>
        </div>

        <div className="module-card">
          <span>Categorías</span>
          <strong>6</strong>
        </div>

        <div className="module-card">
          <span>Eventos de auditoría</span>
          <strong>328</strong>
        </div>
      </div>

      <div className="three-column-grid">
        <div className="content-panel feature-panel">
          <h2>Usuarios</h2>

          <p>
            Administración de usuarios y roles del sistema.
          </p>

          <button className="secondary-button">
            Administrar
          </button>
        </div>

        <div className="content-panel feature-panel">
          <h2>Categorías</h2>

          <p>
            Configuración de categorías utilizadas para clasificar comentarios.
          </p>

          <button className="secondary-button">
            Configurar
          </button>
        </div>

        <div className="content-panel feature-panel">
          <h2>Auditoría</h2>

          <p>
            Consulta de las acciones realizadas dentro de la aplicación.
          </p>

          <button className="secondary-button">
            Ver auditoría
          </button>
        </div>
      </div>
    </section>
  );
}

export default Configuracion;