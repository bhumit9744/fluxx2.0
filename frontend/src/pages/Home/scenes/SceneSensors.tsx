import React from 'react';
import { Radio } from 'lucide-react';

export const SceneSensors: React.FC = () => {
  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-6 relative z-10">
      <div className="max-w-4xl w-full space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#3DD6C6] uppercase tracking-widest font-bold">
            PHASE 03 / SPATIAL MESH DEPLOYMENT
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            50 Autonomous Sampling Nodes
          </h2>
          <p className="text-slate-400 font-mono text-xs max-w-xl mx-auto">
            Dense physical coverage across Kharghar Sector 4 capturing synchronous atmospheric readings.
          </p>
        </div>

        {/* ASCII / Graphical Mesh Graphic */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl font-mono text-xs text-[#3DD6C6] space-y-4">
          <div className="flex justify-around items-center opacity-80">
            <div className="flex items-center space-x-1"><span>●</span><span className="text-slate-500">───────</span><span>●</span><span className="text-slate-500">───────</span><span>●</span></div>
          </div>
          <div className="flex justify-around items-center opacity-80">
            <div className="flex items-center space-x-1"><span>│</span><span className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>│</span><span className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>│</span></div>
          </div>
          <div className="flex justify-around items-center opacity-80">
            <div className="flex items-center space-x-1"><span>●</span><span className="text-slate-500">───────</span><span>●</span><span className="text-slate-500">───────</span><span>●</span></div>
          </div>
          
          <div className="text-[11px] text-slate-300 pt-2 flex items-center justify-center space-x-2">
            <Radio className="w-4 h-4 text-[#3DD6C6] animate-pulse" />
            <span>GEO-REFERENCED TELEMETRY GRID ACTIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
};
