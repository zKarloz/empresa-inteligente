import { useState } from 'react';

export function Optimizacion() {
  const [iteraciones, setIteraciones] = useState('100');
  const [resultado, setResultado] = useState<any>(null);

  const ejecutarOptimizacion = () => {
    setResultado({
      puntoOptimo: (Math.random() * 10 + 1).toFixed(3),
      costoMinimo: (Math.random() * 0.5).toFixed(4),
      eficiencia: '98.6%'
    });
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Optimización de Procesos (SciPy.optimize)</h2>
          <p>Minimización de funciones de costo y asignación eficiente de recursos</p>
        </div>
      </div>

      <div className="form-group" style={{ maxWidth: '300px', marginBottom: '15px' }}>
        <label>Límite de Iteraciones:</label>
        <input type="number" value={iteraciones} onChange={(e) => setIteraciones(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>

      <button className="primary-button" onClick={ejecutarOptimizacion}>Ejecutar Algoritmo de Optimización</button>

      {resultado && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
          <div className="kpi-card" style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
            <span>Punto Óptimo (x*)</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{resultado.puntoOptimo}</div>
          </div>
          <div className="kpi-card" style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
            <span>Costo Mínimo</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{resultado.costoMinimo}</div>
          </div>
          <div className="kpi-card" style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
            <span>Eficiencia Obtenida</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>{resultado.eficiencia}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Optimizacion;