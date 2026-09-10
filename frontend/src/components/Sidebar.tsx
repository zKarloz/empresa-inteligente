import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Clock3,
  MessageSquare,
  BrainCircuit,
  BarChart3,
  Activity,
  TrendingUp,
  SlidersHorizontal,
  FileText,
  Settings,
  Sparkles,
  List,
  UserPlus,
  History,
  Inbox,
  Tags,
  ScanSearch,
  ChevronDown,
  ChevronRight,
} from "lucide-react";


function Sidebar() {
  const [grupoAbierto, setGrupoAbierto] =
    useState<string | null>(null);


  function alternarGrupo(nombre: string) {
    setGrupoAbierto((actual) =>
      actual === nombre
        ? null
        : nombre
    );
  }


  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-brand">
        <div className="sidebar-logo-box">
          <Sparkles size={25} />
        </div>

        <div className="sidebar-brand-text">
          <h2>
            CENTRO
            <br />
            INTELIGENTE
          </h2>

          <p>
            Atención · SciPy & NLTK
          </p>
        </div>
      </div>


      <nav className="sidebar-nav">

        {/* DASHBOARD */}

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
          onClick={() =>
            setGrupoAbierto(null)
          }
        >
          <LayoutDashboard
            className="sidebar-icon"
            size={18}
          />

          <span>Dashboard</span>
        </NavLink>


        {/* ============================= */}
        {/* GESTIÓN */}
        {/* ============================= */}

        <div className="sidebar-section-title">
          Gestión
        </div>


        {/* CLIENTES */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/clientes"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("clientes")
              }
            >
              <Users
                className="sidebar-icon icon-clients"
                size={18}
              />

              <span>Clientes</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo("clientes")
              }
            >
              {grupoAbierto === "clientes" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto === "clientes" && (
            <div className="sidebar-submenu">

              <span>
                <List size={13} />
                Lista de clientes
              </span>

              <span>
                <UserPlus size={13} />
                Nuevo cliente
              </span>

              <span>
                <History size={13} />
                Historial
              </span>

            </div>
          )}

        </div>


        {/* ATENCIÓN */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/atencion"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("atencion")
              }
            >
              <Clock3
                className="sidebar-icon icon-attention"
                size={18}
              />

              <span>Atención</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo("atencion")
              }
            >
              {grupoAbierto === "atencion" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto === "atencion" && (
            <div className="sidebar-submenu">

              <span>
                <Inbox size={13} />
                Solicitudes
              </span>

              <span>
                <MessageSquare size={13} />
                Comentarios
              </span>

              <span>
                <Clock3 size={13} />
                Tiempos de atención
              </span>

            </div>
          )}

        </div>


        {/* ============================= */}
        {/* INTELIGENCIA */}
        {/* ============================= */}

        <div className="sidebar-section-title">
          Inteligencia
        </div>


        {/* NLP */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/nlp"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("nlp")
              }
            >
              <BrainCircuit
                className="sidebar-icon icon-nlp"
                size={18}
              />

              <span>Inteligencia NLP</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo("nlp")
              }
            >
              {grupoAbierto === "nlp" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto === "nlp" && (
            <div className="sidebar-submenu">

              <span>
                <ScanSearch size={13} />
                Analizar comentario
              </span>

              <span>
                <BarChart3 size={13} />
                Palabras frecuentes
              </span>

              <span>
                <Tags size={13} />
                Categorías
              </span>

              <span>
                <BrainCircuit size={13} />
                Clasificación
              </span>

            </div>
          )}

        </div>


        {/* ============================= */}
        {/* CIENCIA DE DATOS */}
        {/* ============================= */}

        <div className="sidebar-section-title">
          Ciencia de datos
        </div>


        {/* SCIENTIFIC DATA */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/metricas"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("metricas")
              }
            >
              <BarChart3
                className="sidebar-icon icon-science"
                size={18}
              />

              <span>Scientific Data</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo("metricas")
              }
            >
              {grupoAbierto === "metricas" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto === "metricas" && (
            <div className="sidebar-submenu">

              <span>
                <Activity size={13} />
                Estadísticas
              </span>

              <span>
                <TrendingUp size={13} />
                Interpolación
              </span>

              <span>
                <SlidersHorizontal size={13} />
                Optimización
              </span>

            </div>
          )}

        </div>


        {/* ============================= */}
        {/* ADMINISTRACIÓN */}
        {/* ============================= */}

        <div className="sidebar-section-title">
          Administración
        </div>


        {/* REPORTES */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/reportes"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("reportes")
              }
            >
              <FileText
                className="sidebar-icon icon-reports"
                size={18}
              />

              <span>Reportes</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo("reportes")
              }
            >
              {grupoAbierto === "reportes" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto === "reportes" && (
            <div className="sidebar-submenu">

              <span>
                <Clock3 size={13} />
                Atención
              </span>

              <span>
                <BrainCircuit size={13} />
                NLP
              </span>

              <span>
                <BarChart3 size={13} />
                Estadísticas
              </span>

            </div>
          )}

        </div>


        {/* CONFIGURACIÓN */}

        <div className="sidebar-group">

          <div className="sidebar-main-row">

            <NavLink
              to="/configuracion"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                alternarGrupo("configuracion")
              }
            >
              <Settings
                className="sidebar-icon icon-settings"
                size={18}
              />

              <span>Configuración</span>
            </NavLink>


            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                alternarGrupo(
                  "configuracion"
                )
              }
            >
              {grupoAbierto ===
              "configuracion" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

          </div>


          {grupoAbierto ===
            "configuracion" && (

            <div className="sidebar-submenu">

              <span>
                <Users size={13} />
                Usuarios
              </span>

              <span>
                <Tags size={13} />
                Categorías
              </span>

              <span>
                <History size={13} />
                Auditoría
              </span>

            </div>
          )}

        </div>

      </nav>

    </aside>
  );
}


export default Sidebar;