import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { ReportChecklist } from './ReportChecklist';
import { ProgressBar } from './ProgressBar';

export const ReportStage: React.FC = () => {
  const { workflow, setActiveSection } = useEnvironmentStore();
  const { report } = workflow;
  const progress = report.progress;
  const isComplete = report.status === 'complete';

  return (
    <div className="rounded-[24px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-6 space-y-6 select-none font-sans max-w-2xl mx-auto transition-all animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-[#F9F3EA]">
        <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold text-[#F47A24] uppercase tracking-wider">
              STAGE 3
            </span>
            <span className="text-[11px] font-bold text-[#8C827A]">·</span>
            <span className="text-[11px] font-bold text-[#8C827A]">DOCUMENT GENERATION</span>
          </div>
          <h2 className="text-[18px] font-extrabold text-[#2B211C] tracking-tight">
            Generate Comprehensive Report
          </h2>
          <p className="text-[12px] text-[#8C827A] font-medium">
            Compile findings, charts, and regulatory audit summary
          </p>
        </div>
      </div>

      {/* Checklist */}
      <ReportChecklist progress={progress} />

      {/* Progress Bar & Actions */}
      <div className="pt-2 space-y-4">
        <ProgressBar 
          progress={progress} 
          label={isComplete ? 'Report ready!' : 'Compiling report & visualizations...'} 
        />

        {isComplete && (
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={() => setActiveSection('reports')}
              className="px-5 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white font-extrabold text-[13px] tracking-tight flex items-center space-x-2 shadow-[0_4px_16px_rgba(244,122,36,0.3)] transition-all cursor-pointer"
            >
              <span>View Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
