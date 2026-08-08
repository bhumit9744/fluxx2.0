import React from 'react';

interface FactorBreakdownProps {
  factors: {
    pm25_surge: number;
    pm10_elevation: number;
    wind_stagnation: number;
    humidity: number;
  };
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors }) => {
  const items = [
    { label: 'PM2.5 Surge', val: factors.pm25_surge || 61, color: '#D95353' },
    { label: 'PM10 Elevation', val: factors.pm10_elevation || 22, color: '#E6A23C' },
    { label: 'Wind Stagnation', val: factors.wind_stagnation || 11, color: '#0EA89A' },
    { label: 'Humidity Trapping', val: factors.humidity || 6, color: '#64748B' }
  ];

  return (
    <div className="space-y-3 font-mono">
      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
        WHY FLUXX FLAGGED THIS
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-bold text-slate-900">{item.val}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.val}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
