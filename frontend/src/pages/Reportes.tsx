import { useRef } from 'react';

export function Reportes() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const abrirExploradorArchivos = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Reportes e Informes de IA</h2>
          <p>Exportación de resúmenes institucionales e informes predictivos</p>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => alert(`Archivo seleccionado: ${e.target.files?.[0]?.name}`)} 
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button className="primary-button" onClick={abrirExploradorArchivos}>Subir/Seleccionar Archivo de PC</button>
        <button className="secondary-button" onClick={() => alert('Generando PDF...')}>Descargar Reporte General (PDF)</button>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <h3 style={{ color: '#166534', marginTop: 0 }}>🤖 Informe de Inteligencia Artificial & Diagnóstico</h3>
        <p style={{ color: '#15803d', fontSize: '14px', lineHeight: '1.5' }}>
          <strong>Resumen Predictivo:</strong> En base a las tendencias recolectadas en la base de datos de atención, el modelo predice un incremento del <strong>15% en las consultas</strong> para el próximo periodo. Se recomienda optimizar las respuestas automáticas del bot NLP y reforzar el servidor backend en Railway.
        </p>
      </div>
    </div>
  );
}

export default Reportes;