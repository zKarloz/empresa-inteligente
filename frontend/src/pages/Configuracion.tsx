import { useState } from 'react';

export function Configuracion() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [alertas, setAlertas] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [modeloNlp, setModeloNlp] = useState('nltk_v2_sentiment');
  const [guardado, setGuardado] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="content-panel">
      <div className="panel-title" style={{ marginBottom: '25px' }}>
        <div>
          <h2>Configuración del Sistema</h2>
          <p>Ajustes generales, integración de servidor FastAPI y parámetros del motor IA</p>
        </div>
        {guardado && (
          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            ✓ Configuración guardada correctamente
          </span>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Conexión con Servidor Backend */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>🌐 Servidor & Backend</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              URL Backend (FastAPI / Railway):
            </label>
            <input 
              type="text" 
              value={apiUrl} 
              onChange={(e) => setApiUrl(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} 
            />
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#374151' }}>Sincronización en tiempo real con SciPy/NLTK</span>
            <input type="checkbox" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#374151' }}>Activar alertas y notificaciones del sistema</span>
            <input type="checkbox" checked={alertas} onChange={(e) => setAlertas(e.target.checked)} />
          </div>
        </div>

        {/* Parámetros de Procesamiento NLP & IA */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>🧠 Motor Inteligente (NLP)</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Modelo de Sentimiento Activo:
            </label>
            <select 
              value={modeloNlp} 
              onChange={(e) => setModeloNlp(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
            >
              <option value="nltk_v2_sentiment">NLTK VADER - Español Latino</option>
              <option value="scipy_kpi_opt">SciPy Optimizer + TextBlob</option>
              <option value="custom_pipeline">Pipeline de Clasificación Personalizado</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#374151' }}>Limpieza automática de caracteres especiales</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#374151' }}>Umbral de Confianza Mínimo (NLP): 0.85</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        {/* Mantenimiento y Base de Datos */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>🗄️ Base de Datos & Almacenamiento</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Estado actual del almacenamiento local de prueba y conexión remota.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="secondary-button" onClick={() => localStorage.clear()}>
              Limpiar Caché Local
            </button>
            <button type="button" className="secondary-button">
              Exportar Backup JSON
            </button>
          </div>
        </div>

        {/* Guardar Cambios */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1e293b' }}>💾 Aplicar Cambios</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Guarda los ajustes de la sesión actual y actualiza los parámetros globales.</p>
          <button type="submit" className="primary-button" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default Configuracion;