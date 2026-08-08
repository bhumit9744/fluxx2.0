import React from 'react';
import { FileQuestion, ArrowRight, Sparkles } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ReportsEmptyState: React.FC = () => {
  const { setActiveSection } = useEnvironmentStore();

  return (
    <div className="flex flex-col items-center justify-center p-12 my-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-[#F3E6D7] text-center select-none max-w-lg mx-auto">
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center mb-4 shadow-xs">
        <FileQuestion className="w-8 h-8" />
      </div>

      {/* Heading */}
      <h3 className="text-lg font-black text-[#2B211C] tracking-tight font-sans">
        No reports found
      </h3>

      {/* Subtext */}
      <p className="text-xs text-[#8C827A] font-medium max-w-sm mt-1.5 leading-relaxed">
        Generate your first autonomous environmental intelligence report from the Analyse workflow.
      </p>

      {/* Action Button */}
      <button
        onClick={() => setActiveSection('environment')}
        className="mt-6 flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white text-xs font-extrabold shadow-[0_4px_16px_rgba(244,122,36,0.3)] transition-all cursor-pointer"
      >
        <span>Go to Analyse</span>
        <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
};
