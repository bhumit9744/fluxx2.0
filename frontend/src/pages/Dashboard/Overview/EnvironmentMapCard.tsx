import React, { useState } from 'react';
import { 
  Info, 
  Maximize2, 
  Layers, 
  MapPin, 
  Flame, 
  Eye, 
  EyeOff, 
  Globe 
} from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { EarthMap } from '../../../components/map/EarthMap';

export const EnvironmentMapCard: React.FC = () => {
  const { 
    dashboardData, 
    is3DMode, 
    setIs3DMode, 
    showSensors, 
    setShowSensors, 
    showHeatmap, 
    setShowHeatmap 
  } = useEnvironmentStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const hotspot = dashboardData?.hotspot;

  return (
    <div className={`rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] flex flex-col overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative h-[380px] sm:h-[420px]'
    }`}>
      
      {/* Card Header Bar */}
      <div className="p-4 px-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F9F3EA] bg-white z-10 select-none">
        
        {/* Title & Info */}
        <div className="flex items-center space-x-2">
          <h2 className="text-[15px] font-extrabold text-[#2B211C] tracking-tight flex items-center space-x-1.5">
            <span>Environmental Heatmap (PM2.5)</span>
          </h2>
          <div className="relative group cursor-pointer text-[#8C827A] hover:text-[#2B211C]">
            <Info className="w-3.5 h-3.5" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-52 p-2 bg-[#2B211C] text-white text-[11px] rounded-xl shadow-lg z-30">
              Inverse Distance Weighting (IDW) spatial interpolation from active survey sensor nodes.
            </div>
          </div>
        </div>

        {/* Legend Bar & Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Gradient Legend */}
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#8C827A]">
            <span>Low</span>
            <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-[#3FA66B] via-[#F4B400] to-[#E55353] shadow-inner"></div>
            <span>High</span>
          </div>

          {/* 2D / 3D Mode Toggle Pill */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF3EA] border border-[#F3E6D7] text-[11px] font-bold">
            <button
              onClick={() => setIs3DMode(false)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                !is3DMode 
                  ? 'bg-white text-[#F47A24] shadow-sm font-extrabold' 
                  : 'text-[#8C827A] hover:text-[#2B211C]'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setIs3DMode(true)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                is3DMode 
                  ? 'bg-white text-[#F47A24] shadow-sm font-extrabold' 
                  : 'text-[#8C827A] hover:text-[#2B211C]'
              }`}
            >
              3D
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            className="p-1.5 rounded-xl border border-[#F3E6D7] hover:bg-[#FAF3EA] text-[#6B5E55] hover:text-[#2B211C] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

      {/* Map Body Canvas */}
      <div className="relative flex-1 w-full h-full bg-[#EAE3D9] overflow-hidden">
        <EarthMap isOverview={true} />

        {/* Floating Hotspot Callout Card */}
        {hotspot && (
          <div className="absolute top-4 right-4 z-20 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#F3E6D7] shadow-[0_8px_25px_rgba(70,40,20,0.12)] max-w-[200px] animate-fade-in select-none">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E55353] animate-ping"></span>
              <span className="text-[11px] font-extrabold text-[#E55353] uppercase tracking-wider">
                Hotspot
              </span>
            </div>
            <div className="text-[14px] font-extrabold text-[#2B211C] tracking-tight">
              {hotspot.parameter}: {hotspot.value} {hotspot.unit}
            </div>
            <div className="text-[11px] text-[#8C827A] font-medium mt-0.5 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#F47A24] shrink-0" />
              <span className="truncate">{hotspot.locationName}</span>
            </div>
          </div>
        )}

        {/* Floating Map Layer Controls (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#F3E6D7] shadow-[0_6px_20px_rgba(70,40,20,0.1)] text-[12px] font-semibold text-[#2B211C] select-none">
          
          {/* Sensors Toggle */}
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              showSensors 
                ? 'bg-[#FFF0E5] text-[#F47A24] font-bold' 
                : 'text-[#8C827A] hover:text-[#2B211C]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showSensors ? 'bg-[#F47A24]' : 'bg-[#C0B4A8]'}`}></span>
            <span>Sensors</span>
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              showHeatmap 
                ? 'bg-[#FFF0E5] text-[#F47A24] font-bold' 
                : 'text-[#8C827A] hover:text-[#2B211C]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

        </div>

      </div>

    </div>
  );
};
