import React from 'react';
import { MapPin, ArrowRight, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const SpatialIntelligenceCard: React.FC = () => {
  const { setActiveSection, dispatchVTOL, seekSample } = useEnvironmentStore();

  const hotspot = {
    name: 'Kharghar Sector 4 Cluster',
    lat: 19.054983,
    lng: 73.066209,
    peakVal: '63.1 µg/m³',
    confidence: '87%',
    time: '12:40',
    terrain: 'Valley Basin / Low Advection',
    sampleIdx: 26
  };

  const handleNavigateLiveMap = () => {
    seekSample(hotspot.sampleIdx);
    dispatchVTOL(hotspot.lat, hotspot.lng);
    setActiveSection('live-map');
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              Spatial Intelligence
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              Hotspot Localization & Geo-Coordinates
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold font-mono text-[#F47A24] bg-[#FFF0E5] px-2 py-0.5 rounded-md border border-[#F47A24]/20">
          HOTSPOT DETECTED
        </span>
      </div>

      {/* Hotspot Box */}
      <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-black text-[#2B211C] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
              <span>{hotspot.name}</span>
            </div>
            <div className="text-[10.5px] font-mono text-[#8C827A] mt-0.5">
              Lat {hotspot.lat.toFixed(6)}, Lng {hotspot.lng.toFixed(6)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-[#DC2626] font-mono">{hotspot.peakVal}</div>
            <div className="text-[10px] font-mono text-[#8C827A]">Peak Reading</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8C827A] pt-1">
          <div className="p-2 rounded-xl bg-white/80 border border-[#F3E6D7]/60">
            <span className="text-[9.5px] uppercase font-bold text-[#8C827A] block">Classification:</span>
            <span className="font-bold text-[#2B211C]">{hotspot.terrain}</span>
          </div>
          <div className="p-2 rounded-xl bg-white/80 border border-[#F3E6D7]/60">
            <span className="text-[9.5px] uppercase font-bold text-[#8C827A] block">Peak Observation:</span>
            <span className="font-bold text-[#2B211C]">{hotspot.time} ({hotspot.confidence})</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNavigateLiveMap}
        className="w-full py-2.5 rounded-2xl bg-linear-to-r from-[#F47A24] to-[#E06815] hover:opacity-95 text-white font-extrabold text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>VIEW ON LIVE MAP →</span>
      </button>

    </div>
  );
};
