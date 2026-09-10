import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeColor?: 'green' | 'red' | 'blue' | 'amber';
  icon: React.ElementType;
  subtext?: string;
}

export function StatCard(props: StatCardProps) {
  const { title, value, badge, badgeColor = 'green', icon: Icon, subtext } = props;

  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 bg-slate-100 text-indigo-600 rounded-xl">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{value}</span>
          {badge && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${colorClasses[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        {subtext && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtext}</p>}
      </div>
    </div>
  );
}