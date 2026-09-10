import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Activity, Award, Target, Zap, RefreshCw } from 'lucide-react';

export function Metricas() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetricas = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/metricas');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error al cargar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Métricas y Analytics"
        subtitle="Evaluación del desempeño general del sistema y calidad de atención"
        actions={
          <button
            onClick={fetchMetricas}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        }
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Calculando indicadores clave...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Efectividad CSAT"
            value={`${data?.csat || 94}%`}
            badge="Excelente"
            badgeColor="green"
            icon={Award}
            subtext="Índice de satisfacción directa"
          />
          <StatCard
            title="Resolución 1er Contacto"
            value={`${data?.fcr || 88}%`}
            badge="Alto"
            badgeColor="blue"
            icon={Target}
            subtext="Tickets resueltos al primer intento"
          />
          <StatCard
            title="Tiempo Respuesta"
            value={`${data?.sla || 1.2} min`}
            badge="SLA Cumplido"
            badgeColor="green"
            icon={Zap}
            subtext="Tiempo medio de primera respuesta"
          />
          <StatCard
            title="Retención Clientes"
            value={`${data?.retencion || 96}%`}
            badge="Estable"
            badgeColor="amber"
            icon={Activity}
            subtext="Tasa de permanencia mensual"
          />
        </div>
      )}
    </div>
  );
}