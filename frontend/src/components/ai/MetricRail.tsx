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
    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#F3E6D7]/80">
      {metrics.map((m, idx) => (
        <div 
          key={idx} 
          className="bg-[#FAF3EA]/90 rounded-xl p-2 border border-[#F3E6D7] shadow-2xs flex flex-col justify-between"
        >
          <span className="text-[9.5px] font-mono font-bold text-[#8C827A] uppercase tracking-wider truncate">
            {m.label}
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-xs font-black text-[#2B211C] font-mono">
              {m.value}
            </span>
            {m.unit && (
              <span className="text-[9.5px] text-[#8C827A] font-mono">
                {m.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
