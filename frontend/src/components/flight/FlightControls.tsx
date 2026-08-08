import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { FlightMode } from '../../types/flight';
import { VirtualJoystick } from './VirtualJoystick';
import { AttitudeIndicator } from './AttitudeIndicator';
import { FlightHealth } from './FlightHealth';

export const FlightControls: React.FC = () => {
  const { flightState, setFlightState } = useEnvironmentStore();

  const handleModeChange = (mode: FlightMode) => {
    setFlightState({ mode });
  };

  return (
    <div className="space-y-4">
      {/* Flight Mode Selector */}
      <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/60 dark:border-slate-700 p-4 rounded-3xl shadow-sm space-y-3">
        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest font-mono uppercase">FLIGHT MODE</div>
        <div className="grid grid-cols-3 gap-2">
          {(['AUTO', 'HOLD', 'RTL'] as FlightMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                flightState.mode === mode
                  ? 'bg-[#0EA89A] text-white shadow-md shadow-[#0EA89A]/30'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-[#0EA89A]/50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Attitude Indicator */}
      <AttitudeIndicator />

      {/* Virtual Joystick */}
      <VirtualJoystick />

      {/* Flight Health */}
      <FlightHealth />
    </div>
  );
};
