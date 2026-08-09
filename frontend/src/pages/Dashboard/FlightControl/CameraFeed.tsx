import React from 'react';
import { Camera, X, Crosshair } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

interface CameraFeedProps {
  onClose?: () => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onClose }) => {
  const { flightState } = useEnvironmentStore();

  const alt = flightState?.altitude || 42.0;
  const heading = Math.round(flightState?.heading || 218);

  return (
    <div className="w-64 rounded-2xl bg-[#1C1613]/90 backdrop-blur-md border border-[#F3E6D7]/40 shadow-xl overflow-hidden text-white font-mono select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/10 text-[10px]">
        <div className="flex items-center space-x-1.5 text-[#3FA66B] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B] animate-pulse" />
          <span>LIVE CAMERA FEED</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Simulated Downward Gimbal Video View */}
      <div className="relative h-36 bg-gradient-to-b from-[#2A3B4C] via-[#334155] to-[#1E293B] flex items-center justify-center overflow-hidden">
        
        {/* Synthetic Horizon & Grid Lines */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Gimbal Center Crosshair */}
        <div className="relative flex items-center justify-center text-[#F47A24]">
          <Crosshair className="w-10 h-10 opacity-70 animate-pulse" />
        </div>

        {/* Top-Left Camera Label */}
        <div className="absolute top-2 left-2 text-[9px] text-white/80 bg-black/50 px-1.5 py-0.5 rounded">
          4K SENSOR POD
        </div>

        {/* Bottom HUD Overlays */}
        <div className="absolute bottom-2 inset-x-2 flex justify-between text-[9.5px] text-white/90 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span>ALT {alt.toFixed(1)}m</span>
          <span>HDG {heading}°</span>
          <span>30 FPS</span>
        </div>

      </div>

    </div>
  );
};
