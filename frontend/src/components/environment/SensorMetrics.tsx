import React from 'react';
import { Activity, Wind, Droplets, Thermometer, Cpu } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';
import { MetricCard } from '../ui/MetricCard';

export const SensorMetrics: React.FC = () => {
  const { currentReading, selectedLayer, setSelectedLayer } = useEnvironmentStore();
  const s = currentReading.sensors;

  const metrics: Array<{
    id: LayerType;
    label: string;
    value: string | number;
    unit: string;
    trend: string;
    trendDirection: 'up' | 'down';
    statusText: string;
    statusColor: string;
    icon: any;
  }> = [
    {
      id: 'pm25',
      label: 'PM2.5 Particulate',
      value: s.pm25.toFixed(1),
      unit: 'µg/m³',
      trend: '↑ 8.2%',
      trendDirection: 'up',
      statusText: s.pm25 > 50 ? 'ELEVATED' : 'MODERATE',
      statusColor: s.pm25 > 50 ? 'text-[#D95353] bg-[#FEE2E2]' : 'text-[#E6A23C] bg-[#FEF3C7]',
      icon: Activity
    },
    {
      id: 'pm10',
      label: 'PM10 Coarse',
      value: s.pm10.toFixed(1),
      unit: 'µg/m³',
      trend: '↑ 4.1%',
      trendDirection: 'up',
      statusText: 'MODERATE',
      statusColor: 'text-[#E6A23C] bg-[#FEF3C7]',
      icon: Activity
    },
    {
      id: 'co2',
      label: 'Carbon Dioxide',
      value: Math.round(s.co2),
      unit: 'ppm',
      trend: '↓ 1.2%',
      trendDirection: 'down',
      statusText: 'AMBIENT',
      statusColor: 'text-[#0EA89A] bg-[#DDF6F2]',
      icon: Cpu
    },
    {
      id: 'temperature',
      label: 'Temperature',
      value: s.temperature.toFixed(1),
      unit: '°C',
      trend: '→ 0.0%',
      trendDirection: 'down',
      statusText: 'SURFACE',
      statusColor: 'text-[#0EA89A] bg-[#DDF6F2]',
      icon: Thermometer
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: s.humidity.toFixed(1),
      unit: '%',
      trend: '↑ 2.3%',
      trendDirection: 'up',
      statusText: 'HIGH',
      statusColor: 'text-[#0EA89A] bg-[#DDF6F2]',
      icon: Droplets
    },
    {
      id: 'windSpeed',
      label: 'Wind Velocity',
      value: s.windSpeed.toFixed(1),
      unit: 'm/s',
      trend: s.windSpeed < 3.0 ? 'STAGNANT' : 'DISPERSIVE',
      trendDirection: s.windSpeed < 3.0 ? 'down' : 'up',
      statusText: s.windSpeed < 3.0 ? 'STAGNANT' : 'MIXING',
      statusColor: s.windSpeed < 3.0 ? 'text-[#E6A23C] bg-[#FEF3C7]' : 'text-[#10B981] bg-[#D1FAE5]',
      icon: Wind
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <MetricCard
          key={m.id}
          label={m.label}
          value={m.value}
          unit={m.unit}
          trend={m.trend}
          trendDirection={m.trendDirection}
          statusText={m.statusText}
          statusColor={m.statusColor}
          icon={m.icon}
          isSelected={selectedLayer === m.id}
          onClick={() => setSelectedLayer(m.id)}
        />
      ))}
    </div>
  );
};
