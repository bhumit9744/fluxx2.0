import React from 'react';
import { Activity, Wind, Droplets, Thermometer, Cpu, Sparkles } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../stores/environmentStore';

export const SensorStrip: React.FC = () => {
  const { currentReading, selectedLayer, setSelectedLayer } = useEnvironmentStore();
  const s = currentReading.sensors;

  const sensors: Array<{
    id: LayerType;
    label: string;
    value: string;
    unit: string;
    status: string;
    icon: any;
    statusColor: string;
  }> = [
    {
      id: 'pm25',
      label: 'PM2.5 PARTICULATE',
      value: s.pm25.toFixed(1),
      unit: 'µg/m³',
      status: s.pm25 > 50 ? 'ELEVATED' : 'MODERATE',
      icon: Activity,
      statusColor: s.pm25 > 50 ? 'text-[#D95353] bg-[#D95353]/10 border-[#D95353]/30' : 'text-[#E6A23C] bg-[#E6A23C]/10 border-[#E6A23C]/30'
    },
    {
      id: 'pm10',
      label: 'PM10 COARSE',
      value: s.pm10.toFixed(1),
      unit: 'µg/m³',
      status: 'MODERATE',
      icon: Activity,
      statusColor: 'text-[#E6A23C] bg-[#E6A23C]/10 border-[#E6A23C]/30'
    },
    {
      id: 'co2',
      label: 'CO₂ CONCENTRATION',
      value: Math.round(s.co2).toString(),
      unit: 'ppm',
      status: 'AMBIENT',
      icon: Cpu,
      statusColor: 'text-[#3DD6C6] bg-[#0EA89A]/10 border-[#0EA89A]/30'
    },
    {
      id: 'temperature',
      label: 'TEMPERATURE',
      value: s.temperature.toFixed(1),
      unit: '°C',
      status: 'NORMAL',
      icon: Thermometer,
      statusColor: 'text-[#3DD6C6] bg-[#0EA89A]/10 border-[#0EA89A]/30'
    },
    {
      id: 'humidity',
      label: 'HUMIDITY',
      value: s.humidity.toFixed(1),
      unit: '%',
      status: 'HIGH',
      icon: Droplets,
      statusColor: 'text-[#3DD6C6] bg-[#0EA89A]/10 border-[#0EA89A]/30'
    },
    {
      id: 'windSpeed',
      label: 'WIND SPEED',
      value: s.windSpeed.toFixed(1),
      unit: 'm/s',
      status: s.windSpeed < 3.0 ? 'STAGNANT' : 'DISPERSIVE',
      icon: Wind,
      statusColor: s.windSpeed < 3.0 ? 'text-[#E6A23C] bg-[#E6A23C]/10 border-[#E6A23C]/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {sensors.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedLayer === item.id;

        return (
          <div
            key={item.id}
            onClick={() => setSelectedLayer(item.id)}
            className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-xl border ${
              isSelected
                ? 'bg-white/10 border-[#3DD6C6] shadow-lg shadow-[#0EA89A]/20 scale-[1.02]'
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-2">
              <span className="truncate">{item.label}</span>
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#3DD6C6]' : 'text-slate-400'}`} />
            </div>

            <div className="flex items-baseline space-x-1 font-mono">
              <span className="text-2xl font-bold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-slate-400">{item.unit}</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.statusColor}`}>
                {item.status}
              </span>
              {isSelected && (
                <span className="text-[9px] font-mono text-[#3DD6C6] font-bold">
                  ACTIVE LAYER
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
