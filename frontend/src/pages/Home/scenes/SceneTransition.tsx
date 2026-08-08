import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const SceneTransition: React.FC = () => {
  const { setAppMode } = useEnvironmentStore();

  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-6 relative z-10">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0EA89A] to-[#3DD6C6] flex items-center justify-center mx-auto shadow-xl shadow-[#0EA89A]/30">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            FLUXX COMMAND CENTER
          </h2>

          <p className="text-slate-400 font-mono text-xs sm:text-sm">
            Live digital twin surveillance, spatial interpolation, AI risk index & autonomous audit reports.
          </p>
        </div>

        <div>
          <button
            onClick={() => setAppMode('login')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0EA89A] to-[#3DD6C6] text-slate-950 font-mono text-sm font-black uppercase tracking-wider shadow-xl shadow-[#0EA89A]/30 hover:scale-105 transition-all duration-200 inline-flex items-center space-x-3 cursor-pointer"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
