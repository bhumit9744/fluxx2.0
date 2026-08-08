import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface HotspotLayerProps {
  hotspot: {
    latitude: number;
    longitude: number;
    peak_pm25: number;
  } | null;
  onFocus: () => void;
}

export const HotspotLayer: React.FC<HotspotLayerProps> = ({ hotspot, onFocus }) => {
  if (!hotspot) return null;

  return (
    <div
      onClick={onFocus}
      className="absolute bottom-4 right-4 z-20 bg-[#FEE2E2] border border-red-300 text-red-700 px-3 py-2 rounded-2xl shadow-lg backdrop-blur-md flex items-center space-x-2.5 cursor-pointer hover:bg-red-100 transition-all font-mono text-xs"
      title="Click to center on detected hotspot"
    >
      <AlertTriangle className="w-4 h-4 text-[#D95353] shrink-0" />
      <div>
        <div className="font-bold text-[11px] leading-tight">HOTSPOT ACTIVE</div>
        <div className="text-[10px] text-red-600">Peak: {hotspot.peak_pm25.toFixed(1)} µg/m³</div>
      </div>
    </div>
  );
};
