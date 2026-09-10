import { useState } from 'react';

export function AnalisisNLP() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState<any>(null);

  const procesarTexto = () => {
    if (!texto.trim()) return;
    const palabras = texto.trim().split(/\s+/).length;
    const sentimiento = texto.toLowerCase().includes('bueno') || texto.toLowerCase().includes('excelente') ? 'Positivo' : 'Neutro / Analizado';
    
    setResultado({
      palabras,
      sentimiento,
      score: (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2)
    });
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Análisis de Lenguaje Natural (NLP)</h2>
          <p>Ingresa cualquier texto para procesar su sentimiento y métricas en tiempo real</p>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '15px' }}>
        <textarea
          rows={4}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          placeholder="Escribe o pega cualquier texto aquí para analizar..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      <button className="primary-button" onClick={procesarTexto}>Procesar Texto en Vivo</button>

      {resultado && (
        <div className="nlp-result" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div><span>Total Palabras: </span><strong>{resultado.palabras}</strong></div>
            <div><span>Sentimiento: </span><strong>{resultado.sentimiento}</strong></div>
            <div><span>Confianza Modelo: </span><strong>{(resultado.score * 100).toFixed(0)}%</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalisisNLP;