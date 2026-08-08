import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const FlightTelemetry: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  return (
    <div className="flex flex-wrap gap-4">
      {/* Link Status */}
      <div className="bg-white dark:bg-[#0D131C] border border-[#DDE5E2] dark:border-slate-800 px-5 py-3 rounded-[14px] shadow-sm flex items-center space-x-3 transition-colors duration-300">
        <div className="w-8 h-8 rounded-full bg-[#0A9F91]/10 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A9F91] animate-pulse" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-[#0A9F91] tracking-widest font-mono">LINKED</div>
          <div className="text-sm font-black text-slate-800 dark:text-white">{flightState.droneId}</div>
        </div>
      </div>

      {/* Glass Cards -> Solid Cards */}
      {[
        { label: 'ALTITUDE', val: `${flightState.altitude.toFixed(1)} m`, sub: '↑ 0.8 m/s' },
        { label: 'AIRSPEED', val: `${flightState.airspeed.toFixed(1)} m/s`, sub: 'AUTO' },
        { label: 'BATTERY', val: `${flightState.battery.toFixed(0)}%`, sub: '~14 min' },
        { label: 'LINK', val: `${flightState.signal}%`, sub: 'GOOD' },
        { label: 'GPS', val: `${flightState.satellites} SAT`, sub: '3D FIX' },
      ].map((metric, i) => (
        <div key={i} className="bg-white dark:bg-[#0D131C] border border-[#DDE5E2] dark:border-slate-800 px-5 py-3 rounded-[14px] shadow-sm flex flex-col flex-1 min-w-[120px] transition-colors duration-300">
          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-widest font-mono uppercase">{metric.label}</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5 tabular-nums">{metric.val}</div>
        </div>
      ))}
    </div>
  );
};
