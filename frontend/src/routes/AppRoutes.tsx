import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Clientes } from '../pages/Clientes';
import { Atencion } from '../pages/Atencion';
import { Comentarios } from '../pages/Comentarios';
import { AnalisisNLP } from '../pages/AnalisisNLP';
import { EstadisticasSciPy } from '../pages/EstadisticasSciPy';
import { Metricas } from '../pages/Metricas';
import { InterpolacionNumerica } from '../pages/InterpolacionNumerica';
import { Optimizacion } from '../pages/Optimizacion';
import { Reportes } from '../pages/Reportes';
import { Configuracion } from '../pages/Configuracion';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Funciona si entras a http://localhost:5173/ */}
        <Route index element={<Dashboard />} />
        
        {/* Funciona si entras a http://localhost:5173/dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="clientes" element={<Clientes />} />
        <Route path="atencion" element={<Atencion />} />
        <Route path="comentarios" element={<Comentarios />} />
        <Route path="analisis-nlp" element={<AnalisisNLP />} />
        <Route path="estadisticas-scipy" element={<EstadisticasSciPy />} />
        <Route path="metricas" element={<Metricas />} />
        <Route path="interpolacion" element={<InterpolacionNumerica />} />
        <Route path="optimizacion" element={<Optimizacion />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="configuracion" element={<Configuracion />} />
        
        {/* Si escriben cualquier otra ruta desconocida, redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;