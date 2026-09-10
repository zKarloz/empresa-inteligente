import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { title, subtitle, actions } = props;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}