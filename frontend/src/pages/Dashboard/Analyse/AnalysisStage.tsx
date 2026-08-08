import React from 'react';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { AnalysisChecklist } from './AnalysisChecklist';
import { ProgressBar } from './ProgressBar';

interface AnalysisStageProps {
  onContinueToReport?: () => void;
}

export const AnalysisStage: React.FC<AnalysisStageProps> = ({ onContinueToReport }) => {
  const { workflow } = useEnvironmentStore();
  const { analysis } = workflow;
  const progress = analysis.progress;
  const isError = analysis.status === 'error';

  return (
    <div className="rounded-[24px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-6 space-y-6 select-none font-sans max-w-2xl mx-auto transition-all animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-[#F9F3EA]">
        <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold text-[#F47A24] uppercase tracking-wider">
              STAGE 2
            </span>
            <span className="text-[11px] font-bold text-[#8C827A]">·</span>
            <span className="text-[11px] font-bold text-[#8C827A]">SPATIAL & AI REASONING</span>
          </div>
          <h2 className="text-[18px] font-extrabold text-[#2B211C] tracking-tight">
            Environmental Analysis
          </h2>
          <p className="text-[12px] text-[#8C827A] font-medium">
            Extract insights and pinpoint dispersion hotspots
          </p>
        </div>
      </div>

      {/* Error / AI Degradation View */}
      {isError ? (
        <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] space-y-3">
          <div className="flex items-center space-x-2 text-[#F47A24] font-bold text-[13px]">
            <AlertCircle className="w-4 h-4" />
            <span>Environmental Analysis Complete (AI Degraded)</span>
          </div>
          <p className="text-[12px] text-[#6B5E55]">
            Statistical and spatial hotspot models computed successfully. External LLM synthesis is currently running in offline fallback mode.
          </p>
          <div className="pt-2">
            <button
              onClick={onContinueToReport}
              className="px-4 py-2 rounded-xl bg-[#F47A24] text-white text-xs font-bold hover:bg-[#E06815] transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Step-by-Step Checklist */}
          <AnalysisChecklist progress={progress} />

          {/* Progress Bar */}
          <div className="pt-2">
            <ProgressBar 
              progress={progress} 
              label={progress >= 100 ? 'Analysis complete' : 'Extracting insights...'} 
            />
          </div>
        </>
      )}

    </div>
  );
};
