import React from 'react';
import { Monitor, MonitorOff, Search } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const TopBar: React.FC = () => {
  const { allSamples, presentationMode, setPresentationMode } = useEnvironmentStore();

  return (
    <header className="h-16 bg-transparent flex items-center justify-between px-6 z-10 shrink-0 font-sans transition-colors duration-300">
      
      {/* Left: Location & System Identity */}
      <div className="flex items-center space-x-6">
        <h1 className="text-sm font-bold text-[var(--fluxx-text)] tracking-tight">FLUXX ENVIRONMENTAL INTELLIGENCE</h1>
        <div className="w-[1px] h-4 bg-[var(--fluxx-border)]" />
        <div className="text-[11px] font-mono font-bold text-[var(--fluxx-muted)] tracking-widest uppercase">
          Kharghar · Navi Mumbai
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-64 flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-[var(--fluxx-muted)]" />
          <input 
            type="text" 
            placeholder="Search FLUXX..." 
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--fluxx-glass-light)] backdrop-blur-md border border-[var(--fluxx-border)] rounded-full text-xs font-medium text-[var(--fluxx-text)] placeholder-[var(--fluxx-muted)] focus:outline-hidden focus:border-[var(--fluxx-orange)] transition-colors"
          />
        </div>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center space-x-6">
        
        {/* Data Status */}
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--fluxx-orange)] animate-pulse" />
          <div className="text-[10px] font-mono font-bold text-[var(--fluxx-text)] tracking-wider uppercase">
            LIVE <span className="text-[var(--fluxx-muted)] font-normal ml-1">[{allSamples.length || 300} OBS]</span>
          </div>
        </div>

        {/* Date */}
        <div className="text-[10px] font-mono font-bold text-[var(--fluxx-muted)] tracking-widest uppercase">
          16:42
        </div>

        {/* Presentation Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className="p-1.5 rounded-lg text-[var(--fluxx-muted)] hover:text-black hover:bg-[rgba(244,122,36,0.08)] transition-colors"
          title="Toggle Presentation Mode"
        >
          {presentationMode ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        </button>

      </div>
    </header>
  );
};
