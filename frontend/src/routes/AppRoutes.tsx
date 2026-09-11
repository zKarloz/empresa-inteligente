import {
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

function AppRoutes() {
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