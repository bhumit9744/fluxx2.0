import React from 'react';
import { Bell, UploadCloud } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const DashboardHeader: React.FC = () => {
  const { connected, openUploadModal, availableDatasets, activeDataset, switchActiveDataset } = useEnvironmentStore();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
      
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#2B211C] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-[#8C827A] font-medium mt-0.5">
          Real-time overview of environmental conditions
        </p>
      </div>

      {/* Action Buttons & Status */}
      <div className="flex items-center space-x-3 self-end sm:self-center">
        
        {/* Data Connected Badge */}
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white border border-[#F3E6D7] shadow-[0_2px_10px_rgba(70,40,20,0.03)] text-[12.5px] font-semibold text-[#2B211C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3FA66B] shadow-[0_0_8px_rgba(63,166,107,0.6)] animate-pulse"></span>
          <span>Data Connected</span>
        </div>

        {/* Notifications Icon Button */}
        <button 
          title="Notifications"
          className="relative p-2.5 rounded-2xl bg-white border border-[#F3E6D7] hover:bg-[#FAF3EA] text-[#6B5E55] hover:text-[#2B211C] transition-all shadow-[0_2px_10px_rgba(70,40,20,0.03)] cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F47A24]"></span>
        </button>

        {/* Dataset Selector */}
        <div className="relative">
          <select
            value={activeDataset}
            onChange={(e) => switchActiveDataset(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-[#F3E6D7] hover:border-[#F47A24] text-[12.5px] font-semibold text-[#2B211C] shadow-[0_2px_10px_rgba(70,40,20,0.03)] focus:outline-hidden focus:border-[#F47A24] cursor-pointer transition-all truncate max-w-[200px] sm:max-w-[250px]"
          >
            {availableDatasets.length === 0 && (
              <option value={activeDataset}>{activeDataset}</option>
            )}
            {availableDatasets.map((ds) => (
              <option key={ds} value={ds}>
                {ds}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8C827A]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Upload CSV Primary Action Button */}
        <button
          onClick={openUploadModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white font-semibold text-[13px] tracking-tight shadow-[0_4px_16px_rgba(244,122,36,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload CSV</span>
        </button>

      </div>

    </div>
  );
};
