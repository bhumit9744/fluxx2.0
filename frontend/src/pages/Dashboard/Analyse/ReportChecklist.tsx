import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface ReportChecklistProps {
  progress: number;
}

export const ReportChecklist: React.FC<ReportChecklistProps> = ({ progress }) => {
  const items = [
    {
      id: 'findings',
      title: 'Compiling key findings',
      desc: progress >= 25 ? 'Executive metrics & risk factors compiled' : 'Summarizing results',
      threshold: 25
    },
    {
      id: 'vis',
      title: 'Creating visualizations',
      desc: progress >= 50 ? '3D Spatial heatmaps and trend graphs rendered' : 'Graphs, maps and charts',
      threshold: 50
    },
    {
      id: 'summary',
      title: 'Writing AI summary',
      desc: progress >= 75 ? 'Compliance audit narrative generated' : 'Generating narrative insights',
      threshold: 75
    },
    {
      id: 'pdf',
      title: 'Finalizing report',
      desc: progress >= 100 ? 'Audit document & download payload ready' : 'Preparing PDF',
      threshold: 100
    }
  ];

  return (
    <div className="space-y-3.5 select-none font-sans">
      {items.map((item) => {
        const isDone = progress >= item.threshold;
        const isCurrent = progress < item.threshold && (progress >= item.threshold - 25 || item.id === 'findings');

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
