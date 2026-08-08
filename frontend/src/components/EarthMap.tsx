import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Compass, 
  RotateCcw, 
  Maximize, 
  Radio, 
  Plane, 
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../stores/environmentStore';

declare global {
  interface Window {
    google?: any;
    L?: any;
  }
}

export const EarthMap: React.FC<{ heightClass?: string; isOverview?: boolean }> = ({
  heightClass = 'h-[540px]',
  isOverview = false
}) => {
  const {
    currentReading,
    allSamples,
    heatmapData,
    selectedLayer,
    setSelectedLayer,
    showSensors,
    setShowSensors,
    showHeatmap,
    setShowHeatmap,
    showPath,
    setShowPath,
    showConfidence,
    setShowConfidence,
    showVTOL,
    mapEngine,
    googleMapsApiKey
  } = useEnvironmentStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltAngle, setTiltAngle] = useState<number>(45);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  // Center coordinates of Kharghar
  const KHARGHAR_CENTER = { lat: 19.05028, lng: 73.06907 };

  // Heatmap rendering loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = canvas.parentElement?.clientHeight || 500;

    ctx.clearRect(0, 0, width, height);

    // Map bounds calculation (Kharghar sector coordinates)
    const minLat = 19.040;
    const maxLat = 19.060;
    const minLng = 73.058;
    const maxLng = 73.078;

    const project = (lat: number, lng: number) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * (width * 0.75) + (width * 0.125) + panOffset.x;
      const y = ((maxLat - lat) / (maxLat - minLat)) * (height * 0.75) + (height * 0.125) + panOffset.y;
      return { x, y };
    };

    // 1. Draw Simulated Dark Satellite / Terrain Basemap
    ctx.fillStyle = '#080D14';
    ctx.fillRect(0, 0, width, height);

    // Subtle 3D Topographic Elevation Isobars
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let r = 50; r < Math.max(width, height); r += 45) {
      ctx.beginPath();
      ctx.ellipse(width / 2 + panOffset.x, height / 2 + panOffset.y, r * 1.3, r * 0.8, -0.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Draw IDW Continuous Spatial Interpolation Heatmap
    if (showHeatmap && heatmapData && heatmapData.grid_cells) {
      const cells = heatmapData.grid_cells;
      const cellSize = Math.max(14, (width / 28) * zoomLevel);

      cells.forEach((cell) => {
        const { x, y } = project(cell.lat, cell.lng);
        const intensity = cell.intensity; // 0.0 to 1.0
        const confidence = showConfidence ? cell.confidence : 1.0;

        // Gradient color: Low (Teal #0EA89A) -> Mid (Amber #E6A23C) -> High (Red #D95353)
        let r, g, b;
        if (intensity < 0.5) {
          const t = intensity / 0.5;
          r = Math.round(14 + (230 - 14) * t);
          g = Math.round(168 + (162 - 168) * t);
          b = Math.round(154 + (60 - 154) * t);
        } else {
          const t = (intensity - 0.5) / 0.5;
          r = Math.round(230 + (217 - 230) * t);
          g = Math.round(162 + (83 - 162) * t);
          b = Math.round(60 + (83 - 60) * t);
        }

        const alpha = Math.min(0.75, (0.2 + intensity * 0.55) * confidence);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, cellSize * 1.5);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Draw Autonomous Survey Flight Path
    if (showPath && allSamples.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(61, 214, 198, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      allSamples.forEach((sample, i) => {
        const { x, y } = project(sample.location.latitude, sample.location.longitude);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Draw Sensor Observation Points (50 Kharghar Pins)
    if (showSensors && allSamples.length > 0) {
      allSamples.forEach((sample) => {
        const { x, y } = project(sample.location.latitude, sample.location.longitude);
        const isActive = sample.sample === currentReading.sample;
        const isHotspot = sample.sensors.pm25 >= 60; // Peak hotspot node

        // Hotspot Pulse
        if (isHotspot) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(217, 83, 83, 0.6)';
          ctx.lineWidth = 2;
          ctx.arc(x, y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Sensor Point Circle
        ctx.beginPath();
        ctx.fillStyle = isActive ? '#FFFFFF' : isHotspot ? '#D95353' : '#0EA89A';
        ctx.arc(x, y, isActive ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isActive ? '#3DD6C6' : '#080B10';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // 5. Draw Active VTOL Drone Icon & Waveform at Current Reading
    if (showVTOL && currentReading) {
      const { x, y } = project(currentReading.location.latitude, currentReading.location.longitude);

      // Radar Pulse Rings
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(61, 214, 198, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Drone Core Marker
      ctx.beginPath();
      ctx.fillStyle = '#3DD6C6';
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Callout Box
      ctx.fillStyle = 'rgba(13, 19, 28, 0.88)';
      ctx.strokeStyle = 'rgba(61, 214, 198, 0.4)';
      ctx.lineWidth = 1;
      
      const label = `SAMPLE #${currentReading.sample} | ${currentReading.sensors[selectedLayer]} ${heatmapData?.unit || 'µg/m³'}`;
      ctx.font = 'bold 10px JetBrains Mono';
      const textWidth = ctx.measureText(label).width;

      ctx.fillRect(x + 10, y - 22, textWidth + 14, 20);
      ctx.strokeRect(x + 10, y - 22, textWidth + 14, 20);

      ctx.fillStyle = '#3DD6C6';
      ctx.fillText(label, x + 17, y - 8);
    }

  }, [
    currentReading,
    allSamples,
    heatmapData,
    selectedLayer,
    showSensors,
    showHeatmap,
    showPath,
    showConfidence,
    showVTOL,
    tiltAngle,
    zoomLevel,
    panOffset
  ]);

  const layers: Array<{ id: LayerType; label: string }> = [
    { id: 'pm25', label: 'PM2.5' },
    { id: 'pm10', label: 'PM10' },
    { id: 'co2', label: 'CO₂' },
    { id: 'temperature', label: 'Temp' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'windSpeed', label: 'Wind' }
  ];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${heightClass} rounded-3xl bg-[#080D14] border border-white/10 overflow-hidden shadow-2xl select-none`}
      style={{
        perspective: '1000px'
      }}
    >
      {/* 1. Map Canvas Viewport with 3D Tilt */}
      <div 
        className="w-full h-full transition-transform duration-500 ease-out"
        style={{
          transform: `rotateX(${tiltAngle}deg) scale(${zoomLevel})`
        }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* 2. Top-Left Parameter Layer Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-[#080B10]/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
        {layers.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLayer(l.id)}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedLayer === l.id
                ? 'bg-gradient-to-r from-[#0EA89A] to-[#3DD6C6] text-slate-950 shadow-md shadow-[#0EA89A]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* 3. Top-Right Map & Layer Toggles */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-[#080B10]/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            showHeatmap ? 'bg-[#0EA89A]/20 text-[#3DD6C6] border border-[#0EA89A]/40' : 'text-slate-500 hover:text-white'
          }`}
          title="Toggle IDW Continuous Heatmap"
        >
          <Flame className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowSensors(!showSensors)}
          className={`p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            showSensors ? 'bg-[#0EA89A]/20 text-[#3DD6C6] border border-[#0EA89A]/40' : 'text-slate-500 hover:text-white'
          }`}
          title="Toggle 50 Sensor Pins"
        >
          <Radio className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowPath(!showPath)}
          className={`p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            showPath ? 'bg-[#0EA89A]/20 text-[#3DD6C6] border border-[#0EA89A]/40' : 'text-slate-500 hover:text-white'
          }`}
          title="Toggle Autonomous Survey Path"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowConfidence(!showConfidence)}
          className={`p-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            showConfidence ? 'bg-[#0EA89A]/20 text-[#3DD6C6] border border-[#0EA89A]/40' : 'text-slate-500 hover:text-white'
          }`}
          title="Toggle Confidence Fade"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Bottom-Left Heatmap Legend & Unit Scale */}
      {showHeatmap && heatmapData && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#080B10]/90 p-3 rounded-2xl border border-white/10 backdrop-blur-xl text-xs font-mono space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-white uppercase">{heatmapData.label} IDW INTERPOLATION</span>
            <span className="text-[#3DD6C6]">{heatmapData.unit}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#3DD6C6] font-bold">{heatmapData.stats.min}</span>
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-[#0EA89A] via-[#E6A23C] to-[#D95353]" />
            <span className="text-[10px] text-[#D95353] font-bold">{heatmapData.stats.max}</span>
          </div>

          <div className="text-[9px] text-slate-400 flex items-center justify-between">
            <span>50 Kharghar Observations</span>
            <span>24x24 Spatial Grid</span>
          </div>
        </div>
      )}

      {/* 5. Bottom-Right 3D Camera Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-[#080B10]/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setTiltAngle(tiltAngle === 0 ? 45 : 0)}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          {tiltAngle === 0 ? '3D Tilt (45°)' : '2D Top-Down (0°)'}
        </button>

        <button
          onClick={() => {
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Recenter Kharghar"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
