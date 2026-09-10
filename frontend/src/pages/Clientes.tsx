import React, { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  empresa: string;
  estado: string;
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', empresa: '' });

  useEffect(() => {
    const dataGuardada = localStorage.getItem('app_clientes');
    if (dataGuardada) {
      setClientes(JSON.parse(dataGuardada));
    } else {
      const iniciales = [
        { id: 1, nombre: 'Juan Pérez', email: 'juan@empresa.com', empresa: 'Tech Perú', estado: 'Activo' },
        { id: 2, nombre: 'María García', email: 'maria@innova.pe', empresa: 'Innova SAC', estado: 'Activo' },
        { id: 3, nombre: 'Luis Mendoza', email: 'luis@sistemas.pe', empresa: 'Sistemas Globales', estado: 'Activo' },
        { id: 4, nombre: 'Sofía Torres', email: 'sofia@datacorp.com', empresa: 'DataCorp', estado: 'Activo' },
        { id: 5, nombre: 'Diego Flores', email: 'diego@logistica.pe', empresa: 'Logística Lima', estado: 'Activo' }
      ];
      setClientes(iniciales);
      localStorage.setItem('app_clientes', JSON.stringify(iniciales));
    }
  }, []);

  const agregarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoId = clientes.length + 1;
    const nuevoCliente = { ...form, id: nuevoId, estado: 'Activo' };
    const listaActualizada = [...clientes, nuevoCliente];

    setClientes(listaActualizada);
    localStorage.setItem('app_clientes', JSON.stringify(listaActualizada));

    // Generar ticket en Tiempo de Atención
    const atencionesActuales = JSON.parse(localStorage.getItem('app_atenciones') || '[]');
    const nuevoTicket = {
      id: 100 + nuevoId,
      cliente: form.empresa,
      asunto: 'Integración y prueba de plataforma',
      tiempo: '1 min',
      prioridad: 'Media',
      estado: 'En proceso'
    };
    localStorage.setItem('app_atenciones', JSON.stringify([nuevoTicket, ...atencionesActuales]));

    // Generar comentario automático del cliente
    const comentariosActuales = JSON.parse(localStorage.getItem('app_comentarios') || '[]');
    const nuevoComentario = {
      id: comentariosActuales.length + 1,
      usuario: form.nombre,
      texto: `Satisfecho con el registro en la plataforma desde ${form.empresa}.`,
      fecha: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('app_comentarios', JSON.stringify([nuevoComentario, ...comentariosActuales]));

    setModal(false);
    setForm({ nombre: '', email: '', empresa: '' });
  };

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Gestión de Clientes</h2>
          <p>Administración e integración de clientes en tiempo real</p>
        </div>
        <button className="primary-button" onClick={() => setModal(true)}>+ Agregar Cliente</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Empresa</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>#{c.id}</td>
                <td><strong>{c.nombre}</strong></td>
                <td>{c.email}</td>
                <td>{c.empresa}</td>
                <td><span className="status-active">{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="content-panel" style={{ width: '400px', backgroundColor: '#ffffff' }}>
            <h3>Nuevo Cliente</h3>
            <form onSubmit={agregarCliente} style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Nombre</label>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Empresa</label>
                <input required value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="primary-button">Guardar e Integrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;