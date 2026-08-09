import React from 'react';
import { Activity, ShieldCheck, Home, Navigation, Radio } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const FlightStatus: React.FC = () => {
  const { flightState, setFlightState } = useEnvironmentStore();

  const modes = ['AUTO SURVEY', 'HOLD / LOITER', 'RETURN TO HOME', 'MANUAL'];

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 select-none font-sans flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            FLIGHT STATUS
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#86EFAC]">
          AIRBORNE ACTIVE
        </span>
      </div>

      {/* Flight Status Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        
        {/* Armed */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A]">ARMED STATE</span>
          <span className="text-sm font-black text-[#16A34A] mt-1">ARMED (YES)</span>
        </div>

        {/* GPS Fix */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A]">GPS STATUS</span>
          <span className="text-sm font-black text-[#16A34A] mt-1">3D DGPS FIX</span>
        </div>

        {/* Flight Mode */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A]">FLIGHT MODE</span>
          <span className="text-xs font-black text-[#F47A24] mt-1 truncate">
            {flightState?.mode === 'AUTO' ? 'AUTO SURVEY' : flightState?.mode || 'AUTO SURVEY'}
          </span>
        </div>

        {/* Distance to Home */}
        <div className="p-2.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7]/60 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-[#8C827A]">HOME DISTANCE</span>
          <span className="text-sm font-black text-[#2B211C] mt-1">1.8 km</span>
        </div>

      </div>

      {/* Quick Mode Toggle Strip */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase">Active Mode Override</span>
        <div className="grid grid-cols-2 gap-1.5">
          {modes.map((m) => {
            const isSel = (m.startsWith('AUTO') && flightState?.mode === 'AUTO') ||
                          (m.startsWith('HOLD') && flightState?.mode === 'HOLD') ||
                          (m.startsWith('RETURN') && flightState?.mode === 'RTL');
            return (
              <button
                key={m}
                onClick={() => {
                  if (m.startsWith('AUTO')) setFlightState({ mode: 'AUTO' });
                  else if (m.startsWith('HOLD')) setFlightState({ mode: 'HOLD' });
                  else if (m.startsWith('RETURN')) setFlightState({ mode: 'RTL' });
                }}
                className={`py-1.5 px-2 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer border truncate ${
                  isSel
                    ? 'bg-[#F47A24] text-white border-[#F47A24] shadow-2xs'
                    : 'bg-[#FAF3EA] text-[#8C827A] border-[#F3E6D7] hover:text-[#2B211C]'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
