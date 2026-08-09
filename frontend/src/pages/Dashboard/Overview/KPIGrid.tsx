import React from 'react';
import { 
  Wind, 
  Layers, 
  Cloud, 
  Thermometer, 
  Droplets, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const KPIGrid: React.FC = () => {
  const { dashboardData } = useEnvironmentStore();
  const metrics = dashboardData?.metrics;
  const risk = dashboardData?.risk;

  // Mini Sparkline Generator
  const renderSparkline = (color: string, trend: 'up' | 'down') => {
    const points = trend === 'up' 
      ? '0,22 8,20 16,23 24,18 32,19 40,14 48,16 56,10 64,12 72,6 80,4' 
      : '0,6 8,8 16,5 24,11 32,10 40,16 48,14 56,20 64,18 72,23 80,24';

    return (
      <div className="w-20 h-7 overflow-hidden shrink-0">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 80 28" fill="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  // Mini Circular Gauge for Risk Score
  const renderGauge = (score: number, color: string) => {
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="#F3E6D7"
            strokeWidth="3.5"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const cards = [
    {
      id: 'pm25',
      label: 'PM2.5',
      value: metrics?.pm25?.current ?? 48.5,
      unit: 'µg/m³',
      change: metrics?.pm25?.change ?? 8.2,
      trend: metrics?.pm25?.trend ?? 'up',
      icon: Wind,
      color: '#F47A24',
      bgColor: '#FFF0E5',
    },
    {
      id: 'pm10',
      label: 'PM10',
      value: metrics?.pm10?.current ?? 77.3,
      unit: 'µg/m³',
      change: metrics?.pm10?.change ?? 4.1,
      trend: metrics?.pm10?.trend ?? 'up',
      icon: Layers,
      color: '#E55353',
      bgColor: '#FDECEC',
    },
    {
      id: 'co2',
      label: 'CO2',
      value: metrics?.co2?.current ?? 559,
      unit: 'ppm',
      change: metrics?.co2?.change ?? 1.2,
      trend: metrics?.co2?.trend ?? 'down',
      icon: Cloud,
      color: '#3FA66B',
      bgColor: '#EAF7EE',
    },
    {
      id: 'temperature',
      label: 'Temperature',
      value: metrics?.temperature?.current ?? 28.1,
      unit: '°C',
      change: metrics?.temperature?.change ?? 0.3,
      trend: metrics?.temperature?.trend ?? 'down',
      icon: Thermometer,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: metrics?.humidity?.current ?? 80.1,
      unit: '%',
      change: metrics?.humidity?.change ?? 2.0,
      trend: metrics?.humidity?.trend ?? 'up',
      icon: Droplets,
      color: '#3B82F6',
      bgColor: '#EBF4FF',
    }
  ];

  const riskScore = risk?.score ?? 64;
  const riskLevel = risk?.level ?? 'MODERATE';
  const riskTrend = risk?.trend ?? 'up';
  const riskChange = risk?.change ?? 8.2;

  const getRiskColor = (lvl: string) => {
    switch (lvl) {
      case 'HIGH':
      case 'CRITICAL': return '#E55353';
      case 'MODERATE': return '#F47A24';
      default: return '#3FA66B';
    }
  };

  const getRiskBg = (lvl: string) => {
    switch (lvl) {
      case 'HIGH':
      case 'CRITICAL': return '#FDECEC';
      case 'MODERATE': return '#FFF0E5';
      default: return '#EAF7EE';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
      
      {/* 5 Pollutant / Climate Metric Cards */}
      {cards.map((c) => {
        const Icon = c.icon;
        const isUp = c.trend === 'up';

        return (
          <div
            key={c.id}
            className="p-4 rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] hover:shadow-[0_16px_40px_rgba(70,40,20,0.09)] transition-all duration-200 flex flex-col justify-between"
          >
            {/* Top row: Icon & Label */}
            <div className="flex items-center space-x-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.bgColor, color: c.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-bold text-[#6B5E55] tracking-tight truncate">
                {c.label}
              </span>
            </div>

            {/* Middle row: Big Value & Unit */}
            <div className="mt-3.5 flex items-baseline space-x-1.5">
              <span className="text-[26px] font-extrabold text-[#2B211C] tracking-tight leading-none">
                {c.value}
              </span>
              <span className="text-[11px] font-semibold text-[#8C827A]">
                {c.unit}
              </span>
            </div>

            {/* Bottom row: removed as requested */}
          </div>
        );
      })}

      {/* 6th Card: Environmental Risk */}
      <div className="p-4 rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] hover:shadow-[0_16px_40px_rgba(70,40,20,0.09)] transition-all duration-200 flex flex-col justify-between">
        
        {/* Top row: Icon & Label */}
        <div className="flex items-center space-x-2.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: getRiskBg(riskLevel), color: getRiskColor(riskLevel) }}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-bold text-[#6B5E55] tracking-tight truncate">
            Environmental Risk
          </span>
        </div>

        {/* Middle row: Big Value, Scale & Level Badge */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-[26px] font-extrabold text-[#2B211C] tracking-tight leading-none">
              {riskScore}
            </span>
            <span className="text-[11px] font-semibold text-[#8C827A]">
              / 100
            </span>
          </div>

          <span 
            className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase"
            style={{ backgroundColor: getRiskBg(riskLevel), color: getRiskColor(riskLevel) }}
          >
            {riskLevel}
          </span>
        </div>

        {/* Bottom row: removed as requested */}

      </div>

    </div>
  );
};
