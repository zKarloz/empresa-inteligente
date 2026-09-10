export function Metricas() {
  const metricasModelos = [
    { modelo: 'Modelo NLP (Sentimiento)', precision: '94.8%', recall: '92.1%', f1Score: '93.4%' },
    { modelo: 'Interpolación / Curvas', precision: '98.2%', recall: '97.5%', f1Score: '97.8%' },
    { modelo: 'Optimizador SciPy', precision: '99.1%', recall: '98.9%', f1Score: '99.0%' }
  ];

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Métricas del Sistema e Inteligencia Artificial</h2>
          <p>Evaluación de rendimiento, precisión y matriz de desempeño de los algoritmos</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '25px' }}>
        <div className="kpi-card">
          <span className="kpi-label">Precisión Promedio</span>
          <div className="kpi-value">97.3%</div>
          <span className="kpi-description">En todos los modelos</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Latencia Muestral</span>
          <div className="kpi-value">32 ms</div>
          <span className="kpi-description">Respuesta inmediata</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Error Cuadrático Medio (MSE)</span>
          <div className="kpi-value">0.012</div>
          <span className="kpi-description">Nivel óptimo</span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Modelo / Algoritmo</th>
              <th>Precisión (Accuracy)</th>
              <th>Exhaustividad (Recall)</th>
              <th>F1-Score</th>
            </tr>
          </thead>
          <tbody>
            {metricasModelos.map((m, index) => (
              <tr key={index}>
                <td><strong>{m.modelo}</strong></td>
                <td>{m.precision}</td>
                <td>{m.recall}</td>
                <td><span className="status-active">{m.f1Score}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Metricas;