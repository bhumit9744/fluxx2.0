import React from 'react';
import { MapPin, Clock, Database, Layers, Sparkles } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const AnalysisContext: React.FC = () => {
  const { dashboardData } = useEnvironmentStore();
  const ds = dashboardData?.dataset;

  return (
    <div className="rounded-[22px] bg-white border border-[#F3E6D7] shadow-[0_10px_30px_rgba(70,40,20,0.04)] p-5 select-none font-sans max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Context Details */}
        <div className="space-y-2">
          <div className="text-[11px] font-extrabold text-[#8C827A] uppercase tracking-wider">
            ANALYSIS CONTEXT
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-1.5 text-[#2B211C] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#F47A24] shrink-0" />
              <span>Kharghar</span>
            </div>

            <div className="flex items-center space-x-1.5 text-[#2B211C] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
              <span>{ds?.timeRange || '24 hours'}</span>
            </div>

            <div className="flex items-center space-x-1.5 text-[#2B211C] font-semibold">
              <Database className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
              <span>{ds?.observations || 300} Obs</span>
            </div>

            <div className="flex items-center space-x-1.5 text-[#2B211C] font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#3FA66B] shrink-0" />
              <span>6 Parameters</span>
            </div>
          </div>
        </div>

        {/* AI Engine Status Pill */}
        <div className="self-end sm:self-center shrink-0 flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]">
          <Sparkles className="w-4 h-4 text-[#F47A24]" />
          <div>
            <div className="text-[9.5px] font-bold text-[#8C827A] uppercase tracking-wider">AI ENGINE</div>
            <div className="flex items-center space-x-1.5 text-[11.5px] font-extrabold text-[#2B211C]">
              <span>Gemini</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B] animate-pulse"></span>
              <span className="text-[10px] text-[#3FA66B] font-bold">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
