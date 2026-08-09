import React, { useState } from 'react';
import { X, Play, Sliders, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

interface MissionPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionPlanner: React.FC<MissionPlannerProps> = ({ isOpen, onClose }) => {
  const { setFlightState } = useEnvironmentStore();
  const [altitude, setAltitude] = useState<number>(40);
  const [speed, setSpeed] = useState<number>(12);
  const [pattern, setPattern] = useState<string>('SERPENTINE');
  const [overlap, setOverlap] = useState<number>(75);

  if (!isOpen) return null;

  const handleStartMission = () => {
    setFlightState({
      mode: 'AUTO',
      status: 'AIRBORNE',
      altitude: altitude,
      airspeed: speed,
      missionProgress: 0,
      missionStage: 'SURVEY'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-[#F3E6D7] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FAF3EA] bg-[#FFFDF9]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#2B211C] tracking-tight">
                MISSION PLANNER
              </h3>
              <p className="text-[11px] font-mono text-[#8C827A]">
                Autonomous Environmental Grid Generator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Mission Info Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase block">TARGET REGION</span>
              <span className="text-xs font-bold text-[#2B211C]">Kharghar Sector 4 - Sector 7 Basin</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase block">WAYPOINTS</span>
              <span className="text-xs font-mono font-extrabold text-[#F47A24]">9 Planned Points</span>
            </div>
          </div>

          {/* Grid Parameters */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            {/* Survey Altitude */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#2B211C] mb-1.5 font-sans">
                Survey Altitude (AGL)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={altitude}
                  onChange={(e) => setAltitude(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF3EA] border border-[#F3E6D7] rounded-xl font-mono text-xs font-bold text-[#2B211C] focus:outline-none focus:border-[#F47A24]"
                />
                <span className="text-[#8C827A] font-bold">m</span>
              </div>
            </div>

            {/* Flight Speed */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#2B211C] mb-1.5 font-sans">
                Cruise Speed
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF3EA] border border-[#F3E6D7] rounded-xl font-mono text-xs font-bold text-[#2B211C] focus:outline-none focus:border-[#F47A24]"
                />
                <span className="text-[#8C827A] font-bold">m/s</span>
              </div>
            </div>
          </div>

          {/* Survey Pattern Selector */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#2B211C] mb-1.5 font-sans">
              Survey Grid Geometry
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {['SERPENTINE', 'CROSS-HATCH', 'PERIMETER'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPattern(p)}
                  className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    pattern === p
                      ? 'bg-[#F47A24] text-white border-[#F47A24] shadow-xs'
                      : 'bg-[#FAF3EA] text-[#8C827A] border-[#F3E6D7] hover:text-[#2B211C]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Checklist */}
          <div className="p-3 rounded-2xl bg-[#EAF7EE] border border-[#86EFAC] text-xs font-mono text-[#16A34A] flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Geofence check passed: No restricted airspace in Kharghar Sector 4.</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFFDF9] border-t border-[#FAF3EA] flex space-x-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-2xl border border-[#F3E6D7] text-xs font-bold text-[#8C827A] hover:text-[#2B211C] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStartMission}
            className="w-1/2 py-2.5 rounded-2xl bg-linear-to-r from-[#F47A24] to-[#E06815] text-white text-xs font-extrabold shadow-xs hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START MISSION</span>
          </button>
        </div>

      </div>
    </div>
  );
};
