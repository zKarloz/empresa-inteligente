import { useState, useEffect } from 'react';

interface AtencionItem {
  id: number;
  cliente: string;
  asunto: string;
  tiempo: string;
  prioridad: string;
  estado: string;
}

export function Atencion() {
  const [atenciones, setAtenciones] = useState<AtencionItem[]>([]);

  useEffect(() => {
    const dataGuardada = localStorage.getItem('app_atenciones');
    if (dataGuardada) {
      setAtenciones(JSON.parse(dataGuardada));
    } else {
      const iniciales = [
        { id: 101, cliente: 'Tech Perú', asunto: 'Consulta sobre API REST', tiempo: '4 min', prioridad: 'Alta', estado: 'En proceso' },
        { id: 102, cliente: 'Innova SAC', asunto: 'Sincronización de base de datos', tiempo: '12 min', prioridad: 'Media', estado: 'Completado' },
        { id: 103, cliente: 'Sistemas Globales', asunto: 'Optimización de servidor', tiempo: '8 min', prioridad: 'Alta', estado: 'En proceso' },
        { id: 104, cliente: 'DataCorp', asunto: 'Soporte en modelo NLP', tiempo: '2 min', prioridad: 'Baja', estado: 'Pendiente' },
        { id: 105, cliente: 'Logística Lima', asunto: 'Revisión de reportes IA', tiempo: '15 min', prioridad: 'Media', estado: 'Completado' }
      ];
      setAtenciones(iniciales);
      localStorage.setItem('app_atenciones', JSON.stringify(iniciales));
    }
  }, []);

  return (
    <div className="content-panel">
      <div className="panel-title">
        <div>
          <h2>Tiempo de Atención</h2>
          <p>Monitoreo de duraciones, resolución de tickets y estados de atención</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Cliente</th>
              <th>Asunto</th>
              <th>Tiempo</th>
              <th>Prioridad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map((a) => (
              <tr key={a.id}>
                <td>#{a.id}</td>
                <td><strong>{a.cliente}</strong></td>
                <td>{a.asunto}</td>
                <td>{a.tiempo}</td>
                <td>{a.prioridad}</td>
                <td><span className="status-active">{a.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Atencion;