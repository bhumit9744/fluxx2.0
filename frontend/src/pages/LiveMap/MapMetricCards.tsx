import React from 'react';
import { TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const MapMetricCards: React.FC = () => {
  const { dashboardData, eri } = useEnvironmentStore();
  const m = dashboardData?.metrics;
  const eriScore = eri?.score || 64;
  const eriLevel = eri?.level || 'MODERATE';

  const cards = [
    {
      id: 'pm25',
      label: 'PM2.5',
      value: m?.pm25?.current != null ? `${m.pm25.current.toFixed(1)}` : '48.5',
      unit: 'µg/m³',
      change: m?.pm25 ? `${m.pm25.trend === 'up' ? '↑' : '↓'} ${Math.abs(m.pm25.change)}%` : '↑ 8.2%',
      isUp: (m?.pm25?.trend ?? 'up') === 'up',
      accent: '#F47A24'
    },
    {
      id: 'pm10',
      label: 'PM10',
      value: m?.pm10?.current != null ? `${m.pm10.current.toFixed(1)}` : '77.3',
      unit: 'µg/m³',
      change: m?.pm10 ? `${m.pm10.trend === 'up' ? '↑' : '↓'} ${Math.abs(m.pm10.change)}%` : '↑ 4.1%',
      isUp: (m?.pm10?.trend ?? 'up') === 'up',
      accent: '#E65100'
    },
    {
      id: 'co2',
      label: 'CO₂',
      value: m?.co2?.current != null ? `${Math.round(m.co2.current)}` : '559',
      unit: 'ppm',
      change: m?.co2 ? `${m.co2.trend === 'up' ? '↑' : '↓'} ${Math.abs(m.co2.change)}%` : '↓ 1.2%',
      isUp: (m?.co2?.trend ?? 'down') === 'up',
      accent: '#8B5CF6'
    },
    {
      id: 'risk',
      label: 'ENVIRONMENTAL RISK',
      value: `${eriScore} / 100`,
      unit: '',
      change: eriLevel,
      isRisk: true,
      accent: eriScore > 75 ? '#D9534F' : '#F47A24'
    }
  ];

  return (
    <div className="flex items-center space-x-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-[#F3E6D7] shadow-sm w-fit">
      {cards.filter(c => !c.isRisk).map((card) => (
        <div key={card.id} className="flex items-baseline space-x-1.5">
          <span className="text-[11px] font-extrabold text-[#8C827A] uppercase">{card.label}</span>
          <span className="text-[13px] font-black text-[#2B211C]">{card.value}</span>
          <span className="text-[10px] font-bold text-[#8C827A] uppercase">AVG</span>
        </div>
      ))}
    </div>
  );
};
