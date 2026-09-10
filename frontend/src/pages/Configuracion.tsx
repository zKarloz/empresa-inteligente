import { PageHeader } from '../components/PageHeader';
import { Save, Server, Shield } from 'lucide-react';

export function Configuracion() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración del Sistema"
        subtitle="Ajustes de conexión al servidor Python, límites de API y parámetros generales"
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="w-4 h-4 text-indigo-600" /> Servidor Backend (Flask)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">URL de la API</label>
              <input
                type="text"
                defaultValue="http://localhost:5000"
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Timeout de Petición (segundos)</label>
              <input
                type="number"
                defaultValue={30}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-indigo-600" /> Modelos SciPy & NLTK
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Detección Automática de Sentimientos</span>
              <span className="text-[11px] text-slate-400">Procesar comentarios en tiempo real mediante NLTK al registrarlos</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}