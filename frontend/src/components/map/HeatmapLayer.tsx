import React from 'react';
import { IDWHeatmapData } from '../../types/environment';

interface HeatmapLayerProps {
  data: IDWHeatmapData | null;
  visible: boolean;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data, visible }) => {
  if (!visible || !data) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-3 rounded-2xl border border-slate-200/80 backdrop-blur-xl shadow-lg text-xs font-mono space-y-1.5 max-w-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-slate-900 uppercase">{data.label} IDW FIELD</span>
        <span className="text-[#0EA89A] font-bold">{data.unit}</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[10px] text-[#0EA89A] font-bold">{data.stats.min}</span>
        <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-[#0EA89A] via-[#E6A23C] to-[#D95353]" />
        <span className="text-[10px] text-[#D95353] font-bold">{data.stats.max}</span>
      </div>

      <div className="text-[9px] text-slate-400 flex items-center justify-between">
        <span>50 Kharghar Observations</span>
        <span>Continuous Grid</span>
      </div>
    </div>
  );
};
