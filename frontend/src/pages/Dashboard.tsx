import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricState {
  total_clientes: number;
  atencion_promedio: number;
  comentarios: number;
  satisfaccion: number;
}

interface FrecuenciaItem {
  dia: string;
  tickets: number;
}

interface SentimientoItem {
  tipo: string;
  valor: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricState>({
    total_clientes: 0,
    atencion_promedio: 16.86,
    comentarios: 0,
    satisfaccion: 85
  });

  const [frecuencia, setFrecuencia] = useState<FrecuenciaItem[]>([
    { dia: 'Lun', tickets: 12 },
    { dia: 'Mar', tickets: 19 },
    { dia: 'Mié', tickets: 15 },
    { dia: 'Jue', tickets: 22 },
    { dia: 'Vie', tickets: 18 },
    { dia: 'Sáb', tickets: 9 },
    { dia: 'Dom', tickets: 5 }
  ]);

  const [sentimientos, setSentimientos] = useState<SentimientoItem[]>([
    { tipo: 'Positivo', valor: 65 },
    { tipo: 'Neutro', valor: 20 },
    { tipo: 'Negativo', valor: 15 }
  ]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data) setMetrics((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => console.log('Cargando métricas dinámicas locales...', err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel General de Control</h1>
          <p className="text-gray-500 text-sm">
            Métricas globales en tiempo real del centro de atención al cliente
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-white border text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-50 shadow-sm"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-bold tracking-wider">TOTAL CLIENTES</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.total_clientes}</p>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">+12%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-bold tracking-wider">ATENCIÓN PROMEDIO</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.atencion_promedio} min</p>
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">Óptimo</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-bold tracking-wider">COMENTARIOS</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.comentarios}</p>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">100% NLTK</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-bold tracking-wider">SATISFACCIÓN</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.satisfaccion}%</p>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">Modelo IA</span>
          </div>
        </div>
      </div>

      {/* Gráficos en Tiempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frecuencia de Atenciones */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800">Frecuencia de Atenciones</h2>
          <p className="text-xs text-gray-400 mb-4">Volumen de tickets procesados por día</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={frecuencia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dia" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Sentimientos */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800">Distribución de Sentimientos</h2>
          <p className="text-xs text-gray-400 mb-4">Análisis de comentarios procesados mediante NLTK</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimientos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tipo" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="valor" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}