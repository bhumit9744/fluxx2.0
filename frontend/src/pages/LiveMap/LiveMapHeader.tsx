import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const LiveMapHeader: React.FC = () => {
  const { dashboardData, connected, availableDatasets, activeDataset, switchActiveDataset } = useEnvironmentStore();
  const ds = dashboardData?.dataset;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 font-sans select-none">
      <div>
        <h1 className="text-[22px] font-extrabold text-[#2B211C] tracking-tight">
          Live Map
        </h1>
        <p className="text-[12px] text-[#8C827A] font-medium">
          {ds?.name ? ds.name.replace('.csv', '') : 'Kharghar Environmental Survey'} &middot; {ds?.observations || 300} observations &middot; {ds?.timeRange || '24 hour dataset'}
        </p>
      </div>

      <div className="flex items-center space-x-3 self-start sm:self-center">
        {/* Dataset Selector */}
        <div className="relative">
          <select
            value={activeDataset}
            onChange={(e) => switchActiveDataset(e.target.value)}
            className="appearance-none pl-4 pr-10 py-1.5 rounded-full bg-white border border-[#F3E6D7] hover:border-[#F47A24] text-[11px] font-semibold text-[#2B211C] shadow-[0_2px_10px_rgba(70,40,20,0.03)] focus:outline-hidden focus:border-[#F47A24] cursor-pointer transition-all truncate max-w-[200px]"
          >
            {availableDatasets.length === 0 && (
              <option value={activeDataset}>{activeDataset}</option>
            )}
            {availableDatasets.map((dataset) => (
              <option key={dataset} value={dataset}>
                {dataset}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8C827A]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Data Connected Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#F3E6D7] shadow-[0_2px_10px_rgba(70,40,20,0.03)] text-[11px] font-bold text-[#3FA66B]">
          <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse"></span>
          <span>Data Connected</span>
        </div>
      </div>
    </div>
  );
};
