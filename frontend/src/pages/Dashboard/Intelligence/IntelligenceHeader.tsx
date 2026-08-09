import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, Activity } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { ParametersModal } from './ParametersModal';

export const IntelligenceHeader: React.FC = () => {
  const { dashboardData, allSamples } = useEnvironmentStore();
  const [isParamsOpen, setIsParamsOpen] = useState(false);

  const datasetName = dashboardData?.dataset?.name?.replace('.csv', '') || 'Kharghar';
  const obsCount = allSamples?.length || dashboardData?.dataset?.observations || 300;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none font-sans">
        
        {/* Left: Title & Subtitle */}
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-[#2B211C] tracking-tight">
              Intelligence
            </h1>
            <span className="text-[10px] font-extrabold text-[#F47A24] uppercase tracking-wider font-mono bg-[#FFF0E5] px-2 py-0.5 rounded-md border border-[#F47A24]/20">
              AI DIAGNOSTIC CONSOLE
            </span>
          </div>
          <p className="text-xs text-[#8C827A] font-medium mt-0.5">
            Environmental intelligence & insights
          </p>
        </div>

        {/* Right: Dataset Badge & Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Dataset Live Tag */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/80 border border-[#F3E6D7] shadow-2xs">
            <span className="text-xs font-bold text-[#2B211C] font-mono uppercase tracking-tight">
              DATASET: {datasetName}
            </span>
            <span className="text-xs text-[#8C827A]">·</span>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3FA66B] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse"></span>
              <span>LIVE</span>
            </div>
            <span className="text-xs text-[#8C827A]">·</span>
            <span className="text-xs font-mono text-[#8C827A] font-semibold">
              {obsCount} obs
            </span>
          </div>

          {/* View All Parameters Button */}
          <button
            onClick={() => setIsParamsOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF0E5] border border-[#F3E6D7] hover:border-[#F47A24]/50 text-xs font-bold text-[#2B211C] transition-all shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F47A24]" />
            <span>View all parameters</span>
          </button>

        </div>

      </div>

      <ParametersModal isOpen={isParamsOpen} onClose={() => setIsParamsOpen(false)} />
    </>
  );
};
