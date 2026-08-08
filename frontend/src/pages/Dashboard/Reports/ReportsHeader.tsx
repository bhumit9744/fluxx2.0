import React from 'react';
import { FileText } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ReportsHeader: React.FC = () => {
  const { reportsList } = useEnvironmentStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 select-none">
      <div>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F47A24]/10 text-[#F47A24] flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black text-[#2B211C] tracking-tight font-sans">
            Reports
          </h1>
        </div>
        <p className="text-[13px] text-[#8C827A] font-medium mt-1">
          Environmental reports & survey history · {reportsList.length} archived dossiers
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-[#F3E6D7] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse"></span>
          <span className="text-[11.5px] font-bold text-[#2B211C] font-mono tracking-tight">
            Data Connected
          </span>
        </div>
      </div>
    </div>
  );
};
