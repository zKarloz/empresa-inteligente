import { PageHeader } from '../components/PageHeader';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export function Reportes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes y Exportación"
        subtitle="Descarga informes consolidados en PDF o Excel sobre atenciones y métricas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Reporte de Clientes y Atenciones</h3>
              <p className="text-[11px] text-slate-400 font-medium">Histórico general de interacciones y tiempos</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" /> Exportar CSV / Excel
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Reporte de Análisis SciPy / NLP</h3>
              <p className="text-[11px] text-slate-400 font-medium">Resultados del procesamiento de datos y modelos</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" /> Exportar Informe de IA
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Los datos exportados incluyen marca de tiempo y firma de servidor.
      </div>
    </div>
  );
}