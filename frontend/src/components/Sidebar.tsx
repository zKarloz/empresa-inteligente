import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Centro Inteligente</h2>
        <p>Dashboard Empresarial</p>
      </div>

      <nav className="sidebar-nav">

        {/* INICIO */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Inicio
        </NavLink>

        {/* CLIENTES */}
        <div className="sidebar-group">
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Clientes
          </NavLink>

          <div className="sidebar-submenu">
            <span>Lista de clientes</span>
            <span>Nuevo cliente</span>
            <span>Historial</span>
          </div>
        </div>

        {/* ATENCIÓN */}
        <div className="sidebar-group">
          <NavLink
            to="/atencion"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Atención
          </NavLink>

          <div className="sidebar-submenu">
            <span>Solicitudes</span>
            <span>Comentarios</span>
            <span>Tiempos de atención</span>
          </div>
        </div>

        {/* NLP */}
        <div className="sidebar-group">
          <NavLink
            to="/nlp"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Inteligencia NLP
          </NavLink>

          <div className="sidebar-submenu">
            <span>Analizar comentario</span>
            <span>Palabras frecuentes</span>
            <span>Categorías</span>
            <span>Clasificación</span>
          </div>
        </div>

        {/* SCIENTIFIC DATA */}
        <div className="sidebar-group">
          <NavLink
            to="/metricas"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Scientific Data
          </NavLink>

          <div className="sidebar-submenu">
            <span>Estadísticas</span>
            <span>Interpolación</span>
            <span>Optimización</span>
          </div>
        </div>

        {/* REPORTES */}
        <div className="sidebar-group">
          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Reportes
          </NavLink>

          <div className="sidebar-submenu">
            <span>Atención</span>
            <span>NLP</span>
            <span>Estadísticas</span>
          </div>
        </div>

        {/* CONFIGURACIÓN */}
        <div className="sidebar-group">
          <NavLink
            to="/configuracion"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Configuración
          </NavLink>

          <div className="sidebar-submenu">
            <span>Usuarios</span>
            <span>Categorías</span>
            <span>Auditoría</span>
          </div>
        </div>

      </nav>
    </aside>
  );
}

export default Sidebar;