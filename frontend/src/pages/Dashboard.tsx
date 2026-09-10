import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Dashboard() {
  const datosVentas = [
    { mes: 'Ene', ventas: 4000, atenciones: 240 },
    { mes: 'Feb', ventas: 3000, atenciones: 198 },
    { mes: 'Mar', ventas: 5000, atenciones: 300 },
    { mes: 'Abr', ventas: 4780, atenciones: 280 },
    { mes: 'May', ventas: 5890, atenciones: 390 },
    { mes: 'Jun', ventas: 6390, atenciones: 430 }
  ];

  const datosServidores = [
    { servicio: 'Backend FastAPI (Railway)', estado: 'Operativo', latencia: '45ms', uptime: '99.9%' },
    { servicio: 'Base de Datos (Oracle/SQL)', estado: 'Operativo', latencia: '12ms', uptime: '100%' },
    { servicio: 'Modelo NLP / SciPy', estado: 'Operativo', latencia: '110ms', uptime: '98.5%' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Principal</h1>
          <p>Métricas del sistema y estado de los servicios en tiempo real</p>
        </div>
        <span className="dashboard-status">● Sistema Online</span>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Clientes Totales</span>
          <div className="kpi-value">1,248</div>
          <span className="kpi-description">+12% este mes</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Atenciones Hoy</span>
          <div className="kpi-value">430</div>
          <span className="kpi-description">Tiempo prom. 4.2 min</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Precisión IA / NLP</span>
          <div className="kpi-value">94.8%</div>
          <span className="kpi-description">Sentimiento positivo</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Uso Servidor</span>
          <div className="kpi-value">28%</div>
          <span className="kpi-description">Carga óptima</span>
        </div>
      </div>

      <div className="two-column-grid" style={{ marginBottom: '20px' }}>
        <div className="content-panel">
          <div className="panel-title">
            <h2>Rendimiento de Atenciones</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosVentas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="atenciones" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="content-panel">
          <div className="panel-title">
            <h2>Volumen de Consultas</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosVentas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="content-panel">
        <div className="panel-title">
          <div>
            <h2>Estado de Infraestructura en Railway & Cloud</h2>
            <p>Monitoreo de microservicios e integración backend</p>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Servicio / API</th>
                <th>Estado</th>
                <th>Latencia</th>
                <th>Uptime</th>
              </tr>
            </thead>
            <tbody>
              {datosServidores.map((s, index) => (
                <tr key={index}>
                  <td><strong>{s.servicio}</strong></td>
                  <td><span className="status-active">{s.estado}</span></td>
                  <td>{s.latencia}</td>
                  <td>{s.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;