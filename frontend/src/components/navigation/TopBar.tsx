import React from 'react';
import { Search, Bell, User, UploadCloud } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const TopBar: React.FC = () => {
  const { activeSection, openUploadModal } = useEnvironmentStore();

  if (activeSection === 'overview') {
    return null; // OverviewView has its own dedicated DashboardHeader matching the mockup
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'environment': return 'Analyse & Spatial Data Lab';
      case 'reports': return 'Compliance Audit & Reports';
      case 'flight-ops': return '3D Earth & VTOL Operations';
      case 'intelligence': return 'Predictive Intelligence & Trends';
      default: return 'Environmental Intelligence';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#F3E6D7] flex items-center justify-between px-6 z-10 shrink-0 font-sans shadow-[0_2px_10px_rgba(70,40,20,0.02)]">
      
      {/* Left: Section Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-[17px] font-extrabold text-[#2B211C] tracking-tight">
          {getSectionTitle()}
        </h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-md mx-6">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#8C827A]" />
          <input 
            type="text" 
            placeholder="Search sensor nodes, sectors, anomalies..." 
            className="w-full pl-10 pr-4 py-2 bg-[#FAF3EA] border border-[#F3E6D7] rounded-full text-xs font-medium text-[#2B211C] placeholder-[#8C827A] focus:outline-hidden focus:border-[#F47A24] transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        
        {/* Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EAF7EE] text-[11px] font-bold text-[#3FA66B]">
          <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse" />
          <span>Live Data Active</span>
        </div>

        {/* Upload Action */}
        <button
          onClick={openUploadModal}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#F47A24] hover:bg-[#E06815] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload CSV</span>
        </button>

      </div>
    </header>
  );
};
