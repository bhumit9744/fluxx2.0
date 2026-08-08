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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans select-none">
      {cards.map((card) => (
        <div 
          key={card.id}
          className="rounded-[20px] bg-white/85 backdrop-blur-md border border-[#F3E6D7] shadow-[0_4px_16px_rgba(70,40,20,0.03)] px-4 py-3 flex items-center justify-between transition-all hover:border-[#F47A24]/30"
        >
          <div>
            <div className="text-[10.5px] font-extrabold text-[#8C827A] tracking-wider uppercase">
              {card.label}
            </div>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-[19px] font-black text-[#2B211C] font-mono tracking-tight">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-[11px] font-bold text-[#8C827A]">
                  {card.unit}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            {card.isRisk ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10.5px] font-extrabold bg-[#FFF0E5] text-[#F47A24] border border-[#F47A24]/20 uppercase">
                {card.change}
              </span>
            ) : (
              <span className={`inline-flex items-center text-[11px] font-extrabold ${
                card.isUp ? 'text-[#D9534F]' : 'text-[#3FA66B]'
              }`}>
                {card.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
