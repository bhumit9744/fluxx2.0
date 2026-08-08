import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const LiveMapHeader: React.FC = () => {
  const { dashboardData, connected } = useEnvironmentStore();
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

      <div className="flex items-center space-x-2 self-start sm:self-center">
        <span className="w-2 h-2 rounded-full bg-[#3FA66B] animate-pulse"></span>
        <span className="text-[12px] font-bold text-[#3FA66B]">Data Connected</span>
      </div>
    </div>
  );
};
