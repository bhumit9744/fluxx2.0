import React from 'react';
import { Target, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const MissionProgress: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  const progress = Math.round(flightState?.missionProgress || 64);

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 select-none font-sans flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            MISSION PROGRESS
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#F47A24] bg-[#FFF0E5] px-2 py-0.5 rounded-md">
          {progress}% COMPLETED
        </span>
      </div>

      {/* Mission Title & Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-bold text-[#2B211C]">
            Kharghar Sector 4 Environmental Survey
          </span>
          <span className="text-xs font-mono font-extrabold text-[#F47A24]">
            WP 6 / 9
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#FAF3EA] rounded-full overflow-hidden border border-[#F3E6D7]/60 p-0.5">
          <div
            className="h-full bg-linear-to-r from-[#F47A24] to-[#FF9F5A] rounded-full transition-all duration-300 shadow-2xs"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metric Breakdown Strip */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
        <div className="p-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <span className="text-[9.5px] text-[#8C827A] block">WAYPOINTS</span>
          <span className="font-bold text-[#2B211C]">6 of 9</span>
        </div>
        <div className="p-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <span className="text-[9.5px] text-[#8C827A] block">DISTANCE</span>
          <span className="font-bold text-[#2B211C]">4.2 km</span>
        </div>
        <div className="p-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <span className="text-[9.5px] text-[#8C827A] block">ETA REMAINING</span>
          <span className="font-bold text-[#16A34A]">06:21</span>
        </div>
      </div>

    </div>
  );
};
