import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const FlightHealth: React.FC = () => {
  const { flightState } = useEnvironmentStore();
  const isLinked = flightState.signal > 0;

  const systems = [
    { name: 'GPS', status: flightState.satellites > 6 ? 'LOCK' : 'WAIT' },
    { name: 'IMU', status: 'OK' },
    { name: 'COMPASS', status: 'OK' },
    { name: 'BATTERY', status: flightState.battery > 20 ? 'OK' : 'LOW' },
    { name: 'MOTOR SYSTEM', status: 'OK' },
    { name: 'TELEMETRY', status: isLinked ? 'LINKED' : 'OFFLINE' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-sm space-y-3">
      <div className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase">FLIGHT CONTROLLER</div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">
          <span>System</span>
          <span>Status</span>
        </div>
        
        {systems.map((sys) => (
          <div key={sys.name} className="flex justify-between items-center text-[10px] font-mono font-bold">
            <span className="text-slate-600">{sys.name}</span>
            <span className={`flex items-center space-x-1 ${
              sys.status === 'OK' || sys.status === 'LOCK' || sys.status === 'LINKED' 
                ? 'text-emerald-600' 
                : 'text-amber-500'
            }`}>
              {sys.status !== 'WAIT' && sys.status !== 'OFFLINE' && <span>✓</span>}
              <span>{sys.status}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
