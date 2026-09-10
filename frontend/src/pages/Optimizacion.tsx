import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SlidersHorizontal, RefreshCw, CheckCircle2 } from 'lucide-react';

export function Optimizacion() {
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ejecutarOptimizacion = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/scipy/optimizacion');
      if (res.ok) {
        const json = await res.json();
        setResultado(json);
      }
    } catch (err) {
      console.error('Error al optimizar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Optimización de Procesos"
        subtitle="Minimización y maximización de funciones con scipy.optimize"
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800">Modelo de Minimización de Costos</h3>
            <p className="text-xs text-slate-400 mt-0.5">Encuentra los puntos óptimos de asignación de recursos de atención</p>
          </div>
          <button
            onClick={ejecutarOptimizacion}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-200"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SlidersHorizontal className="w-4 h-4" />}
            Ejecutar Optimización
          </button>
        </div>

        {resultado ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Punto Mínimo Encontrado (x)</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{resultado.x_optimo || '0.00'}</p>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase">Valor Mínimo de la Función f(x)</span>
              <p className="text-2xl font-black text-rose-900 mt-1">{resultado.f_minima || '0.00'}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-slate-200 border-dashed rounded-2xl">
            <SlidersHorizontal className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">Presiona "Ejecutar Optimización" para calcular el punto mínimo.</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Método scipy.optimize.minimize (BFGS / Nelder-Mead)
        </div>
      </div>
    </div>
  );
}