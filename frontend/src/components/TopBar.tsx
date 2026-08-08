import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Radio, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Plane, 
  Battery, 
  MapPin, 
  LogOut,
  Sliders,
  Settings
} from 'lucide-react';
import { useEnvironmentStore } from '../stores/environmentStore';

export const TopBar: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const {
    currentReading,
    replayStatus,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    seekSample,
    presentationMode,
    setPresentationMode,
    setAppMode,
    connected
  } = useEnvironmentStore();

  return (
    <header className="h-16 px-5 border-b border-white/10 bg-[#080B10]/90 backdrop-blur-xl flex items-center justify-between z-30 select-none">
      
      {/* 1. Location & Sector HUD */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3DD6C6] animate-pulse" />
          <span className="font-display font-black text-sm tracking-wider text-white">
            FLUXX / KHARGHAR
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 hidden sm:inline-block">
            SECTOR A-4
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-400 border-l border-white/10 pl-4">
          <MapPin className="w-3.5 h-3.5 text-[#3DD6C6]" />
          <span>{currentReading.location.latitude.toFixed(4)}° N, {currentReading.location.longitude.toFixed(4)}° E</span>
          <span className="text-slate-600">•</span>
          <span>SAMPLE {currentReading.sample}/{currentReading.total_samples}</span>
        </div>
      </div>

      {/* 2. Central Replay Controller & Timeline Scrubber */}
      {!presentationMode && (
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={replayStatus.playing ? pauseReplay : startReplay}
              className="p-1.5 rounded-lg bg-[#0EA89A] text-slate-950 hover:bg-[#3DD6C6] transition-all cursor-pointer shadow-md shadow-[#0EA89A]/30"
              title={replayStatus.playing ? 'Pause Playback' : 'Start Playback'}
            >
              {replayStatus.playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={resetReplay}
              className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Reset to Sample 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeline Slider */}
          <div className="flex items-center space-x-2 w-32 sm:w-48">
            <input
              type="range"
              min={1}
              max={currentReading.total_samples || 50}
              value={currentReading.sample}
              onChange={(e) => seekSample(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3DD6C6]"
            />
            <span className="text-[11px] font-mono text-slate-300 font-bold shrink-0">
              #{currentReading.sample}
            </span>
          </div>

          {/* Speed Multiplier Switcher */}
          <div className="hidden sm:flex items-center space-x-1 border-l border-white/10 pl-2">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  replayStatus.speed === s
                    ? 'bg-[#3DD6C6] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="hidden md:inline-block text-[10px] font-mono text-[#3DD6C6] bg-[#0EA89A]/10 px-2 py-0.5 rounded border border-[#0EA89A]/20">
            ● DATA REPLAY
          </span>
        </div>
      )}

      {/* 3. VTOL Mock Status & Actions */}
      <div className="flex items-center space-x-3">
        {/* Mock Drone Indicator */}
        <div className="hidden xl:flex items-center space-x-2 text-xs font-mono bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
          <Plane className="w-3.5 h-3.5 text-[#3DD6C6]" />
          <span className="text-white font-bold">VTOL-001</span>
          <span className="text-[#3DD6C6] font-bold">● AIRBORNE</span>
          <span className="text-slate-400">42m</span>
          <Battery className="w-3.5 h-3.5 text-emerald-400 ml-1" />
          <span className="text-slate-300">82%</span>
        </div>

        {/* Presentation Mode Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            presentationMode
              ? 'bg-[#3DD6C6] text-slate-950 shadow-lg shadow-[#3DD6C6]/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
          title="Toggle Judge Presentation Mode"
        >
          {presentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{presentationMode ? 'Exit Mode' : 'Presentation'}</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          title="Map & Google 3D Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Exit Command Center */}
        <button
          onClick={() => setAppMode('home')}
          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-[#D95353] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          title="Exit to Brand Experience"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
