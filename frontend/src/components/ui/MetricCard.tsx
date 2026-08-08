import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  isSelected?: boolean;
  onClick?: () => void;
  statusText?: string;
  statusColor?: string;
  icon?: any;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend,
  trendDirection = 'up',
  isSelected = false,
  onClick,
  statusText,
  statusColor = 'text-[#0EA89A] bg-[#DDF6F2]',
  icon: Icon
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-white shadow-lg border-[#0EA89A] ring-2 ring-[#0EA89A]/20 scale-[1.02]'
          : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono mb-2">
        <span className="font-semibold uppercase tracking-wider truncate">{label}</span>
        {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0EA89A]' : 'text-slate-400'}`} />}
      </div>

      <div className="flex items-baseline space-x-1.5 font-mono">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        <span className="text-xs text-slate-500 font-medium">{unit}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
        {statusText && (
          <span className={`px-2 py-0.5 rounded font-bold ${statusColor}`}>
            {statusText}
          </span>
        )}

        {trend && (
          <div className="flex items-center space-x-1 text-slate-500">
            {trendDirection === 'up' ? (
              <TrendingUp className="w-3 h-3 text-[#E6A23C]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#10B981]" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};
