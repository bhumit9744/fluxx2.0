import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, Radio } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const TimeLapseControlBar: React.FC = () => {
  const {
    allSamples,
    currentReading,
    replayStatus,
    startReplay,
    pauseReplay,
    resetReplay,
    setSpeed,
    seekSample
  } = useEnvironmentStore();

  const total = allSamples?.length || 50;
  const currentSample = currentReading?.sample || 1;
  const isPlaying = replayStatus?.playing;
  const speed = replayStatus?.speed || 1;

  const speeds = [0.5, 1, 2, 5];

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseReplay();
    } else {
      startReplay();
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    seekSample(val);
  };

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-sm p-4 select-none font-sans flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Left: Playback Controls */}
      <div className="flex items-center space-x-3">
        {/* Play/Pause */}
        <button
          onClick={handleTogglePlay}
          className="w-10 h-10 rounded-2xl bg-linear-to-r from-[#F47A24] to-[#E06815] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Reset */}
        <button
          onClick={resetReplay}
          className="p-2 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
          title="Reset to sample #1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Speed Multipliers */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#FAF3EA] border border-[#F3E6D7]">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-[#F47A24] text-white shadow-2xs'
                  : 'text-[#8C827A] hover:text-[#2B211C]'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Center: Scrubber */}
      <div className="flex-1 flex items-center space-x-3 px-2">
        <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase shrink-0">
          Sample {currentSample} / {total}
        </span>
        <input
          type="range"
          min={1}
          max={total}
          value={currentSample}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#FAF3EA] rounded-lg appearance-none cursor-pointer accent-[#F47A24]"
        />
        <span className="text-[11px] font-mono font-bold text-[#2B211C] bg-[#FFF0E5] px-2 py-0.5 rounded-md shrink-0">
          {currentReading?.timestamp ? currentReading.timestamp.substring(11, 16) : '12:40'}
        </span>
      </div>

      {/* Right: Live Sync Badge */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] text-xs font-mono font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>TIME-LAPSE ENGINE LIVE</span>
        </div>
      </div>

    </div>
  );
};
