import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';

export const SceneAI: React.FC = () => {
  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-6 relative z-10">
      <div className="max-w-4xl w-full space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#D95353] uppercase tracking-widest font-bold">
            PHASE 05 / INTELLIGENCE REASONING
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Autonomous Anomaly Localization
          </h2>
        </div>

        {/* Hotspot Detection Alert Panel */}
        <div className="p-8 rounded-3xl bg-[#D95353]/15 border border-[#D95353]/40 backdrop-blur-xl text-left space-y-4 max-w-2xl mx-auto shadow-2xl shadow-red-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#D95353] font-mono font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>HOTSPOT DETECTED</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D95353]/20 text-[#D95353] font-mono text-xs font-bold border border-[#D95353]/30">
              87% CONFIDENCE
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span>PRIMARY FACTOR:</span>
              <strong className="text-white">PM2.5 SURGE (61% WEIGHT)</strong>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span>ATMOSPHERIC STATE:</span>
              <strong className="text-white">WIND STAGNATION (2.6 m/s)</strong>
            </div>
            <div className="flex justify-between">
              <span>PARTICULATE PROFILE:</span>
              <strong className="text-white">PM10 ELEVATION (77.3 µg/m³)</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
