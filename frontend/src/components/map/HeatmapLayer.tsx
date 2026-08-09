import React from 'react';
import { IDWHeatmapData } from '../../types/environment';

interface HeatmapLayerProps {
  data: IDWHeatmapData | null;
  visible: boolean;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data, visible }) => {
  if (!visible || !data) return null;

    <div className="absolute bottom-6 right-6 z-20 bg-black/40 p-5 rounded-3xl backdrop-blur-md shadow-2xl text-white font-sans w-64 border border-white/10 select-none">
      <div className="text-[12px] font-bold text-white/90 uppercase tracking-wider mb-4">
        AQI LEGEND
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
            <span className="font-medium text-white/90">0 - 50</span>
          </div>
          <span className="text-white/60">Good</span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
            <span className="font-medium text-white/90">51 - 100</span>
          </div>
          <span className="text-white/60">Moderate</span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="font-medium text-white/90">150+</span>
          </div>
          <span className="text-white/60">Severe</span>
        </div>
      </div>
    </div>
};
