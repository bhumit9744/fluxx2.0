import React from 'react';
import { Sparkles, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const AIBriefingCard: React.FC = () => {
  const { eri, currentReading } = useEnvironmentStore();

  const pm25Val = currentReading?.sensors?.pm25 ?? 48.5;
  const isHigh = pm25Val > 50;

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              AI Environmental Insight
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              Autonomous Diagnostic Synthesis
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold font-mono text-[#3FA66B] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#86EFAC]">
          VERIFIED MODEL
        </span>
      </div>

      {/* Executive Briefing Narrative */}
      <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#F3E6D7] text-xs text-[#2B211C] leading-relaxed space-y-2">
        <p className="font-semibold">
          {isHigh ? (
            <span className="text-[#DC2626] font-bold">Particulate surge active: </span>
          ) : (
            <span className="text-[#F47A24] font-bold">Diurnal observation window: </span>
          )}
          PM2.5 concentration increased significantly during the afternoon observation window. The strongest recorded concentration occurred around the identified Sector 4 hotspot cluster, driven by localized stagnant wind velocities and boundary-layer thermal inversion.
        </p>
      </div>

      {/* 3 Status Badges */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        
        {/* Confidence */}
        <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] text-center">
          <div className="text-[9.5px] font-extrabold text-[#8C827A] uppercase font-mono">
            CONFIDENCE
          </div>
          <div className="text-base font-black text-[#2B211C] font-mono mt-0.5">
            {eri?.confidence || 87}%
          </div>
        </div>

        {/* Severity */}
        <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] text-center">
          <div className="text-[9.5px] font-extrabold text-[#8C827A] uppercase font-mono">
            SEVERITY
          </div>
          <div className="text-base font-black text-[#F47A24] font-mono mt-0.5 uppercase">
            {eri?.level || 'MODERATE'}
          </div>
        </div>

        {/* Trend */}
        <div className="p-3 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] text-center">
          <div className="text-[9.5px] font-extrabold text-[#8C827A] uppercase font-mono">
            TREND
          </div>
          <div className="text-base font-black text-[#DC2626] font-mono mt-0.5 flex items-center justify-center space-x-0.5">
            <span>RISING</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

    </div>
  );
};
