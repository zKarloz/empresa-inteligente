import { useEffect } from "react";
import {
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Atencion from "../pages/Atencion";
import AnalisisNLP from "../pages/AnalisisNLP";
import Metricas from "../pages/Metricas";
import Reportes from "../pages/Reportes";
import Configuracion from "../pages/Configuracion";
import LandingPage from "../pages/LandingPage";

const titulos: Record<string, string> = {
  "/": "Consultas",
  "/login": "Iniciar sesión",
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/atencion": "Atención",
  "/nlp": "Inteligencia NLP",
  "/metricas": "Métricas",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
};

function AppRoutes() {
  const { pathname } = useLocation();
  // Cambia la pestaña al navegar; no depende de parámetros ni del hash.
  useEffect(() => {
    const ruta = pathname.replace(/\/+$/, "") || "/";
    document.title = `Centro Inteligente | ${titulos[ruta] ?? "Consultas"}`;
  }, [pathname]);
  return (
    <Routes>

      {/* LANDING PÚBLICA */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* LOGIN PÚBLICO */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* RUTAS PRIVADAS */}
      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/atencion"
            element={<Atencion />}
          />

          <Route
            path="/nlp"
            element={<AnalisisNLP />}
          />

          <Route
            path="/metricas"
            element={<Metricas />}
          />

          <Route
            path="/reportes"
            element={<Reportes />}
          />

          <Route
            path="/configuracion"
            element={<Configuracion />}
          />

        </Route>

      </Route>

      {/* RUTA DESCONOCIDA */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;