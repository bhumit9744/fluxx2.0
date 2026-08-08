import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Download, FileText, Check } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { apiService } from '../../services/api';
import { Button } from '../ui/Button';

export const ReportGenerator: React.FC<{ onGenerated: () => void }> = ({ onGenerated }) => {
  const { isGeneratingReport, setIsGeneratingReport, fetchReport } = useEnvironmentStore();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps = [
    'Reading 50 observations',
    'Calculating statistics',
    'Analysing spatial distribution',
    'Analysing environmental trends',
    'Detecting anomalies',
    'Calculating risk',
    'Generating pros & concerns',
    'Generating recommendations',
    'Building report'
  ];

  const handleGenerate = async () => {
    setIsGeneratingReport(true);
    setIsCompleted(false);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 320));
    }

    try {
      await apiService.generateReport();
      await fetchReport();
      setIsGeneratingReport(false);
      setIsCompleted(true);
      onGenerated();
    } catch (e) {
      console.error(e);
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-6 panel space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-[rgba(244,122,36,0.1)] text-[var(--fluxx-orange)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[var(--fluxx-text)]">
              FLUXX AI Report Engine
            </h3>
            <p className="text-xs font-mono text-[var(--fluxx-muted)]">
              Synthesizes 50 Kharghar CSV observations into a 14-section compliance report & PDF
            </p>
          </div>
        </div>

        {!isGeneratingReport && (
          <Button onClick={handleGenerate} icon={Sparkles}>
            GENERATE AI REPORT
          </Button>
        )}
      </div>

      {/* Generation Pipeline Progress */}
      {isGeneratingReport && (
        <div className="p-4 rounded-2xl bg-[var(--fluxx-text)] text-white font-mono space-y-2.5 shadow-[var(--fluxx-shadow-glass)] border border-[var(--fluxx-border)]">
          <div className="text-[11px] font-bold text-[var(--fluxx-orange)] uppercase tracking-wider mb-2">
            FLUXX AI REPORT ENGINE
          </div>

          <div className="space-y-1.5">
            {steps.map((step, idx) => {
              const isDone = currentStep > idx + 1;
              const isCurrent = currentStep === idx + 1;

              return (
                <div
                  key={step}
                  className={`flex items-center space-x-2 text-xs transition-all ${
                    isDone
                      ? 'text-[var(--fluxx-success)] font-semibold'
                      : isCurrent
                      ? 'text-[var(--fluxx-coral)] font-bold scale-[1.01]'
                      : 'text-[var(--fluxx-muted)] opacity-50'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-[var(--fluxx-success)]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-[var(--fluxx-coral)] animate-spin" />
                  ) : (
                    <span className="w-3.5 h-3.5 text-[var(--fluxx-muted)] opacity-50">○</span>
                  )}
                  <span>{isDone ? '✓ ' : ''}{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion State */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-[rgba(63,166,107,0.1)] border border-[var(--fluxx-success)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--fluxx-success)]" />
            <span className="text-sm font-bold text-[var(--fluxx-success)] tracking-wide">
              INTELLIGENCE DOSSIER GENERATED
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
