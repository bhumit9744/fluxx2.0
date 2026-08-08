import React, { useRef } from 'react';
import { X, Download, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useEnvironmentStore, ReportItem } from '../../../stores/environmentStore';
import { ReportPreview } from '../../../components/reports/ReportPreview';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportItem | null;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, report }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2B211C]/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-[28px] bg-[#FAF6F0] border border-[#F3E6D7] shadow-[0_24px_64px_rgba(43,33,28,0.25)] overflow-hidden font-sans">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-[#F3E6D7] shrink-0 select-none z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-[#2B211C] tracking-tight">
                  {report.title}
                </h2>
                <span className="text-[11px] font-mono font-bold text-[#F47A24] bg-[#FFF0E5] px-2 py-0.5 rounded-md">
                  {report.id}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8C827A]">
                Archived Dossier · {report.location} · {report.observations || 300} Observations
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Download / Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F47A24] hover:bg-[#E06815] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center bg-[#EDE7DD]/50">
          <div className="w-full max-w-[940px] shadow-2xl rounded-2xl overflow-hidden bg-white">
            <ReportPreview />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-white/90 backdrop-blur-xl border-t border-[#F3E6D7] flex items-center justify-between text-xs text-[#8C827A] shrink-0 font-mono">
          <span>FLUXX Environmental Autonomous Intelligence Dossier</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-[#F3E6D7] hover:bg-[#FAF3EA] text-[#2B211C] font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
