import React from 'react';
import { TrendingUp, TrendingDown, Wind, Droplets, Thermometer, Flame, Cloud } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

interface MetricDef {
  id: LayerType;
  label: string;
  unit: string;
  icon: any;
  value: number;
  delta: number;
  status: 'NOMINAL' | 'ELEVATED' | 'STAGNANT';
}

export const TelemetryRail: React.FC = () => {
  const { currentReading, selectedLayer, setSelectedLayer } = useEnvironmentStore();

  // Only show the 4 core KPIs in the Overview
  const metrics: MetricDef[] = [
    { id: 'pm25', label: 'PM2.5', unit: 'µg/m³', icon: Flame, value: currentReading.sensors.pm25, delta: 8.2, status: currentReading.sensors.pm25 > 50 ? 'ELEVATED' : 'NOMINAL' },
    { id: 'pm10', label: 'PM10', unit: 'µg/m³', icon: Cloud, value: currentReading.sensors.pm10, delta: 4.1, status: currentReading.sensors.pm10 > 100 ? 'ELEVATED' : 'NOMINAL' },
    { id: 'co2', label: 'CO₂', unit: 'ppm', icon: Cloud, value: currentReading.sensors.co2, delta: -1.2, status: 'NOMINAL' },
    { id: 'temperature', label: 'TEMP', unit: '°C', icon: Thermometer, value: currentReading.sensors.temperature, delta: 0.8, status: 'NOMINAL' },
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const isSelected = selectedLayer === metric.id;
        const Icon = metric.icon;

        return (
          <button 
            key={metric.id}
            onClick={() => setSelectedLayer(metric.id)}
            className={`text-left panel p-4 transition-all flex flex-col justify-between space-y-3 ${
              isSelected ? 'border-[var(--fluxx-orange)] bg-[rgba(255,255,255,0.85)]' : 'hover:border-[var(--fluxx-border-strong)]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--fluxx-muted)] uppercase tracking-widest font-mono">
                {metric.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${metric.status === 'ELEVATED' ? 'text-[var(--fluxx-critical)]' : 'text-[var(--fluxx-success)]'}`} />
            </div>

            {/* Value */}
            <div className="flex flex-col">
              <div className="text-2xl font-black text-[var(--fluxx-text)] font-mono tracking-tight">
                {metric.value.toFixed(1)}
                <span className="text-xs text-[var(--fluxx-muted)] font-medium ml-1.5">{metric.unit}</span>
              </div>
            </div>

            {/* Delta & Sparkline Mock */}
            <div className="flex items-center justify-between w-full">
              <div className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold flex items-center space-x-1 ${
                metric.status === 'ELEVATED' 
                  ? 'text-[var(--fluxx-critical)] bg-[rgba(217,76,61,0.1)]' 
                  : 'text-[var(--fluxx-orange)] bg-[rgba(244,122,36,0.1)]'
              }`}>
                {metric.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(metric.delta)}%</span>
              </div>
              
              {/* Subtle sparkline representation */}
              <div className="w-12 h-4 relative overflow-hidden flex items-end justify-between px-0.5 opacity-50">
                {[4, 7, 5, 8, 12].map((h, i) => (
                  <div key={i} className="w-1.5 bg-[var(--fluxx-orange)] rounded-t-sm" style={{ height: `${(h / 12) * 100}%` }} />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
