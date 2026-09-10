import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { TrendingUp, RefreshCw, Layers } from 'lucide-react';

export function InterpolacionNumerica() {
  const [punto, setPunto] = useState('2.5');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calcularInterpolacion = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/scipy/interpolacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: parseFloat(punto) }),
      });
      if (res.ok) {
        const json = await res.json();
        setResultado(json);
      }
    } catch (err) {
      console.error('Error al interpolar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interpolación Numérica"
        subtitle="Estimación de valores continuos mediante scipy.interpolate"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Punto a Interpolar (X)</span>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Valor de la variable independiente:</label>
            <input
              type="number"
              step="0.1"
              value={punto}
              onChange={e => setPunto(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <button
            onClick={calcularInterpolacion}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-200"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            Calcular Interpolación
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-3 mb-4">
              Valor Estimado (Y)
            </span>
            {resultado ? (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-extrabold text-teal-700 uppercase">Resultado Calculado</span>
                <p className="text-3xl font-black text-teal-900">{resultado.valor_estimado}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center text-slate-400 space-y-2">
                <TrendingUp className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-medium">Ingresa un valor 'X' y presiona calcular.</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-3 border-t border-slate-100">
            Algoritmo: scipy.interpolate.interp1d (Lineal / Cúbica)
          </p>
        </div>
      </div>
    </div>
  );
}