import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export const SceneHero: React.FC = () => {
  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-4 relative z-10">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 glow-gradient-teal pointer-events-none" />

      {/* Top Tagline */}
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#3DD6C6] mb-8 backdrop-blur-md">
        <Globe className="w-3.5 h-3.5" />
        <span>KHARGHAR DIGITAL TWIN SURVEILLANCE</span>
      </div>

      {/* Brand Title */}
      <h1 className="font-display text-7xl sm:text-9xl font-black tracking-tight text-white uppercase scene-text-glow">
        FLUXX
      </h1>

      <p className="mt-4 text-xl sm:text-2xl font-mono text-slate-300 tracking-widest uppercase">
        ENVIRONMENTAL INTELLIGENCE
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 flex flex-col items-center space-y-2 text-slate-400 font-mono text-xs animate-bounce">
        <span>SCROLL TO EXPLORE</span>
        <ChevronDown className="w-4 h-4 text-[#3DD6C6]" />
      </div>

    </div>
  );
};
