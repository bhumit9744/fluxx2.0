import React from 'react';
import { RotateCcw, UploadCloud } from 'lucide-react';
import { useAnalysisWorkflow } from './hooks/useAnalysisWorkflow';
import { AnalysisStepper } from './AnalysisStepper';
import { ProcessStage } from './ProcessStage';
import { AnalysisStage } from './AnalysisStage';
import { ReportStage } from './ReportStage';
import { ReportReady } from './ReportReady';
import { AnalysisContext } from './AnalysisContext';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const AnalysePage: React.FC = () => {
  const { currentStep, restartPipeline, setWorkflowStep } = useAnalysisWorkflow();
  const { openUploadModal } = useEnvironmentStore();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans select-none animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-[#2B211C] tracking-tight">
            Analyse
          </h1>
          <p className="text-[13px] text-[#8C827A] font-medium">
            3-step automated pipeline: Process &middot; Analysis &middot; Report
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3">
          <select
            value={useEnvironmentStore().reportLanguage}
            onChange={(e) => useEnvironmentStore.getState().setReportLanguage(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-white border border-[#EADCCF] text-[#2B211C] font-extrabold text-[12.5px] outline-none shadow-2xs focus:border-[#F47A24] cursor-pointer"
          >
            <option value="en">English Report</option>
            <option value="hi">Hindi Report</option>
            <option value="mr">Marathi Report</option>
          </select>

          <button
            onClick={openUploadModal}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF3EA] border border-[#EADCCF] text-[#2B211C] font-extrabold text-[12.5px] tracking-tight flex items-center space-x-2 transition-all cursor-pointer shadow-2xs"
          >
            <UploadCloud className="w-4 h-4 text-[#F47A24]" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={restartPipeline}
            title="Re-run pipeline"
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FAF3EA] border border-[#EADCCF] text-[#8C827A] hover:text-[#2B211C] font-bold text-[12.5px] flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <AnalysisStepper />

      {/* Main Dynamic Stage Content */}
      <div className="py-2">
        {currentStep === 'process' && (
          <ProcessStage onRetry={restartPipeline} />
        )}

        {currentStep === 'analysis' && (
          <AnalysisStage onContinueToReport={() => setWorkflowStep('report')} />
        )}

        {currentStep === 'report' && (
          <ReportStage />
        )}

        {currentStep === 'complete' && (
          <ReportReady onRestart={restartPipeline} />
        )}
      </div>

      {/* Context Footer Card */}
      <AnalysisContext />

    </div>
  );
};
