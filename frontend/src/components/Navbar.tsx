import { useState } from 'react';
import { Search, Bell, User, CheckCircle2, AlertCircle, Info, LogOut, Settings as SettingsIcon } from 'lucide-react';

export function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-indigo-900 border-b border-indigo-800 px-6 flex items-center justify-between flex-shrink-0 z-30 text-white shadow-md w-full">
      {/* Título adaptable */}
      <div className="flex items-center gap-3 min-w-max">
        <span className="text-sm font-extrabold text-white uppercase tracking-wider whitespace-nowrap">
          Centro Inteligente
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Búsqueda rápida */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-indigo-300 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="pl-9 pr-4 py-1.5 text-xs bg-indigo-950/60 text-white placeholder-indigo-300 border border-indigo-700 rounded-xl w-60 focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-950 transition-all outline-none"
          />
        </div>

        {/* Campana de Notificaciones */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-400 rounded-full ring-2 ring-indigo-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="text-xs font-black text-slate-800">Notificaciones</h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">3 Nuevas</span>
              </div>
              <div className="space-y-3">
                {/* Opción 1 */}
                <div className="flex gap-3 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-700">Tiempo elevado</p>
                    <p className="text-[11px] text-slate-400">Atención supera el promedio estipulado.</p>
                  </div>
                </div>
                {/* Opción 2 */}
                <div className="flex gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-700">Análisis completado</p>
                    <p className="text-[11px] text-slate-400">Procesamiento NLP con NLTK exitoso.</p>
                  </div>
                </div>
                {/* Opción 3 */}
                <div className="flex gap-3 text-xs">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-700">Modelo SciPy actualizado</p>
                    <p className="text-[11px] text-slate-400">Cálculos estadísticos e interpolación listos.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menú Usuario Administrador */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center space-x-2 p-1.5 hover:bg-indigo-800 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md border border-indigo-400">
              AD
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">Admin</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-black text-slate-800">Administrador</p>
                <p className="text-[11px] text-slate-400 font-medium truncate">admin@empresa.pe</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl">
                  <User className="w-4 h-4 mr-2" /> Mi perfil
                </button>
                <button className="w-full flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl">
                  <SettingsIcon className="w-4 h-4 mr-2" /> Configuración
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full flex items-center px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}