function Clientes() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Clientes</h1>
        <p>Gestión general de los clientes registrados en el sistema.</p>
      </div>

      <div className="module-cards">
        <div className="module-card">
          <span>Total clientes</span>
          <strong>245</strong>
        </div>

        <div className="module-card">
          <span>Clientes activos</span>
          <strong>218</strong>
        </div>

        <div className="module-card">
          <span>Nuevos este mes</span>
          <strong>27</strong>
        </div>
      </div>

      <div className="content-panel">
        <div className="panel-title">
          <div>
            <h2>Lista de clientes</h2>
            <p>Últimos clientes registrados</p>
          </div>

          <button className="primary-button">
            Nuevo cliente
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Correo</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>María López</td>
                <td>Empresa Andina</td>
                <td>maria@empresa.com</td>
                <td>
                  <span className="status active-status">Activo</span>
                </td>
              </tr>

              <tr>
                <td>Carlos Pérez</td>
                <td>Grupo Central</td>
                <td>carlos@grupo.com</td>
                <td>
                  <span className="status active-status">Activo</span>
                </td>
              </tr>

              <tr>
                <td>Ana Torres</td>
                <td>Servicios Norte</td>
                <td>ana@servicios.com</td>
                <td>
                  <span className="status inactive-status">Inactivo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Clientes;