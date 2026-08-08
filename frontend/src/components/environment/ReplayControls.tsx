import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const ReplayControls: React.FC = () => {
  const {
    currentReading,
    replayStatus,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    seekSample
  } = useEnvironmentStore();

  const handlePrev = () => {
    if (currentReading.sample > 1) {
      seekSample(currentReading.sample - 1);
    }
  };

  const handleNext = () => {
    if (currentReading.sample < currentReading.total_samples) {
      seekSample(currentReading.sample + 1);
    }
  };

  return (
    <div className="p-4 rounded-3xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      
      {/* 1. Play/Pause/Prev/Next/Reset buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={resetReplay}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          title="Reset to Sample 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrev}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          title="Previous Observation"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={replayStatus.playing ? pauseReplay : startReplay}
          className="px-4 py-2 rounded-xl bg-[#0EA89A] hover:bg-[#0C8E82] text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-[#0EA89A]/20 transition-all cursor-pointer"
        >
          {replayStatus.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{replayStatus.playing ? 'PAUSE' : 'PLAY REPLAY'}</span>
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          title="Next Observation"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Timeline Progress Bar */}
      <div className="flex-1 w-full max-w-xl flex items-center space-x-3 px-2">
        <span className="text-[11px] font-mono text-slate-400 font-semibold">06:00</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={1}
            max={currentReading.total_samples || 50}
            value={currentReading.sample}
            onChange={(e) => seekSample(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0EA89A]"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-400 font-semibold">14:30</span>
      </div>

      {/* 3. Sample Indicator & Speed buttons */}
      <div className="flex items-center space-x-3">
        <div className="text-right font-mono">
          <div className="text-xs font-bold text-slate-900">
            SAMPLE #{currentReading.sample} <span className="text-slate-400 font-normal">/ {currentReading.total_samples}</span>
          </div>
          <div className="text-[10px] text-[#0EA89A] font-semibold">● DATA REPLAY</div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                replayStatus.speed === s
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
