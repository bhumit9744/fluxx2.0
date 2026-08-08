import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

const stages = ['TAKEOFF', 'TRANSIT', 'SURVEY', 'HOTSPOT', 'RTL'];

export const MissionTimeline: React.FC = () => {
  const { flightState } = useEnvironmentStore();
  
  // Map internal stages to new UI labels
  let activeLabel: string = flightState.missionStage;
  if (activeLabel === 'SENSOR SWEEP') activeLabel = 'SURVEY';
  if (activeLabel === 'HOTSPOT SURVEY') activeLabel = 'HOTSPOT';
  if (activeLabel === 'RETURN' || activeLabel === 'LAND') activeLabel = 'RTL';

  const currentIdx = stages.indexOf(activeLabel);

  return (
    <div className="bg-white dark:bg-[#0D131C] border border-[#DDE5E2] dark:border-slate-800 px-6 py-4 rounded-[14px] shadow-sm flex items-center w-full overflow-x-auto relative transition-colors duration-300">
      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 z-0" />
      <div 
        className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#0A9F91] z-0 transition-all duration-1000 ease-out" 
        style={{ width: `calc(${flightState.missionProgress}% - 48px)` }}
      />
      
      <div className="flex justify-between w-full relative z-10">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          
          return (
            <div key={stage} className="flex flex-col items-center min-w-[80px]">
              <div className={`w-3 h-3 rounded-full border-2 mb-2 bg-white dark:bg-[#0D131C] ${
                isCompleted ? 'border-[#0A9F91] bg-[#0A9F91] dark:bg-[#0A9F91]' : (isCurrent ? 'border-[#0A9F91]' : 'border-slate-200 dark:border-slate-700')
              }`} />
              <div className={`text-[9px] font-bold font-mono uppercase tracking-widest ${
                isCompleted ? 'text-slate-900 dark:text-white' : (isCurrent ? 'text-[#0A9F91]' : 'text-slate-400 dark:text-slate-500')
              }`}>
                {stage}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
