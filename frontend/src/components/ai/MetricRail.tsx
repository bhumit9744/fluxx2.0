import React from 'react';

interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
}

interface MetricRailProps {
  metrics: MetricItem[];
}

export const MetricRail: React.FC<MetricRailProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100">
      {metrics.map((m, idx) => (
        <div 
          key={idx} 
          className="bg-white/80 rounded-xl p-2 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
        >
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {m.label}
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-xs font-bold text-slate-800 font-mono">
              {m.value}
            </span>
            {m.unit && (
              <span className="text-[9px] text-slate-400">
                {m.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
