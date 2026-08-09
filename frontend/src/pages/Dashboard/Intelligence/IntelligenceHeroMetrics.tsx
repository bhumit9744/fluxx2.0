import React from 'react';
import { ShieldAlert, Activity, Wind, TrendingUp, Navigation } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const IntelligenceHeroMetrics: React.FC = () => {
  const { currentReading, eri } = useEnvironmentStore();

  const sensors = currentReading?.sensors || {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6,
    windDirection: 240.0
  };

  const eriScore = eri?.score ?? 64;
  const eriLevel = eri?.level ?? 'MODERATE';

  // Helper for wind compass direction from degrees
  const getWindDirectionLabel = (deg: number = 240) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) / 45)) % 8;
    return directions[index] || 'SW';
  };

  const windDir = getWindDirectionLabel(sensors.windDirection);

  const getRiskBadgeStyles = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]';
      case 'MODERATE':
      case 'ELEVATED':
        return 'bg-[#FFF0E5] text-[#F47A24] border-[#F47A24]/30';
      case 'NOMINAL':
      case 'OPTIMAL':
      default:
        return 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 select-none font-sans">
      
      {/* 1. Environmental Risk Index (ERI) */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 hover:border-[#F47A24]/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A] uppercase font-mono tracking-wider">
            Environmental Risk
          </span>
          <span className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-md border ${getRiskBadgeStyles(eriLevel)}`}>
            {eriLevel}
          </span>
        </div>
        <div className="my-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-[#2B211C] font-mono tracking-tight">
              {eriScore}
            </span>
            <span className="text-xs font-mono text-[#8C827A] font-bold">
              / 100
            </span>
          </div>
        </div>
        <div className="text-[11px] font-medium text-[#8C827A] flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F47A24]"></span>
          <span className="truncate">Primary: {eri?.primary_pollutant || 'PM2.5 Surge'}</span>
        </div>
      </div>

      {/* 2. PM2.5 */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 hover:border-[#F47A24]/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A] uppercase font-mono tracking-wider">
            PM2.5
          </span>
          <span className="flex items-center space-x-1 text-[11px] font-bold text-[#DC2626] font-mono bg-[#FEE2E2] px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 8.2%</span>
          </span>
        </div>
        <div className="my-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-[#2B211C] font-mono tracking-tight">
              {sensors.pm25.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#8C827A] font-bold">
              µg/m³
            </span>
          </div>
        </div>
        <div className="text-[11px] font-medium text-[#8C827A]">
          24h Peak: 63.1 µg/m³
        </div>
      </div>

      {/* 3. PM10 */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 hover:border-[#F47A24]/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A] uppercase font-mono tracking-wider">
            PM10
          </span>
          <span className="flex items-center space-x-1 text-[11px] font-bold text-[#F47A24] font-mono bg-[#FFF0E5] px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 4.1%</span>
          </span>
        </div>
        <div className="my-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-[#2B211C] font-mono tracking-tight">
              {sensors.pm10.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#8C827A] font-bold">
              µg/m³
            </span>
          </div>
        </div>
        <div className="text-[11px] font-medium text-[#8C827A]">
          24h Peak: 115.3 µg/m³
        </div>
      </div>

      {/* 4. Wind Velocity & Direction */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 hover:border-[#F47A24]/40 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A] uppercase font-mono tracking-wider">
            Wind
          </span>
          <span className="text-[11px] font-bold text-[#2B211C] font-mono bg-[#FAF3EA] px-2 py-0.5 rounded-md flex items-center space-x-1">
            <Navigation 
              className="w-3 h-3 text-[#F47A24]" 
              style={{ transform: `rotate(${sensors.windDirection || 240}deg)` }} 
            />
            <span>{windDir}</span>
          </span>
        </div>
        <div className="my-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-[#2B211C] font-mono tracking-tight">
              {sensors.windSpeed.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-[#8C827A] font-bold">
              m/s
            </span>
          </div>
        </div>
        <div className="text-[11px] font-medium text-[#8C827A]">
          {sensors.windSpeed < 2.0 ? 'Stagnant boundary layer' : 'Active atmospheric flow'}
        </div>
      </div>

    </div>
  );
};
