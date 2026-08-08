import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const HeatmapLegend: React.FC = () => {
  const { heatmapData, selectedLayer } = useEnvironmentStore();

  const layerNames: Record<string, { label: string; unit: string }> = {
    pm25: { label: 'PM2.5', unit: 'µg/m³' },
    pm10: { label: 'PM10', unit: 'µg/m³' },
    co2: { label: 'CO₂', unit: 'ppm' },
    temperature: { label: 'Temperature', unit: '°C' },
    humidity: { label: 'Humidity', unit: '%' },
    windSpeed: { label: 'Wind Speed', unit: 'm/s' }
  };

  const info = layerNames[selectedLayer] || { label: 'PM2.5', unit: 'µg/m³' };
  const minVal = heatmapData?.stats?.min != null ? heatmapData.stats.min : 25.3;
  const maxVal = heatmapData?.stats?.max != null ? heatmapData.stats.max : 63.1;

  return (
    <div className="rounded-2xl bg-white/88 backdrop-blur-xl border border-[#F3E6D7] shadow-[0_6px_20px_rgba(70,40,20,0.08)] px-4 py-2.5 font-sans select-none space-y-1.5 min-w-[200px]">
      <div className="flex items-center justify-between text-[11px] font-extrabold text-[#2B211C]">
        <span>{info.label} Density</span>
        <span className="text-[10px] text-[#8C827A] font-mono">{info.unit}</span>
      </div>

      {/* Smooth Gradient Bar */}
      <div className="h-2 rounded-full w-full bg-gradient-to-r from-[#22C55E] via-[#EAB308] via-[#F97316] to-[#EF4444] shadow-2xs"></div>

      {/* Bounds Labels */}
      <div className="flex items-center justify-between text-[10px] font-bold text-[#8C827A] font-mono">
        <span>LOW ({minVal})</span>
        <span>HIGH ({maxVal})</span>
      </div>
    </div>
  );
};
