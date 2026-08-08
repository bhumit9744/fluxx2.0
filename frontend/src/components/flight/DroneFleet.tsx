import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const DroneFleet: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  const fleet = [
    { id: 'VTOL-001', status: flightState.status, battery: flightState.battery },
    { id: 'VTOL-002', status: 'READY', battery: 96 },
    { id: 'VTOL-003', status: 'CHARGING', battery: 34 },
  ];

  return (
    <div className="bg-white dark:bg-[#0D131C] border border-[#DDE5E2] dark:border-slate-800 p-4 rounded-[14px] shadow-sm space-y-3 font-sans h-full transition-colors duration-300">
      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest font-mono uppercase mb-4">FLEET</div>
      
      <div className="space-y-2">
        {fleet.map((drone) => (
          <div 
            key={drone.id} 
            className={`p-3 flex flex-col space-y-2 border-b border-slate-100 dark:border-slate-800/50 last:border-none cursor-pointer transition-colors ${
              drone.id === flightState.droneId ? 'bg-slate-50 dark:bg-slate-800/50 rounded-lg border-transparent dark:border-transparent' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white font-mono">{drone.id}</div>
              <div className={`w-2 h-2 rounded-full ${
                drone.status === 'AIRBORNE' ? 'bg-[#0A9F91]' : (drone.status === 'READY' ? 'bg-amber-400' : 'bg-slate-300')
              }`} />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500">
              <div>{drone.status}</div>
              <div>{drone.battery.toFixed(0)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
