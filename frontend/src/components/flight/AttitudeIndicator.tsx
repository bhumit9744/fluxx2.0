import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const AttitudeIndicator: React.FC = () => {
  const { flightState } = useEnvironmentStore();
  const { roll, pitch, heading } = flightState;

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase">ATTITUDE</div>
        <div className="flex space-x-3 text-[10px] font-mono text-slate-700 font-bold">
          <div>R: {(roll > 0 ? '+' : '')}{roll.toFixed(1)}°</div>
          <div>P: {(pitch > 0 ? '+' : '')}{pitch.toFixed(1)}°</div>
          <div>Y: {heading.toFixed(0)}°</div>
        </div>
      </div>
      
      {/* Artificial Horizon Mock */}
      <div className="relative w-full h-24 bg-sky-400 rounded-xl overflow-hidden border border-slate-200">
        <div 
          className="absolute inset-x-[-50%] h-[200%] bg-amber-600 transition-transform duration-300 ease-out origin-top"
          style={{ 
            top: '50%',
            transform: `translateY(${pitch * 2}px) rotate(${roll}deg)` 
          }}
        >
          {/* Horizon Line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-white shadow-sm" />
        </div>
        
        {/* Center reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-16 h-0.5 bg-yellow-400 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-2 bg-yellow-400" />
           </div>
        </div>
        
        {/* Pitch Lines */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 pointer-events-none space-y-4">
          <div className="w-8 h-[1px] bg-white" />
          <div className="w-12 h-[1px] bg-white" />
          <div className="w-8 h-[1px] bg-white" />
        </div>
      </div>
    </div>
  );
};
