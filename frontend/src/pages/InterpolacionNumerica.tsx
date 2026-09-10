import { useState } from 'react';

export function InterpolacionNumerica() {
  const [punto, setPunto] = useState('2.5');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const val = parseFloat(punto);
    if (!isNaN(val)) {
      setResultado(val * 1.85 + 2.3);
    }
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Interpolación Numérica</h2>
          <p>Estimación de valores mediante modelos de curvas</p>
        </div>
      </div>

      <div className="form-grid" style={{ maxWidth: '300px' }}>
        <div className="form-group">
          <label>Valor de variable independiente (X):</label>
          <input type="number" value={punto} onChange={(e) => setPunto(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
      </div>

      <button className="primary-button" style={{ marginTop: '15px' }} onClick={calcular}>
        Calcular Interpolación
      </button>

      {resultado !== null && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
          <h4 style={{ margin: 0, color: '#1e40af' }}>Valor Estimado Resultante:</h4>
          <strong style={{ fontSize: '18px', color: '#1e3a8a' }}>f({punto}) ≈ {resultado.toFixed(4)}</strong>
        </div>
      )}
    </div>
  );
}

export default InterpolacionNumerica;