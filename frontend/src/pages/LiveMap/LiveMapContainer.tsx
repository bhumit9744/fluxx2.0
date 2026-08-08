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
    googleMapsApiKey,
    setActiveSection
  } = useEnvironmentStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const google3DInstanceRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [google3DSupported, setGoogle3DSupported] = useState<boolean>(true);
  const [selectedObservation, setSelectedObservation] = useState<any>(null);
  const [isHotspotOpen, setIsHotspotOpen] = useState<boolean>(false);

  // Kharghar Center Coordinates
  const khargharCenter = useMemo(() => ({
    lat: 19.05028,
    lng: 73.06907
  }), []);

  // Compute or extract peak hotspot
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

  // Load Google Maps API
  useEffect(() => {
    if (!googleMapsApiKey) return;

    const scriptId = 'google-maps-platform-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const onGoogleReady = async () => {
      try {
        if ((window as any).google?.maps?.importLibrary) {
          try {
            await (window as any).google.maps.importLibrary('maps3d');
            await (window as any).google.maps.importLibrary('marker');
          } catch (e) {
            setGoogle3DSupported(false);
          }
        }
        setMapLoaded(true);
      } catch (err) {
        setMapLoaded(true);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&v=alpha&libraries=maps3d,marker,geometry`;
      script.async = true;
      script.onload = onGoogleReady;
      script.onerror = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      if ((window as any).google?.maps) onGoogleReady();
      else script.addEventListener('load', onGoogleReady);
    }
  }, [googleMapsApiKey]);

  // Render Google 3D Earth or Satellite Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    const container = mapContainerRef.current;
    const samples = allSamples.length > 0 ? allSamples : [currentReading];

    // Google 3D Web Component
    if ((window as any).google?.maps?.importLibrary && google3DSupported && is3DMode) {
      try {
        container.innerHTML = '';
        const map3d = document.createElement('gmp-map-3d') as any;
        map3d.center = { lat: khargharCenter.lat, lng: khargharCenter.lng, altitude: 1100 };
        map3d.heading = 20;
        map3d.tilt = 45;
        map3d.range = 1500;
        map3d.mode = 'HYBRID';
        map3d.style.width = '100%';
        map3d.style.height = '100%';
        map3d.style.display = 'block';

        // Survey path
        if (showPath && samples.length > 1) {
          const polyline = document.createElement('gmp-polyline-3d') as any;
          const pathPoints = samples.map((s) => ({
            lat: s.location.latitude,
            lng: s.location.longitude,
            altitude: 15
          }));
          try {
            polyline.path = pathPoints;
          } catch (e) {
            polyline.coordinates = pathPoints;
          }
          polyline.strokeColor = '#F47A24';
          polyline.strokeWidth = 2.5;
          polyline.altitudeMode = 'RELATIVE_TO_GROUND';
          map3d.appendChild(polyline);
        }

        // Discrete Sensor Observations
        if (showSensors && samples.length > 0) {
          samples.forEach((s) => {
            const isHotspot = peakHotspot && s.sample === peakHotspot.sample;
            const marker = document.createElement('gmp-marker-3d') as any;
            marker.position = {
              lat: s.location.latitude,
              lng: s.location.longitude,
              altitude: 12
            };
            marker.altitudeMode = 'RELATIVE_TO_GROUND';
            marker.label = isHotspot ? `🔥 PEAK #${s.sample}` : `#${s.sample}`;
            marker.addEventListener('gmp-click', () => {
              setSelectedObservation({
                sample: s.sample,
                latitude: s.location.latitude,
                longitude: s.location.longitude,
                timestamp: s.timestamp,
                sensors: s.sensors
              });
            });
            map3d.appendChild(marker);
          });
        }

        container.appendChild(map3d);
        google3DInstanceRef.current = map3d;
        return;
      } catch (e) {
        setGoogle3DSupported(false);
      }
    }

    // Google Maps 2D Satellite/Hybrid Fallback
    if ((window as any).google?.maps?.Map) {
      container.innerHTML = '';
      const map = new (window as any).google.maps.Map(container, {
        center: khargharCenter,
        zoom: 16,
        mapTypeId: 'hybrid',
        tilt: is3DMode ? 45 : 0,
        heading: 20,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      googleMapInstanceRef.current = map;

      // Survey Trajectory Path
      if (showPath && samples.length > 1) {
        new (window as any).google.maps.Polyline({
          path: samples.map((s) => ({ lat: s.location.latitude, lng: s.location.longitude })),
          geodesic: true,
          strokeColor: '#F47A24',
          strokeOpacity: 0.85,
          strokeWeight: 2.5,
          map: map
        });
      }

      // Discrete Sensor Nodes
      if (showSensors && samples.length > 0) {
        samples.forEach((s) => {
          const isHotspot = peakHotspot && s.sample === peakHotspot.sample;
          const val = floatOrZero(s.sensors?.pm25);

          const marker = new (window as any).google.maps.Marker({
            position: { lat: s.location.latitude, lng: s.location.longitude },
            map: map,
            title: `Observation #${s.sample}: ${val} µg/m³`,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: isHotspot ? 8 : 5,
              fillColor: isHotspot ? '#D9534F' : '#F47A24',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: isHotspot ? 2.5 : 1.5
            }
          });

          marker.addListener('click', () => {
            setSelectedObservation({
              sample: s.sample,
              latitude: s.location.latitude,
              longitude: s.location.longitude,
              timestamp: s.timestamp,
              sensors: s.sensors
            });
          });
        });
      }
    }
  }, [
    mapLoaded, 
    google3DSupported, 
    is3DMode, 
    allSamples, 
    showPath, 
    showSensors, 
    peakHotspot
  ]);

  // Real IDW Spatial Field Canvas Rendering
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    ctx.clearRect(0, 0, width, height);

    if (!showHeatmap || !heatmapData || !heatmapData.grid_cells || heatmapData.grid_cells.length === 0) return;

    const bounds = heatmapData.bounds || {};
    const minLat = bounds.min_lat ?? bounds.minLat ?? 19.036;
    const maxLat = bounds.max_lat ?? bounds.maxLat ?? 19.058;
    const minLng = bounds.min_lng ?? bounds.minLng ?? 73.060;
    const maxLng = bounds.max_lng ?? bounds.maxLng ?? 73.076;

    const project = (lat: number, lng: number) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * (width * 0.80) + (width * 0.10);
      const y = ((maxLat - lat) / (maxLat - minLat)) * (height * 0.80) + (height * 0.10);
      return { x, y };
    };

    const cells = heatmapData.grid_cells;
    const cellSize = Math.max(22, width / 20);

    cells.forEach((cell) => {
      const { x, y } = project(cell.lat, cell.lng);
      const intensity = cell.intensity;

      // Color Gradient: Green -> Yellow -> Orange -> Coral Red
      let r, g, b;
      if (intensity < 0.33) {
        const t = intensity / 0.33;
        r = Math.round(34 + (234 - 34) * t);
        g = Math.round(197 + (179 - 197) * t);
        b = Math.round(94 + (8 - 94) * t);
      } else if (intensity < 0.66) {
        const t = (intensity - 0.33) / 0.33;
        r = Math.round(234 + (244 - 234) * t);
        g = Math.round(179 + (122 - 179) * t);
        b = Math.round(8 + (36 - 8) * t);
      } else {
        const t = (intensity - 0.66) / 0.34;
        r = Math.round(244 + (217 - 244) * t);
        g = Math.round(122 + (83 - 122) * t);
        b = Math.round(36 + (79 - 36) * t);
      }

      const alpha = Math.min(0.58, (0.12 + intensity * 0.45) * (cell.confidence || 0.85));

      const grad = ctx.createRadialGradient(x, y, 0, x, y, cellSize * 1.8);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, cellSize * 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [showHeatmap, heatmapData]);

  // Recenter map
  const handleRecenter = () => {
    if (googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setCenter(khargharCenter);
      googleMapInstanceRef.current.setZoom(16);
    }
    if (google3DInstanceRef.current) {
      google3DInstanceRef.current.center = { lat: khargharCenter.lat, lng: khargharCenter.lng, altitude: 1100 };
      google3DInstanceRef.current.tilt = 45;
    }
  };

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-[#F3E6D7] bg-[#EFE9DF] shadow-[0_8px_30px_rgba(70,40,20,0.04)] select-none">
      
      {/* 1. Google 3D Earth / Satellite Basemap Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0 z-0"
      />

      {/* 2. Real IDW Spatial Field Overlay Canvas */}
      {showHeatmap && (
        <canvas 
          ref={canvasOverlayRef} 
          className="w-full h-full absolute inset-0 z-10 pointer-events-none mix-blend-screen"
        />
      )}

      {/* 3. Top Floating Glass Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Parameter Dropdown */}
        <div className="pointer-events-auto">
          <MapParameterControl />
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

          {/* 3D / 2D Mode Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xl ${
              is3DMode
                ? 'bg-[#2B211C] border-[#2B211C] text-white shadow-md'
                : 'bg-white/85 border-[#F3E6D7] text-[#8C827A] hover:text-[#2B211C]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Earth' : '2D Map'}</span>
          </button>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            title="Recenter Map"
            className="p-2.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-[#F3E6D7] text-[#8C827A] hover:text-[#2B211C] shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
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
