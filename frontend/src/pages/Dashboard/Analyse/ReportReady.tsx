import React from 'react';
import { CheckCircle2, FileText, LayoutDashboard, RotateCcw, Sparkles } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

interface ReportReadyProps {
  onRestart: () => void;
}

export const ReportReady: React.FC<ReportReadyProps> = ({ onRestart }) => {
  const { setActiveSection, workflow, dashboardData, eri } = useEnvironmentStore();
  const analysisResult = workflow.analysis.result;
  const eriScore = analysisResult?.risk?.score || eri?.score || 64;
  const eriLevel = analysisResult?.risk?.level || eri?.level || 'MODERATE';
  const obsCount = dashboardData?.dataset?.observations || 300;

  return (
    <div className="rounded-[28px] bg-white border border-[#F3E6D7] shadow-[0_16px_40px_rgba(70,40,20,0.06)] p-8 select-none font-sans max-w-2xl mx-auto space-y-7 animate-fade-in">
      
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EAF7EE] text-[#3FA66B] shadow-[0_4px_20px_rgba(63,166,107,0.2)] mb-2">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-[24px] font-extrabold text-[#2B211C] tracking-tight">
          Report Ready
        </h2>
        <p className="text-[13.5px] text-[#8C827A] font-medium max-w-md mx-auto leading-relaxed">
          Your environmental intelligence report and spatial dispersion models have been successfully synthesized.
        </p>
      </div>

      {/* Snapshot Metric Grid */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF3EA]/60 border border-[#F3E6D7]">
        <div className="text-center">
          <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
            RISK INDEX
          </div>
          <div className="text-[18px] font-black text-[#F47A24] font-mono mt-0.5">
            {eriScore}/100
          </div>
          <div className="text-[10px] font-semibold text-[#8C827A]">
            {eriLevel}
          </div>
        </div>

        <div className="text-center border-x border-[#EADCCF]">
          <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
            HOTSPOTS
          </div>
          <div className="text-[18px] font-black text-[#2B211C] font-mono mt-0.5">
            1 Critical
          </div>
          <div className="text-[10px] font-semibold text-[#8C827A]">
            Sector 4
          </div>
        </div>

        <div className="text-center">
          <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
            PROCESSED
          </div>
          <div className="text-[18px] font-black text-[#2B211C] font-mono mt-0.5">
            {obsCount}
          </div>
          <div className="text-[10px] font-semibold text-[#3FA66B]">
            100% Quality
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setActiveSection('reports')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white font-extrabold text-[14px] tracking-tight flex items-center justify-center space-x-2.5 shadow-[0_6px_20px_rgba(244,122,36,0.35)] transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>View Full Report</span>
        </button>

        <button
          onClick={() => setActiveSection('overview')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF3EA] border-2 border-[#EADCCF] text-[#2B211C] font-extrabold text-[14px] tracking-tight flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 text-[#8C827A]" />
          <span>Go to Dashboard</span>
        </button>

        <button
          onClick={onRestart}
          title="Re-run workflow"
          className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF3EA] border border-[#EADCCF] text-[#8C827A] hover:text-[#2B211C] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
