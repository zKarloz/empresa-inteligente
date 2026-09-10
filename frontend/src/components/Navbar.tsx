import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  LogOut, 
  Settings as SettingsIcon,
  X,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'success' | 'alert' | 'info';
  title: string;
  desc: string;
}

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Navbar({ searchQuery = '', onSearchChange }: NavbarProps) {
  // Estado local sincronizado para garantizar la fluidez al tipear sin bloqueos
  const [term, setTerm] = useState(searchQuery);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setTerm(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClear = () => {
    setTerm('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const [notifications] = useState<NotificationItem[]>([
    { id: 1, type: 'alert', title: 'Tiempo elevado', desc: 'Atención supera el promedio estipulado.' },
    { id: 2, type: 'success', title: 'Cliente Registrado', desc: 'Se ha integrado un nuevo cliente al sistema.' },
    { id: 3, type: 'info', title: 'Modelo SciPy actualizado', desc: 'Cálculos estadísticos e interpolación listos.' },
  ]);

  const navigate = useNavigate();

  return (
    <>
      <header className="h-16 bg-indigo-900 border-b border-indigo-800 px-6 flex items-center justify-between flex-shrink-0 z-30 text-white shadow-md w-full">
        <div className="flex items-center gap-3 min-w-max">
          <span className="text-sm font-extrabold text-white uppercase tracking-wider whitespace-nowrap">
            Centro Inteligente
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Input de Búsqueda Desbloqueado */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-indigo-300 absolute left-3 top-2.5" />
            <input
              type="text"
              value={term}
              onChange={handleInputChange}
              placeholder="Buscar en el sistema..."
              className="pl-9 pr-8 py-1.5 text-xs bg-indigo-950/60 text-white placeholder-indigo-300 border border-indigo-700 rounded-xl w-60 focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-950 transition-all outline-none"
            />
            {term && (
              <button 
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-2 text-indigo-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Campana de Notificaciones */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-indigo-900 animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-black text-slate-800">Notificaciones</h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    {notifications.length} Nuevas
                  </span>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      {item.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                      {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                      {item.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold text-slate-700">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Menú Administrador */}
          <div className="relative">
            <button
              type="button"
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
                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}
                    className="w-full flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" /> Mi perfil
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/configuracion'); }}
                    className="w-full flex items-center px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" /> Configuración
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }} 
                    className="w-full flex items-center px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Mi Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Perfil del Administrador</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-lg shadow-indigo-200 border-2 border-indigo-400">
                AD
              </div>
              <h4 className="font-extrabold text-slate-800 text-base">Administrador General</h4>
              <p className="text-xs text-slate-400 font-medium">admin@empresa.pe</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-bold border border-indigo-100">
                Acceso Total / SciPy & NLTK
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Departamento:</span>
                <span className="font-bold text-slate-700">Ingeniería e IA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Servidor Activo:</span>
                <span className="font-bold text-slate-700">FastAPI / Railway</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Estado:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Conectado
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      )}

      {/* Modal Cerrar Sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-center text-slate-800">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg mb-1">Sesión Finalizada</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Has salido del panel de administración. Puedes volver a unirte presionando el botón.
            </p>
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              Volver a unirse
            </button>
          </div>
        </div>
      )}
    </>
  );
}