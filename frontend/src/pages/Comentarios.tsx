import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { MessageSquare, RefreshCw, Search, User } from 'lucide-react';

interface Comentario {
  id: number;
  cliente: string;
  texto: string;
  fecha: string;
}

export function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchComentarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/comentarios');
      if (res.ok) {
        const data = await res.json();
        setComentarios(data);
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const filtered = comentarios.filter(c =>
    c.cliente.toLowerCase().includes(filter.toLowerCase()) ||
    c.texto.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comentarios del Cliente"
        subtitle="Listado de feedback y opiniones recopiladas para análisis de texto"
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar en comentarios..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <button
          onClick={fetchComentarios}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Cargando comentarios...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Sin comentarios encontrados"
          description="No existen opiniones registradas con ese término de búsqueda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.cliente}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{item.fecha}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{item.texto}"
              </p>
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-600">
                <MessageSquare className="w-3 h-3" /> Registrado para NLTK
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}