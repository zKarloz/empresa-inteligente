import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { LineChart, Calculator, RefreshCw, BarChart2, Activity } from 'lucide-react';

export function EstadisticasSciPy() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEstadisticas = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/scipy/estadisticas');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error al cargar SciPy stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estadísticas SciPy"
        subtitle="Cálculos descriptivos y métricas avanzadas procesadas por scipy.stats"
        actions={
          <button
            onClick={fetchEstadisticas}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-calcular
          </button>
        }
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Procesando con scipy.stats...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Media (Promedio)"
              value={data?.media || 0}
              badge="SciPy"
              badgeColor="blue"
              icon={Calculator}
              subtext="Promedio aritmético exacto"
            />
            <StatCard
              title="Mediana"
              value={data?.mediana || 0}
              badge="SciPy"
              badgeColor="green"
              icon={BarChart2}
              subtext="Punto central de datos"
            />
            <StatCard
              title="Desviación Estándar"
              value={data?.desviacion || 0}
              badge="SciPy"
              badgeColor="amber"
              icon={Activity}
              subtext="Dispersión de atenciones"
            />
            <StatCard
              title="Varianza"
              value={data?.varianza || 0}
              badge="SciPy"
              badgeColor="red"
              icon={LineChart}
              subtext="Grado de variación total"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-2">Resumen del Análisis Estadístico</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Los cálculos mostrados en este módulo han sido generados mediante rutinas optimizadas de C y Python utilizando el paquete <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">scipy.stats</code>. Estas métricas garantizan precisión matemática para la toma de decisiones sobre la calidad del servicio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}