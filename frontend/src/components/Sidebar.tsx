import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, MessageSquare, 
  Brain, LineChart, BarChart3, TrendingUp, SlidersHorizontal, 
  FileSpreadsheet, Settings, ChevronDown, Sparkles 
} from 'lucide-react';

interface SidebarProps {
  searchQuery?: string;
}

export function Sidebar({ searchQuery = '' }: SidebarProps) {
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

  // Normaliza el texto quitando espacios y tildes para evitar errores de coincidencia
  const normalizeText = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

  const query = normalizeText(searchQuery);

  const matchesSearch = (text: string) => {
    if (!query) return true;
    return normalizeText(text).includes(query);
  };

  const groups = [
    {
      key: 'gestion' as const,
      title: 'Gestión',
      items: [
        { to: '/clientes', label: 'Clientes', icon: Users, color: 'text-emerald-400' },
        { to: '/atencion', label: 'Tiempo de Atención', icon: Clock, color: 'text-cyan-400' },
        { to: '/comentarios', label: 'Comentarios', icon: MessageSquare, color: 'text-amber-400' },
      ]
    },
    {
      key: 'inteligencia' as const,
      title: 'Inteligencia',
      items: [
        { to: '/analisis-nlp', label: 'Análisis NLP', icon: Brain, color: 'text-purple-400' },
      ]
    },
    {
      key: 'ciencia' as const,
      title: 'Ciencia de Datos',
      items: [
        { to: '/estadisticas-scipy', label: 'Estadísticas SciPy', icon: LineChart, color: 'text-blue-400' },
        { to: '/metricas', label: 'Métricas KPI', icon: BarChart3, color: 'text-indigo-400' },
        { to: '/interpolacion', label: 'Interpolación', icon: TrendingUp, color: 'text-teal-400' },
        { to: '/optimizacion', label: 'Optimización', icon: SlidersHorizontal, color: 'text-rose-400' },
      ]
    },
    {
      key: 'admin' as const,
      title: 'Administración',
      items: [
        { to: '/reportes', label: 'Reportes', icon: FileSpreadsheet, color: 'text-amber-400' },
        { to: '/configuracion', label: 'Configuración', icon: Settings, color: 'text-slate-300' },
      ]
    }
  ];

  const showDashboard = matchesSearch('Dashboard');

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
        {showDashboard && (
          <NavLink to="/" className={linkStyle}>
            <LayoutDashboard className="w-5 h-5 mr-3 text-indigo-400" /> Dashboard
          </NavLink>
        )}

        {groups.map(group => {
          const filteredItems = group.items.filter(item => matchesSearch(item.label));

          if (filteredItems.length === 0) return null;

          const isGroupOpen = query ? true : openGroups[group.key];

          return (
            <div key={group.key}>
              <button 
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-black text-slate-400 uppercase tracking-wider hover:text-white"
              >
                <span>{group.title}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
              </button>

              {isGroupOpen && (
                <div className="mt-1 space-y-1 pl-1">
                  {filteredItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.to} to={item.to} className={linkStyle}>
                        <Icon className={`w-5 h-5 mr-3 ${item.color}`} /> {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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