import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, MessageSquare, 
  Brain, LineChart, BarChart3, TrendingUp, SlidersHorizontal, 
  FileSpreadsheet, Settings, ChevronDown, Sparkles 
} from 'lucide-react';

export function Sidebar() {
  const [openGroups, setOpenGroups] = useState({
    gestion: true,
    inteligencia: true,
    ciencia: true,
    admin: true,
  });

  const toggleGroup = (key: keyof typeof openGroups) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 font-bold translate-x-1' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800 flex-shrink-0 select-none">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wide text-white">EMPRESA INTELIGENTE</h1>
          <p className="text-xs text-indigo-300 font-bold">Centro de Atención • SciPy & NLTK</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        <NavLink to="/" className={linkStyle}>
          <LayoutDashboard className="w-5 h-5 mr-3 text-indigo-400" /> Dashboard
        </NavLink>

        <div>
          <button 
            onClick={() => toggleGroup('gestion')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider hover:text-white"
          >
            <span>Gestión</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openGroups.gestion ? 'rotate-180' : ''}`} />
          </button>
          {openGroups.gestion && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink to="/clientes" className={linkStyle}>
                <Users className="w-5 h-5 mr-3 text-emerald-400" /> Clientes
              </NavLink>
              <NavLink to="/atencion" className={linkStyle}>
                <Clock className="w-5 h-5 mr-3 text-cyan-400" /> Tiempo de Atención
              </NavLink>
              <NavLink to="/comentarios" className={linkStyle}>
                <MessageSquare className="w-5 h-5 mr-3 text-amber-400" /> Comentarios
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button 
            onClick={() => toggleGroup('inteligencia')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider hover:text-white"
          >
            <span>Inteligencia</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openGroups.inteligencia ? 'rotate-180' : ''}`} />
          </button>
          {openGroups.inteligencia && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink to="/analisis-nlp" className={linkStyle}>
                <Brain className="w-5 h-5 mr-3 text-purple-400" /> Análisis NLP
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button 
            onClick={() => toggleGroup('ciencia')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider hover:text-white"
          >
            <span>Ciencia de Datos</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openGroups.ciencia ? 'rotate-180' : ''}`} />
          </button>
          {openGroups.ciencia && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink to="/estadisticas-scipy" className={linkStyle}>
                <LineChart className="w-5 h-5 mr-3 text-blue-400" /> Estadísticas SciPy
              </NavLink>
              <NavLink to="/metricas" className={linkStyle}>
                <BarChart3 className="w-5 h-5 mr-3 text-indigo-400" /> Métricas KPI
              </NavLink>
              <NavLink to="/interpolacion" className={linkStyle}>
                <TrendingUp className="w-5 h-5 mr-3 text-teal-400" /> Interpolación
              </NavLink>
              <NavLink to="/optimizacion" className={linkStyle}>
                <SlidersHorizontal className="w-5 h-5 mr-3 text-rose-400" /> Optimización
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button 
            onClick={() => toggleGroup('admin')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider hover:text-white"
          >
            <span>Administración</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openGroups.admin ? 'rotate-180' : ''}`} />
          </button>
          {openGroups.admin && (
            <div className="mt-1 space-y-1 pl-1">
              <NavLink to="/reportes" className={linkStyle}>
                <FileSpreadsheet className="w-5 h-5 mr-3 text-amber-400" /> Reportes
              </NavLink>
              <NavLink to="/configuracion" className={linkStyle}>
                <Settings className="w-5 h-5 mr-3 text-slate-300" /> Configuración
              </NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          Sistema operativo
        </span>
        <span className="text-xs font-bold text-slate-500">v2.4</span>
      </div>
    </aside>
  );
}