import React from 'react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

export const ParameterSelector: React.FC = () => {
  const { selectedLayer, setSelectedLayer } = useEnvironmentStore();

  const options: Array<{ id: LayerType; label: string; unit: string }> = [
    { id: 'pm25', label: 'PM2.5', unit: 'µg/m³' },
    { id: 'pm10', label: 'PM10', unit: 'µg/m³' },
    { id: 'co2', label: 'CO₂', unit: 'ppm' },
    { id: 'temperature', label: 'Temperature', unit: '°C' },
    { id: 'humidity', label: 'Humidity', unit: '%' },
    { id: 'windSpeed', label: 'Wind', unit: 'm/s' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 bg-white/70 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md">
      {options.map((opt) => {
        const isSelected = selectedLayer === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setSelectedLayer(opt.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#0EA89A] text-white shadow-sm shadow-[#0EA89A]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`ml-1 text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
              {opt.unit}
            </span>
          </button>
        );
      })}
    </div>
  );
};
