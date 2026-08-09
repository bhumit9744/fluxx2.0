import React from 'react';
import { History, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const EnvironmentalEventsTimeline: React.FC = () => {
  const { allSamples, currentReading, seekSample } = useEnvironmentStore();

  const total = allSamples?.length || 50;

  const events = [
    {
      time: '09:10',
      sampleIdx: Math.floor(total * 0.25),
      title: 'Baseline stable',
      desc: 'Environmental parameters remained within expected diurnal baseline range.',
      type: 'optimal',
      badge: 'STABLE'
    },
    {
      time: '11:35',
      sampleIdx: Math.floor(total * 0.42),
      title: 'PM2.5 rising',
      desc: 'Particulate concentration increased +14% above baseline due to stagnant wind.',
      type: 'warning',
      badge: 'RISING'
    },
    {
      time: '12:40',
      sampleIdx: Math.floor(total * 0.52),
      title: 'Anomaly detected',
      desc: 'PM2.5 reached localized peak of 63.1 µg/m³ around Sector 4 cluster.',
      type: 'critical',
      badge: 'ANOMALY'
    },
    {
      time: '13:20',
      sampleIdx: Math.floor(total * 0.65),
      title: 'Risk elevated',
      desc: 'Environmental Risk Index crossed moderate-risk threshold (ERI 64/100).',
      type: 'elevated',
      badge: 'ERI 64'
    },
    {
      time: '14:30',
      sampleIdx: Math.floor(total * 0.80),
      title: 'Conditions improving',
      desc: 'Increased thermal advection began dispersing fine particulate accumulation.',
      type: 'optimal',
      badge: 'DISPERSING'
    }
  ];

  const currentSample = currentReading?.sample || 1;

  const getEventStyles = (type: string, isCurrent: boolean) => {
    if (isCurrent) return 'border-[#F47A24] bg-[#FFF9F2] shadow-xs ring-1 ring-[#F47A24]/30';
    switch (type) {
      case 'critical':
        return 'border-[#FCA5A5] bg-white hover:bg-[#FFF5F5]';
      case 'warning':
      case 'elevated':
        return 'border-[#F3E6D7] bg-white hover:bg-[#FFF9F2]';
      default:
        return 'border-[#F3E6D7] bg-white hover:bg-[#F9FAF9]';
    }
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]';
      case 'warning':
      case 'elevated':
        return 'bg-[#FFF0E5] text-[#F47A24] border-[#F47A24]/20';
      default:
        return 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]';
    }
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              Environmental Events Feed
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              Chronological Intelligence Sequence · Click any event to jump timeline
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-[#8C827A]">
          {events.length} Events Detected
        </span>
      </div>

      {/* Events Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {events.map((evt, idx) => {
          const isSelected = Math.abs(currentSample - evt.sampleIdx) <= Math.floor(total * 0.08);
          return (
            <div
              key={idx}
              onClick={() => seekSample(evt.sampleIdx)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${getEventStyles(evt.type, isSelected)}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-black text-[#2B211C]">
                    {evt.time}
                  </span>
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${getBadgeStyles(evt.type)}`}>
                    {evt.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#2B211C] mb-1">
                  {evt.title}
                </div>
                <p className="text-[11px] text-[#8C827A] leading-relaxed line-clamp-2">
                  {evt.desc}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#FAF3EA] flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
                <span>Sample #{evt.sampleIdx}</span>
                <span className="font-bold text-[#F47A24]">Seek →</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
