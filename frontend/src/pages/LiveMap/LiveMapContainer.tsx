import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Flame, 
  Layers, 
  Eye, 
  RotateCcw, 
  Plane, 
  Sparkles,
  MapPin,
  Box,
  Compass
} from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { MapParameterControl } from './MapParameterControl';
import { HeatmapLegend } from './HeatmapLegend';
import { MapObservationPopup } from './MapObservationPopup';
import { HotspotMarker } from './HotspotMarker';
import { MapLibreEngine } from '../../components/map/MapLibreEngine';

export const LiveMapContainer: React.FC = () => {
  const {
    allSamples,
    currentReading,
    heatmapData,
    fetchHeatmap,
    liveMapData,
    selectedLayer,
    showSensors,
    setShowSensors,
    showHeatmap,
    setShowHeatmap,
    showPath,
    is3DMode,
    setIs3DMode,
    setActiveSection,
    mapTheme,
    setMapTheme
  } = useEnvironmentStore();

  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const [selectedObservation, setSelectedObservation] = useState<any>(null);
  const [isHotspotOpen, setIsHotspotOpen] = useState<boolean>(false);

  // Compute peak hotspot from dataset
  const peakHotspot = useMemo(() => {
    if (liveMapData?.hotspot) return liveMapData.hotspot;
    if (!allSamples || allSamples.length === 0) return null;

    let maxSample = allSamples[0];
    let maxVal = floatOrZero(maxSample.sensors?.pm25);

    allSamples.forEach((s) => {
      const v = floatOrZero(s.sensors?.pm25);
      if (v > maxVal) {
        maxVal = v;
        maxSample = s;
      }
    });

    return {
      sample: maxSample.sample,
      latitude: maxSample.location.latitude,
      longitude: maxSample.location.longitude,
      location: 'Kharghar Sector 4',
      parameter: 'pm25',
      value: maxVal,
      unit: 'µg/m³',
      timestamp: maxSample.timestamp,
      sensors: maxSample.sensors
    };
  }, [liveMapData, allSamples]);

  function floatOrZero(v: any) {
    const num = parseFloat(v);
    return isNaN(num) ? 0 : num;
  }

  // Real IDW Spatial Field Canvas Rendering has been moved natively to LeafletMapEngine.tsx

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-[#F3E6D7] bg-[#EFE9DF] shadow-[0_8px_30px_rgba(70,40,20,0.04)] select-none">
      
      {/* 1. Primary Satellite Basemap Engine */}
      <MapLibreEngine 
        onSelectObservation={(obs) => setSelectedObservation(obs)}
        is3D={is3DMode}
      />

      {/* 2. Real IDW Spatial Field Overlay Canvas is handled by MapLibreEngine internally */}

      {/* 3. Top Floating Glass Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Parameter Dropdown & Theme Toggle */}
        <div className="pointer-events-auto flex items-center gap-3">
          <MapParameterControl />
          
          <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
            <button
              onClick={() => setMapTheme('dark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapTheme === 'dark' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              DARK THEME
            </button>
            <button
              onClick={() => setMapTheme('light')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapTheme === 'light' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              LIGHT THEME
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapTheme === 'satellite' ? 'bg-[#3B82F6] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              SATELLITE
            </button>
          </div>
        </div>

        {/* Right: Layer Toggles & Action Links */}
        <div className="pointer-events-auto flex items-center space-x-2">
          
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xl ${
              showHeatmap
                ? 'bg-[#FFF0E5]/90 border-[#F47A24]/40 text-[#F47A24]'
                : 'bg-white/85 border-[#F3E6D7] text-[#8C827A] hover:text-[#2B211C]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          {/* Sensors Toggle */}
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xl ${
              showSensors
                ? 'bg-[#FFF0E5]/90 border-[#F47A24]/40 text-[#F47A24]'
                : 'bg-white/85 border-[#F3E6D7] text-[#8C827A] hover:text-[#2B211C]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Sensors</span>
          </button>

          {/* Open Flight Control Link Button */}
          <button
            onClick={() => setActiveSection('flight-ops')}
            className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white text-xs font-extrabold shadow-[0_4px_16px_rgba(244,122,36,0.3)] transition-all cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Open Flight Control &rarr;</span>
          </button>

        </div>
      </div>

      {/* 4. Bottom Left: Heatmap Legend */}
      {showHeatmap && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
          <HeatmapLegend />
        </div>
      )}

      {/* 5. Bottom Right: Peak Hotspot Floating Badge */}
      {peakHotspot && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={() => setIsHotspotOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-[#D9534F]/30 shadow-[0_8px_24px_rgba(217,83,79,0.15)] hover:border-[#D9534F] text-[#2B211C] text-xs font-extrabold transition-all cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F] animate-ping"></span>
            <Flame className="w-4 h-4 text-[#D9534F]" />
            <span>Peak Hotspot: <span className="font-mono text-[#D9534F]">{peakHotspot.value} {peakHotspot.unit}</span></span>
          </button>
        </div>
      )}

      {/* 6. Sensor Observation Detail Modal */}
      <MapObservationPopup 
        observation={selectedObservation} 
        onClose={() => setSelectedObservation(null)} 
      />

      {/* 7. Peak Hotspot Detail Modal */}
      <HotspotMarker 
        hotspot={peakHotspot}
        isOpen={isHotspotOpen}
        onClose={() => setIsHotspotOpen(false)}
        onViewObservation={() => {
          if (peakHotspot) {
            setSelectedObservation({
              sample: peakHotspot.sample,
              latitude: peakHotspot.latitude,
              longitude: peakHotspot.longitude,
              timestamp: peakHotspot.timestamp,
              sensors: peakHotspot.sensors
            });
            setIsHotspotOpen(false);
          }
        }}
      />

    </div>
  );
};
