import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ title = 'Sin información', description = 'No hay datos disponibles para mostrar en esta sección.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
    </div>
  );
}