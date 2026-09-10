import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { Search, Plus, Trash2, Edit3, RefreshCw } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/clientes');
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clientes/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setClientes(prev => prev.filter(c => c.id !== deleteId));
      }
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredClientes = clientes.filter(
    c =>
      c.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      c.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Administra la información de contacto y directorio de clientes"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-200">
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </button>
        }
      />

      {/* Barra de Filtro y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <button
          onClick={fetchClientes}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Actualizar tabla"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido / Tabla */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Cargando directorio...</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <EmptyState
          title="No se encontraron clientes"
          description="No hay registros que coincidan con la búsqueda actual o la lista está vacía."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredClientes.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-400">#{cliente.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs">
                          {cliente.nombre.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{cliente.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-700">{cliente.email}</p>
                      <p className="text-[11px] text-slate-400">{cliente.telefono || 'Sin teléfono'}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {cliente.empresa || 'Particular'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cliente.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="¿Eliminar cliente?"
        message="Esta acción borrará permanentemente el registro del cliente de la base de datos."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}