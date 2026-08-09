import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const TimeIntelligenceBar: React.FC = () => {
  const { allSamples, currentReading, seekSample, replayStatus } = useEnvironmentStore();

  const total = allSamples?.length || 50;
  const currentSample = currentReading?.sample || 1;
  const progressPct = Math.min(100, Math.max(0, ((currentSample - 1) / (total - 1 || 1)) * 100));

  const timeString = currentReading?.timestamp
    ? currentReading.timestamp.substring(11, 16)
    : '12:40';

  const isAnomaly = currentReading?.sensors?.pm25 && currentReading.sensors.pm25 > 55;

  const phases = [
    { time: '06:00', label: 'NORMAL', desc: 'Baseline Stable', status: 'optimal', sampleIdx: 1 },
    { time: '09:00', label: 'RISING', desc: 'Inversion Accumulation', status: 'warning', sampleIdx: Math.floor(total * 0.25) },
    { time: '12:00', label: 'PEAK', desc: 'Anomaly Hotspot', status: 'critical', sampleIdx: Math.floor(total * 0.5) },
    { time: '15:00', label: 'DECLINING', desc: 'Thermal Dispersion', status: 'improving', sampleIdx: Math.floor(total * 0.75) },
    { time: '18:00', label: 'STABLE', desc: 'Evening Equilibrium', status: 'optimal', sampleIdx: total }
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    seekSample(val);
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 space-y-4 select-none font-sans">
      
      {/* Header with Active Time & Status Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            TIME INTELLIGENCE
          </span>
          <span className="text-xs text-[#8C827A]">·</span>
          <span className="text-xs font-mono font-bold text-[#F47A24] bg-[#FFF0E5] px-2 py-0.5 rounded-md">
            SAMPLE #{currentSample} of {total}
          </span>
        </div>

        {/* Current State Indicator */}
        <div className="flex items-center space-x-2">
          {isAnomaly ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] text-xs font-mono font-extrabold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>◉ {timeString} · PM2.5 ANOMALY DETECTED</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] text-xs font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>◉ {timeString} · ACTIVE TELEMETRY</span>
            </div>
          )}
        </div>
      </div>

      {/* Scrubbing Track & Range Input */}
      <div className="relative pt-2 pb-1">
        {/* Custom Range Slider */}
        <input
          type="range"
          min={1}
          max={total}
          value={currentSample}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-[#FAF3EA] rounded-lg appearance-none cursor-pointer accent-[#F47A24] transition-all"
        />

        {/* Background Visual Fill Bar */}
        <div 
          className="absolute top-4.5 left-0 h-2.5 bg-linear-to-r from-[#F47A24] to-[#E06815] rounded-lg pointer-events-none transition-all duration-75"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Phase Markers Grid */}
      <div className="grid grid-cols-5 gap-2 pt-1 border-t border-[#FAF3EA]">
        {phases.map((phase, i) => {
          const isPassed = currentSample >= phase.sampleIdx;
          return (
            <button
              key={i}
              onClick={() => seekSample(phase.sampleIdx)}
              className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                isPassed 
                  ? 'bg-[#FFF9F2] border-[#F47A24]/30' 
                  : 'bg-white/40 border-[#F3E6D7] opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#2B211C]">
                  {phase.time}
                </span>
                <span className={`text-[9px] font-extrabold font-mono px-1.5 py-0.2 rounded ${
                  phase.status === 'critical' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                  phase.status === 'warning' ? 'bg-[#FFF0E5] text-[#F47A24]' :
                  'bg-[#DCFCE7] text-[#16A34A]'
                }`}>
                  {phase.label}
                </span>
              </div>
              <div className="text-[10px] text-[#8C827A] truncate mt-0.5">
                {phase.desc}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
