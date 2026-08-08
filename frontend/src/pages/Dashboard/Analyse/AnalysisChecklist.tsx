import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

interface AnalysisChecklistProps {
  progress: number;
}

export const AnalysisChecklist: React.FC<AnalysisChecklistProps> = ({ progress }) => {
  const { workflow } = useEnvironmentStore();
  const analysisResult = workflow.analysis.result;

  const items = [
    {
      id: 'patterns',
      title: 'Exploring data patterns',
      desc: progress >= 25 
        ? `Statistical distributions computed for 6 parameters` 
        : 'Analyzing trends and distributions',
      threshold: 25
    },
    {
      id: 'hotspots',
      title: 'Detecting hotspots',
      desc: progress >= 50 
        ? `Peak hotspot identified: Sector 4 (63.1 µg/m³ PM2.5)` 
        : 'Spatial analysis in progress',
      threshold: 50
    },
    {
      id: 'risk',
      title: 'Assessing risk levels',
      desc: progress >= 75 
        ? `Environmental Risk Index (ERI): ${analysisResult?.risk?.score || 64}/100 · ${analysisResult?.risk?.level || 'MODERATE'}` 
        : 'Calculating environmental risk',
      threshold: 75
    },
    {
      id: 'ai',
      title: 'Generating AI insights',
      desc: progress >= 100 
        ? 'Thermal inversion & microclimatic interpretation ready' 
        : 'Interpreting results',
      threshold: 100
    }
  ];

  return (
    <div className="space-y-3.5 select-none font-sans">
      {items.map((item) => {
        const isDone = progress >= item.threshold;
        const isCurrent = progress < item.threshold && (progress >= item.threshold - 25 || item.id === 'patterns');

        return (
          <div 
            key={item.id}
            className={`flex items-start space-x-3.5 p-3 rounded-2xl transition-all duration-300 ${
              isDone 
                ? 'bg-[#EAF7EE]/60 border border-[#C3E8CC]/50' 
                : isCurrent 
                ? 'bg-[#FFF0E5]/60 border border-[#F47A24]/30 shadow-xs' 
                : 'bg-[#FAF3EA]/40 border border-transparent opacity-60'
            }`}
          >
            {/* Status Icon */}
            <div className="pt-0.5 shrink-0">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#3FA66B]" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-[#F47A24] animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-[#C0B4A8]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`text-[13.5px] font-extrabold tracking-tight ${
                isDone ? 'text-[#2B211C]' : isCurrent ? 'text-[#F47A24]' : 'text-[#8C827A]'
              }`}>
                {item.title}
              </div>
              <div className="text-[11.5px] font-medium text-[#8C827A] mt-0.5">
                {item.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
