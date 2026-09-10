import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { 
  Users, Clock, MessageSquare, Brain, 
  Activity, BarChart3, RefreshCw 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from 'recharts';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error cargando el dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Cargando métricas del sistema...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState 
        title="Sin conexión al servidor" 
        description="No se pudieron cargar las métricas en tiempo real. Asegúrate de que el backend esté en ejecución." 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <PageHeader 
        title="Panel General de Control" 
        subtitle="Métricas globales en tiempo real del centro de atención al cliente"
        actions={
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        }
      />

      {/* Fila de Tarjetas de Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Clientes" 
          value={data.total_clientes || 0} 
          badge="+12%" 
          badgeColor="green"
          icon={Users}
          subtext="Registrados en la base de datos"
        />
        <StatCard 
          title="Atención Promedio" 
          value={`${data.promedio_atencion || 0} min`} 
          badge="Óptimo" 
          badgeColor="blue"
          icon={Clock}
          subtext="Tiempo de resolución global"
        />
        <StatCard 
          title="Comentarios" 
          value={data.total_comentarios || 0} 
          badge="100% NLTK" 
          badgeColor="amber"
          icon={MessageSquare}
          subtext="Procesados para análisis NLP"
        />
        <StatCard 
          title="Satisfacción" 
          value={`${data.indice_satisfaccion || 0}%`} 
          badge="Alto" 
          badgeColor="green"
          icon={Brain}
          subtext="Basado en modelo sentimental"
        />
      </div>

      {/* Gráficos Principales de Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Actividad Reciente */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">Frecuencia de Atenciones</h3>
              <p className="text-[11px] text-slate-400 font-medium">Volumen de tickets por día</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.grafico_atenciones || []}>
                <defs>
                  <linearGradient id="colorAtencion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dia" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="cantidad" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtencion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Sentimiento del Cliente */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">Distribución de Sentimientos</h3>
              <p className="text-[11px] text-slate-400 font-medium">Análisis de comentarios procesados</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distribucion_sentimientos || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="categoria" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="cantidad" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}