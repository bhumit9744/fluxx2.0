import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

export const MapParameterControl: React.FC = () => {
  const { selectedLayer, setSelectedLayer, fetchHeatmap } = useEnvironmentStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parameters: { id: LayerType; label: string; unit: string }[] = [
    { id: 'pm25', label: 'PM2.5', unit: 'µg/m³' },
    { id: 'pm10', label: 'PM10', unit: 'µg/m³' },
    { id: 'co2', label: 'CO₂', unit: 'ppm' },
    { id: 'temperature', label: 'Temperature', unit: '°C' },
    { id: 'humidity', label: 'Humidity', unit: '%' },
    { id: 'windSpeed', label: 'Wind Speed', unit: 'm/s' }
  ];

  const currentParam = parameters.find((p) => p.id === selectedLayer) || parameters[0];

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: LayerType) => {
    setSelectedLayer(id);
    fetchHeatmap(id);
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans select-none" ref={dropdownRef}>
      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white/88 backdrop-blur-xl border border-[#F3E6D7] shadow-[0_6px_20px_rgba(70,40,20,0.08)] hover:bg-white text-[#2B211C] font-extrabold text-[13px] tracking-tight transition-all cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#F47A24]"></span>
        <span>{currentParam.label}</span>
        <span className="text-[11px] text-[#8C827A] font-semibold">({currentParam.unit})</span>
        <ChevronDown className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-2xl border border-[#F3E6D7] shadow-[0_12px_32px_rgba(70,40,20,0.12)] py-1.5 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-extrabold text-[#8C827A] uppercase tracking-wider border-b border-[#FAF3EA]">
            Select Heatmap Parameter
          </div>
          {parameters.map((param) => {
            const isSelected = selectedLayer === param.id;
            return (
              <button
                key={param.id}
                onClick={() => handleSelect(param.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-[12.5px] transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-[#FFF0E5] text-[#F47A24] font-bold' 
                    : 'text-[#2B211C] font-medium hover:bg-[#FAF3EA]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{param.label}</span>
                  <span className="text-[10.5px] text-[#8C827A]">({param.unit})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#F47A24]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
