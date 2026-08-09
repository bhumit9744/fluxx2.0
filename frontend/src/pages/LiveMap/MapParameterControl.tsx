import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

export const MapParameterControl: React.FC = () => {
  const { selectedLayer, setSelectedLayer, fetchHeatmap } = useEnvironmentStore();
  const parameters: { id: LayerType; label: string; unit: string }[] = [
    { id: 'pm25', label: 'PM2.5', unit: 'µg/m³' },
    { id: 'pm10', label: 'PM10', unit: 'µg/m³' },
    { id: 'co2', label: 'CO₂', unit: 'ppm' },
    { id: 'temperature', label: 'TEMP', unit: '°C' },
    { id: 'humidity', label: 'HUMIDITY', unit: '%' },
    { id: 'windSpeed', label: 'WIND', unit: 'm/s' }
  ];

  const handleSelect = (id: LayerType) => {
    setSelectedLayer(id);
    fetchHeatmap(id);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/95 backdrop-blur-xl border border-slate-200/80 p-1.5 rounded-full shadow-lg font-sans">
      {parameters.map((param) => {
        const isSelected = selectedLayer === param.id;
        return (
          <button
            key={param.id}
            onClick={() => handleSelect(param.id)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide transition-all ${
              isSelected 
                ? 'bg-[#2B211C] text-white shadow-md' 
                : 'text-slate-500 hover:text-[#2B211C] hover:bg-slate-100'
            }`}
          >
            {param.label}
          </button>
        );
      })}
    </div>
  );
};
