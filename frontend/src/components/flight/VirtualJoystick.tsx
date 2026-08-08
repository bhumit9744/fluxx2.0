import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const VirtualJoystick: React.FC = () => {
  const { flightState } = useEnvironmentStore();
  const isActive = flightState.status === 'AIRBORNE' && flightState.mode !== 'HOLD';

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase">VIRTUAL CONTROL</div>
        <div className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold font-mono">SIMULATION</div>
      </div>
      
      <div className="flex items-center justify-between px-2">
        {/* Left Stick (XY) */}
        <div className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-50 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
             <div className="w-[1px] h-full bg-slate-200" />
             <div className="h-[1px] w-full bg-slate-200 absolute" />
          </div>
          <div className={`w-8 h-8 rounded-full shadow-md z-10 transition-all duration-300 ${isActive ? 'bg-[#0EA89A] translate-x-2 -translate-y-2' : 'bg-slate-300'}`} />
        </div>

        {/* Right Stick (Throttle - Z) */}
        <div className="w-8 h-20 rounded-full border-2 border-slate-200 bg-slate-50 relative flex justify-center py-2">
          <div className="w-[1px] h-full bg-slate-200 absolute" />
          <div className={`w-6 h-6 rounded-full shadow-md z-10 transition-all duration-300 absolute ${isActive ? 'bg-[#0EA89A] top-4' : 'bg-slate-300 top-1/2 -translate-y-1/2'}`} />
          <div className="text-[8px] font-mono text-slate-400 absolute -right-6 top-1/2 -translate-y-1/2 -rotate-90">THROTTLE</div>
        </div>
      </div>
    </div>
  );
};
