import React from 'react';
import { Flame } from 'lucide-react';

export const SceneHeatmap: React.FC = () => {
  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-6 relative z-10">
      <div className="max-w-4xl w-full space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#3DD6C6] uppercase tracking-widest font-bold">
            PHASE 04 / MATHEMATICAL INTERPOLATION
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Inverse Distance Weighting Heatmap
          </h2>
          <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto">
            Not decorative gradients — real spatial math interpolating 576 continuous grid cells.
          </p>
        </div>

        {/* Heatmap Field Preview Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#080B10] via-[#0EA89A]/20 to-[#D95353]/30 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">PM2.5 SPATIAL FIELD</span>
            <span className="text-[#3DD6C6] font-bold">24x24 INTERPOLATED MATRIX</span>
          </div>

          <div className="h-4 rounded-full bg-gradient-to-r from-[#0EA89A] via-[#E6A23C] to-[#D95353] shadow-lg shadow-[#0EA89A]/30" />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>LOW CONCENTRATION (18 µg/m³)</span>
            <span>HIGH CONCENTRATION (63 µg/m³)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
