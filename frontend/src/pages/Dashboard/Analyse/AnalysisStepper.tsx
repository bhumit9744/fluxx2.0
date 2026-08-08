import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const AnalysisStepper: React.FC = () => {
  const { workflow, setWorkflowStep } = useEnvironmentStore();
  const { currentStep, processing, analysis, report } = workflow;

  const steps = [
    {
      id: 'process' as const,
      num: '1',
      title: 'PROCESS',
      subtitle: 'Upload & prepare data',
      status: processing.status === 'complete' ? 'complete' : processing.status === 'processing' ? 'processing' : 'pending',
    },
    {
      id: 'analysis' as const,
      num: '2',
      title: 'ANALYSIS',
      subtitle: 'Extract insights & hotspots',
      status: analysis.status === 'complete' ? 'complete' : analysis.status === 'processing' ? 'processing' : 'pending',
    },
    {
      id: 'report' as const,
      num: '3',
      title: 'REPORT',
      subtitle: 'Generate findings & PDF',
      status: report.status === 'complete' ? 'complete' : report.status === 'generating' ? 'processing' : 'pending',
    }
  ];

  return (
    <div className="w-full rounded-[22px] bg-white border border-[#F3E6D7] shadow-[0_10px_30px_rgba(70,40,20,0.04)] p-5 select-none font-sans">
      <div className="relative flex items-center justify-between max-w-3xl mx-auto">
        
        {/* Connecting Lines Background */}
        <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-[3px] bg-[#F5EDE1] -z-0"></div>

        {/* Dynamic Progress Line */}
        <div 
          className="absolute top-1/2 left-10 -translate-y-1/2 h-[3px] bg-gradient-to-r from-[#3FA66B] via-[#F47A24] to-[#F47A24] transition-all duration-700 -z-0"
          style={{
            width: currentStep === 'complete' || report.status === 'complete' 
              ? 'calc(100% - 80px)' 
              : analysis.status === 'complete' || report.status === 'generating'
              ? 'calc(100% - 80px)'
              : processing.status === 'complete' || analysis.status === 'processing'
              ? 'calc(50% - 40px)'
              : '0%'
          }}
        />

        {/* Step Pills */}
        {steps.map((s, idx) => {
          const isCurrent = currentStep === s.id;
          const isComplete = s.status === 'complete';
          const isProcessing = s.status === 'processing';

          return (
            <div 
              key={s.id} 
              className="relative z-10 flex flex-col items-center cursor-pointer group"
              onClick={() => {
                // Allow switching to viewed/completed steps
                if (isComplete || isProcessing || isCurrent) {
                  setWorkflowStep(s.id);
                }
              }}
            >
              {/* Step Circle Node */}
              <div 
                className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                  isComplete
                    ? 'bg-[#3FA66B] text-white shadow-[0_4px_14px_rgba(63,166,107,0.35)] ring-4 ring-[#EAF7EE]'
                    : isProcessing
                    ? 'bg-[#F47A24] text-white shadow-[0_4px_16px_rgba(244,122,36,0.4)] ring-4 ring-[#FFF0E5] animate-pulse'
                    : 'bg-white border-2 border-[#EADCCF] text-[#8C827A] group-hover:border-[#F47A24]/60'
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{s.num}</span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mt-2.5">
                <div className={`text-[13px] font-extrabold tracking-tight transition-colors ${
                  isCurrent || isProcessing
                    ? 'text-[#F47A24]'
                    : isComplete
                    ? 'text-[#2B211C]'
                    : 'text-[#8C827A]'
                }`}>
                  {s.title}
                </div>
                <div className="text-[11px] font-medium text-[#8C827A] hidden sm:block">
                  {s.subtitle}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
