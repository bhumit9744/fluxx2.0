import React from 'react';
import { Compass } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ArtificialHorizon: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  const roll = flightState?.roll || -2.4;
  const pitch = flightState?.pitch || 1.8;
  const heading = Math.round(flightState?.heading || 218);

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 select-none font-sans flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            ARTIFICIAL HORIZON
          </span>
        </div>
        <span className="text-[11px] font-mono font-black text-[#F47A24] bg-[#FFF0E5] px-2 py-0.5 rounded-md">
          {heading}° HDG
        </span>
      </div>

      {/* Artificial Horizon Circle Instrument */}
      <div className="flex justify-center my-3">
        <div className="relative w-40 h-40 rounded-full border-4 border-[#2B211C]/80 overflow-hidden shadow-inner bg-[#4B88A2]">
          
          {/* Ground Half (Brown) / Sky Half (Blue) with Pitch & Roll */}
          <div
            className="absolute inset-[-50%] transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${roll}deg) translateY(${pitch * 2}px)`
            }}
          >
            {/* Sky (Upper) */}
            <div className="w-full h-1/2 bg-[#3B82F6]" />
            {/* White Horizon Line */}
            <div className="w-full h-1 bg-white shadow-xs" />
            {/* Ground (Lower) */}
            <div className="w-full h-1/2 bg-[#78350F]" />
          </div>

          {/* Pitch Ladder Lines */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60">
            <div className="w-12 h-px bg-white/80 my-2" />
            <div className="w-8 h-px bg-white/80 my-2" />
            <div className="w-16 h-0.5 bg-white my-2" />
            <div className="w-8 h-px bg-white/80 my-2" />
            <div className="w-12 h-px bg-white/80 my-2" />
          </div>

          {/* Fixed Aircraft Waterline / Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Left Wing */}
            <div className="w-8 h-1 bg-[#F47A24] rounded-l-full shadow-md mr-3" />
            {/* Center Pip */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#F47A24] border-2 border-white shadow-md" />
            {/* Right Wing */}
            <div className="w-8 h-1 bg-[#F47A24] rounded-r-full shadow-md ml-3" />
          </div>

          {/* Bank Angle Roll Scale Pointers */}
          <div className="absolute top-1 inset-x-0 flex justify-center pointer-events-none">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white" />
          </div>

        </div>
      </div>

      {/* Bottom Roll / Pitch Readout */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-2 border-t border-[#FAF3EA]">
        <div className="bg-[#FAF3EA] p-1.5 rounded-xl border border-[#F3E6D7]">
          <span className="text-[9.5px] text-[#8C827A] block font-sans">ROLL</span>
          <span className="font-bold text-[#2B211C]">{roll.toFixed(1)}°</span>
        </div>
        <div className="bg-[#FAF3EA] p-1.5 rounded-xl border border-[#F3E6D7]">
          <span className="text-[9.5px] text-[#8C827A] block font-sans">PITCH</span>
          <span className="font-bold text-[#2B211C]">{pitch > 0 ? `+${pitch.toFixed(1)}°` : `${pitch.toFixed(1)}°`}</span>
        </div>
      </div>

    </div>
  );
};
