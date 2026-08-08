import React from 'react';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { ProcessChecklist } from './ProcessChecklist';
import { ProgressBar } from './ProgressBar';

interface ProcessStageProps {
  onRetry?: () => void;
}

export const ProcessStage: React.FC<ProcessStageProps> = ({ onRetry }) => {
  const { workflow, openUploadModal } = useEnvironmentStore();
  const { processing } = workflow;
  const progress = processing.progress;
  const isError = processing.status === 'error';

  return (
    <div className="rounded-[24px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-6 space-y-6 select-none font-sans max-w-2xl mx-auto transition-all animate-fade-in">
      
      {/* Stage Header */}
      <div className="flex items-center space-x-3.5 pb-4 border-b border-[#F9F3EA]">
        <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center shadow-xs">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold text-[#F47A24] uppercase tracking-wider">
              STAGE 1
            </span>
            <span className="text-[11px] font-bold text-[#8C827A]">·</span>
            <span className="text-[11px] font-bold text-[#8C827A]">DATA INGESTION</span>
          </div>
          <h2 className="text-[18px] font-extrabold text-[#2B211C] tracking-tight">
            Process & Validate Dataset
          </h2>
          <p className="text-[12px] text-[#8C827A] font-medium">
            Upload and prepare your survey observations
          </p>
        </div>
      </div>

      {/* Error View */}
      {isError ? (
        <div className="p-4 rounded-2xl bg-[#FDECEC] border border-[#F5C2C2] space-y-3">
          <div className="flex items-center space-x-2 text-[#E55353] font-bold text-[13px]">
            <AlertCircle className="w-4 h-4" />
            <span>Unable to validate the dataset</span>
          </div>
          <p className="text-[12px] text-[#6B5E55]">
            {processing.error || 'Invalid coordinates or missing telemetry columns detected.'}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={openUploadModal}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E55353]/30 text-[#E55353] text-xs font-bold hover:bg-[#FAF3EA] transition-colors cursor-pointer"
            >
              Review Dataset
            </button>
            <button
              onClick={onRetry}
              className="px-3.5 py-1.5 rounded-xl bg-[#E55353] text-white text-xs font-bold hover:bg-[#C93B3B] transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Step-by-Step Checklist */}
          <ProcessChecklist progress={progress} />

          {/* Progress Bar */}
          <div className="pt-2">
            <ProgressBar 
              progress={progress} 
              label={progress >= 100 ? 'Dataset prepared and verified' : 'Preparing dataset...'} 
            />
          </div>
        </>
      )}

    </div>
  );
};
