import React from 'react';
import { PieChart, HelpCircle } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ContributingFactorsCard: React.FC = () => {
  const { eri } = useEnvironmentStore();

  const factors = [
    { label: 'PM2.5 surge', pct: eri?.factors?.pm25_surge ?? 61, color: 'from-[#F47A24] to-[#E06815]' },
    { label: 'PM10 elevation', pct: eri?.factors?.pm10_elevation ?? 22, color: 'from-[#F47A24]/80 to-[#F47A24]/60' },
    { label: 'Wind stagnation', pct: eri?.factors?.wind_stagnation ?? 11, color: 'from-[#8C827A] to-[#6E645D]' },
    { label: 'Humidity index', pct: eri?.factors?.humidity ?? 6, color: 'from-[#8C827A]/60 to-[#8C827A]/40' }
  ];

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              Contributing Factors
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              ERI Risk Attribution Weights
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-[#8C827A]">
          100% Total
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-3.5 pt-1">
        {factors.map((f, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#2B211C]">{f.label}</span>
              <span className="font-extrabold text-[#F47A24]">{f.pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#FAF3EA] overflow-hidden p-0.5 border border-[#F3E6D7]/60">
              <div
                className={`h-full rounded-full bg-linear-to-r ${f.color} transition-all duration-700 ease-out`}
                style={{ width: `${f.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Insight */}
      <div className="pt-2 border-t border-[#FAF3EA] text-[11px] text-[#8C827A] flex items-center justify-between font-mono">
        <span>Dominant Driver:</span>
        <span className="font-extrabold text-[#2B211C]">Fine Particulates (83% aggregate)</span>
      </div>

    </div>
  );
};
