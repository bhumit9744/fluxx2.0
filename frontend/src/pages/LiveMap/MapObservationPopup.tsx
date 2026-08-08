import React from 'react';
import { X, MapPin, Clock } from 'lucide-react';

interface MapObservationPopupProps {
  observation: {
    sample?: number;
    latitude?: number;
    longitude?: number;
    timestamp?: string;
    sensors?: {
      pm25?: number;
      pm10?: number;
      co2?: number;
      temperature?: number;
      humidity?: number;
      windSpeed?: number;
    };
  } | null;
  onClose: () => void;
}

export const MapObservationPopup: React.FC<MapObservationPopupProps> = ({ observation, onClose }) => {
  if (!observation) return null;

  const s = observation.sensors || {};
  const lat = observation.latitude?.toFixed(6) || '19.054983';
  const lng = observation.longitude?.toFixed(6) || '73.066209';
  const time = observation.timestamp ? (observation.timestamp.includes('T') ? observation.timestamp.split('T')[1].slice(0, 5) : observation.timestamp) : '15:42';

  return (
    <div className="absolute top-4 right-4 z-40 w-72 rounded-[22px] bg-white/95 backdrop-blur-2xl border border-[#F3E6D7] shadow-[0_16px_40px_rgba(70,40,20,0.16)] p-4 font-sans select-none space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-2.5">
        <div>
          <span className="text-[10px] font-extrabold text-[#F47A24] uppercase tracking-wider">
            OBSERVATION #{observation.sample || 1}
          </span>
          <div className="text-[14px] font-extrabold text-[#2B211C] tracking-tight">
            Sensor Telemetry
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Measurements */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <div className="text-[9.5px] font-bold text-[#8C827A] uppercase">PM2.5</div>
          <div className="text-[15px] font-extrabold text-[#2B211C] font-mono mt-0.5">
            {s.pm25 != null ? s.pm25.toFixed(1) : '--'} <span className="text-[10px] font-normal text-[#8C827A]">µg/m³</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <div className="text-[9.5px] font-bold text-[#8C827A] uppercase">PM10</div>
          <div className="text-[15px] font-extrabold text-[#2B211C] font-mono mt-0.5">
            {s.pm10 != null ? s.pm10.toFixed(1) : '--'} <span className="text-[10px] font-normal text-[#8C827A]">µg/m³</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <div className="text-[9.5px] font-bold text-[#8C827A] uppercase">TEMPERATURE</div>
          <div className="text-[15px] font-extrabold text-[#2B211C] font-mono mt-0.5">
            {s.temperature != null ? s.temperature.toFixed(1) : '28.4'} <span className="text-[10px] font-normal text-[#8C827A]">°C</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
          <div className="text-[9.5px] font-bold text-[#8C827A] uppercase">CO₂</div>
          <div className="text-[15px] font-extrabold text-[#2B211C] font-mono mt-0.5">
            {s.co2 != null ? Math.round(s.co2) : '559'} <span className="text-[10px] font-normal text-[#8C827A]">ppm</span>
          </div>
        </div>
      </div>

      {/* Metadata / Coordinates */}
      <div className="space-y-1 pt-1 text-[11px] text-[#8C827A] border-t border-[#FAF3EA]">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-[#F47A24]" />
          <span>Recorded at {time}</span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[10.5px]">
          <MapPin className="w-3.5 h-3.5 text-[#3FA66B]" />
          <span>{lat}° N, {lng}° E</span>
        </div>
      </div>

    </div>
  );
};
