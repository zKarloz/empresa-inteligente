import React, { useState, useEffect } from 'react';

interface Comentario {
  id: number;
  usuario: string;
  texto: string;
  fecha: string;
}

export function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [usuarioNombre, setUsuarioNombre] = useState('');

  useEffect(() => {
    const dataGuardada = localStorage.getItem('app_comentarios');
    if (dataGuardada) {
      setComentarios(JSON.parse(dataGuardada));
    } else {
      const iniciales = [
        { id: 1, usuario: 'Carlos R.', texto: 'Excelente servicio y atención en plataforma.', fecha: '2026-09-08' },
        { id: 2, usuario: 'Ana M.', texto: 'La respuesta del sistema fue rápida y clara.', fecha: '2026-09-09' },
        { id: 3, usuario: 'Luis M.', texto: 'Los algoritmos de optimización mejoraron mucho nuestro rendimiento.', fecha: '2026-09-09' },
        { id: 4, usuario: 'Sofía T.', texto: 'El módulo de análisis NLP es bastante preciso.', fecha: '2026-09-10' },
        { id: 5, usuario: 'Diego F.', texto: 'Buena integración con la base de datos y la interfaz gráfica.', fecha: '2026-09-10' }
      ];
      setComentarios(iniciales);
      localStorage.setItem('app_comentarios', JSON.stringify(iniciales));
    }
  }, []);

  const agregarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim() || !usuarioNombre.trim()) return;

    const nuevo = {
      id: comentarios.length + 1,
      usuario: usuarioNombre,
      texto: nuevoTexto,
      fecha: new Date().toISOString().split('T')[0]
    };

    const listaActualizada = [nuevo, ...comentarios];
    setComentarios(listaActualizada);
    localStorage.setItem('app_comentarios', JSON.stringify(listaActualizada));

    setNuevoTexto('');
    setUsuarioNombre('');
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Comentarios de Usuarios</h2>
          <p>Listado de retroalimentación recibida en tiempo real</p>
        </div>
      </div>

      <form onSubmit={agregarComentario} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Tu nombre / cliente..."
            value={usuarioNombre}
            onChange={(e) => setUsuarioNombre(e.target.value)}
            style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #d1d5db' }}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Escribe tu opinión en tiempo real..."
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            style={{ padding: '8px', flex: 3, borderRadius: '4px', border: '1px solid #d1d5db' }}
            required
          />
          <button type="submit" className="primary-button">Publicar Opinión</button>
        </div>
      </form>

      <div className="simple-list">
        {comentarios.map((c) => (
          <div key={c.id} className="simple-list-item" style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            <div>
              <strong>{c.usuario}</strong>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>{c.texto}</p>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{c.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comentarios;