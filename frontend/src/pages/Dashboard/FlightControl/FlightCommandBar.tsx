import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowDownCircle, AlertOctagon, Sliders, Plane, ShieldAlert } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { MissionPlanner } from './MissionPlanner';

export const FlightCommandBar: React.FC = () => {
  const { flightState, setFlightState } = useEnvironmentStore();
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [showEmergencyNotice, setShowEmergencyNotice] = useState(false);

  const isAirborne = flightState?.status === 'AIRBORNE';
  const isHold = flightState?.mode === 'HOLD';

  const handleTakeoff = () => {
    setFlightState({
      status: 'AIRBORNE',
      mode: 'AUTO',
      altitude: 40.0,
      airspeed: 12.0
    });
  };

  const handlePause = () => {
    setFlightState({
      mode: 'HOLD',
      airspeed: 0.0
    });
  };

  const handleResume = () => {
    setFlightState({
      mode: 'AUTO',
      airspeed: 12.4
    });
  };

  const handleRTL = () => {
    setFlightState({
      mode: 'RTL',
      missionStage: 'RETURN TO BASE',
      airspeed: 14.0
    });
  };

  const handleLand = () => {
    setFlightState({
      mode: 'LAND',
      status: 'LANDING',
      altitude: Math.max(0, (flightState?.altitude || 40) - 10)
    });
  };

  const handleEmergency = () => {
    setFlightState({
      status: 'GROUNDED',
      mode: 'HOLD',
      altitude: 0,
      airspeed: 0
    });
    setShowEmergencyNotice(true);
    setTimeout(() => setShowEmergencyNotice(false), 3000);
  };

  return (
    <>
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#F3E6D7] shadow-sm p-4 select-none font-sans flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Mission Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Takeoff */}
          <button
            onClick={handleTakeoff}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-linear-to-r from-[#F47A24] to-[#FF9F5A] text-white text-xs font-black font-mono shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>TAKEOFF</span>
          </button>

          {/* Pause / Hold */}
          {isAirborne && !isHold && (
            <button
              onClick={handlePause}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF3EA] hover:bg-[#F3E6D7] text-[#2B211C] text-xs font-bold font-mono border border-[#F3E6D7] transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
            </button>
          )}

          {/* Resume */}
          {isAirborne && isHold && (
            <button
              onClick={handleResume}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#16A34A] text-xs font-bold font-mono border border-[#86EFAC] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RESUME</span>
            </button>
          )}

          {/* RTL */}
          <button
            onClick={handleRTL}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF3EA] hover:bg-[#F3E6D7] text-[#2B211C] text-xs font-bold font-mono border border-[#F3E6D7] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RETURN TO BASE (RTL)</span>
          </button>

          {/* Land */}
          <button
            onClick={handleLand}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF3EA] hover:bg-[#F3E6D7] text-[#2B211C] text-xs font-bold font-mono border border-[#F3E6D7] transition-all cursor-pointer"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>LAND</span>
          </button>

          {/* Mission Planner Trigger */}
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FFF0E5] hover:bg-[#FFE5D3] text-[#F47A24] text-xs font-bold font-mono border border-[#F47A24]/30 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>MISSION PLANNER</span>
          </button>

        </div>

        {/* Right: Emergency Stop */}
        <div className="flex items-center space-x-3">
          {showEmergencyNotice && (
            <span className="text-xs font-mono font-bold text-[#DC2626] animate-pulse">
              [SAFETY OVERRIDE ENGAGED]
            </span>
          )}
          
          <button
            onClick={handleEmergency}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black font-mono shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>EMERGENCY STOP</span>
          </button>
        </div>

      </div>

      {/* Mission Planner Modal */}
      <MissionPlanner 
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
      />
    </>
  );
};
