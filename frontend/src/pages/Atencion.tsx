import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Search } from 'lucide-react';

interface TicketAtencion {
  id: number;
  cliente: string;
  tiempo_minutos: number;
  estado: 'Completado' | 'En Proceso' | 'Pendiente';
  fecha: string;
}

export function Atencion() {
  const [tickets, setTickets] = useState<TicketAtencion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchAtenciones = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/atencion');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error('Error al cargar atenciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtenciones();
  }, []);

  const filteredTickets = tickets.filter(t =>
    t.cliente.toLowerCase().includes(filter.toLowerCase()) ||
    t.estado.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tiempo de Atención"
        subtitle="Monitoreo de duraciones, resolución de tickets y estados de atención"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por cliente o estado..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <button
          onClick={fetchAtenciones}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Actualizar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Cargando registros...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="Sin registros de atención"
          description="No se encontraron sesiones de atención registradas o coincidentes."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Tiempo Resolutivo</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-400">#{ticket.id}</td>
                    <td className="p-4 font-bold text-slate-800">{ticket.cliente}</td>
                    <td className="p-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ticket.tiempo_minutos} min
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black ${
                        ticket.estado === 'Completado' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : ticket.estado === 'En Proceso'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {ticket.estado === 'Completado' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">{ticket.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}