import React from 'react';
import { Flame, ArrowRight, X } from 'lucide-react';

interface HotspotMarkerProps {
  hotspot: {
    sample?: number;
    latitude?: number;
    longitude?: number;
    location?: string;
    parameter?: string;
    value?: number;
    unit?: string;
    timestamp?: string;
    sensors?: any;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onViewObservation: () => void;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ 
  hotspot, 
  isOpen, 
  onClose, 
  onViewObservation 
}) => {
  if (!hotspot || !isOpen) return null;

  const val = hotspot.value?.toFixed(1) || '63.1';
  const unit = hotspot.unit || 'µg/m³';
  const loc = hotspot.location || 'Kharghar Sector 4';
  const time = hotspot.timestamp ? (hotspot.timestamp.includes('T') ? hotspot.timestamp.split('T')[1].slice(0, 5) : hotspot.timestamp) : '15:42';

  return (
    <div className="absolute top-4 left-4 z-40 w-72 rounded-[24px] bg-white/95 backdrop-blur-2xl border-2 border-[#D9534F]/30 shadow-[0_16px_40px_rgba(217,83,79,0.18)] p-4 font-sans select-none space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#D9534F]/10 text-[#D9534F] flex items-center justify-center">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#D9534F] uppercase tracking-wider">
              CRITICAL HOTSPOT
            </span>
            <div className="text-[14px] font-extrabold text-[#2B211C] tracking-tight">
              {loc}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Hotspot Value */}
      <div className="p-3 rounded-2xl bg-[#FFF0E5]/60 border border-[#F47A24]/30 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-extrabold text-[#8C827A] uppercase">PEAK PM2.5</div>
          <div className="text-[22px] font-black text-[#D9534F] font-mono leading-none mt-1">
            {val} <span className="text-[12px] font-bold text-[#8C827A]">{unit}</span>
          </div>
        </div>
        <div className="text-right text-[11px] font-bold text-[#8C827A]">
          <div>Recorded at</div>
          <div className="text-[#2B211C] font-mono text-xs">{time}</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onViewObservation}
        className="w-full py-2.5 rounded-xl bg-[#F47A24] hover:bg-[#E06815] text-white text-xs font-extrabold tracking-tight flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer"
      >
        <span>View Observation</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

    </div>
  );
};
