import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Atencion from "../pages/Atencion";
import AnalisisNLP from "../pages/AnalisisNLP";
import Metricas from "../pages/Metricas";
import Reportes from "../pages/Reportes";
import Configuracion from "../pages/Configuracion";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/atencion" element={<Atencion />} />
        <Route path="/nlp" element={<AnalisisNLP />} />
        <Route path="/metricas" element={<Metricas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;