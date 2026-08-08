import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Flame, 
  Radio, 
  RotateCcw, 
  Globe, 
  Plane,
  X,
  MapPin,
  Clock,
  Wind,
  Droplets,
  Thermometer,
  Cloud
} from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

export const EarthMap: React.FC<{ isOverview?: boolean }> = ({
  isOverview = false
}) => {
  const {
    currentReading,
    allSamples,
    heatmapData,
    fetchHeatmap,
    selectedLayer,
    setSelectedLayer,
    showSensors,
    setShowSensors,
    showHeatmap,
    setShowHeatmap,
    showPath,
    is3DMode,
    mapEngine,
    googleMapsApiKey,
    seekSample,
    flightState,
    activeSection
  } = useEnvironmentStore();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const google3DInstanceRef = useRef<any>(null);
  
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [google3DSupported, setGoogle3DSupported] = useState<boolean>(true);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [satelliteMode, setSatelliteMode] = useState<'hybrid' | 'satellite'>('hybrid');

  // Kharghar Center Coordinates
  const khargharCenter = useMemo(() => ({
    lat: 19.05028,
    lng: 73.06907
  }), []);

  const layerLabels: { id: LayerType; label: string; unit: string }[] = [
    { id: 'pm25', label: 'PM2.5', unit: 'µg/m³' },
    { id: 'pm10', label: 'PM10', unit: 'µg/m³' },
    { id: 'co2', label: 'CO₂', unit: 'ppm' },
    { id: 'temperature', label: 'TEMP', unit: '°C' },
    { id: 'humidity', label: 'HUMIDITY', unit: '%' },
    { id: 'windSpeed', label: 'WIND', unit: 'm/s' }
  ];

  // 1. Cumulative Replay Heatmap Sync: Refresh IDW field as observations progress
  useEffect(() => {
    fetchHeatmap(selectedLayer, currentReading.sample);
  }, [currentReading.sample, selectedLayer, fetchHeatmap]);

  // 2. Google Maps JS API Loader
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

  // 3. Render Google Maps & Real CSV Observations
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;
    const container = mapContainerRef.current;

    // Use observations from CSV up to active sample or all available
    const visibleSamples = allSamples.length > 0 
      ? allSamples.slice(0, Math.max(1, currentReading.sample))
      : [currentReading];

    // Google 3D Web Component
    if (mapEngine === 'google_3d' && (window as any).google?.maps?.importLibrary && google3DSupported && is3DMode) {
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

        // Real Survey Trajectory Path from CSV
        if (showPath && visibleSamples.length > 1) {
          const polyline = document.createElement('gmp-polyline-3d') as any;
          const pathPoints = visibleSamples.map((s) => ({
            lat: s.location.latitude,
            lng: s.location.longitude,
            altitude: 15
          }));
          try {
            polyline.path = pathPoints;
          } catch (e) {
            polyline.coordinates = pathPoints;
          }
          polyline.strokeColor = '#0EA89A';
          polyline.strokeWidth = 2.5;
          polyline.altitudeMode = 'RELATIVE_TO_GROUND';
          map3d.appendChild(polyline);
        }

        // Discrete Sensor Observations from CSV
        if (showSensors && visibleSamples.length > 0) {
          visibleSamples.forEach((s) => {
            const isCurrent = s.sample === currentReading.sample;
            const marker = document.createElement('gmp-marker-3d') as any;
            marker.position = {
              lat: s.location.latitude,
              lng: s.location.longitude,
              altitude: 12
            };
            marker.altitudeMode = 'RELATIVE_TO_GROUND';
            marker.label = isCurrent ? `● LIVE #${s.sample}` : `#${s.sample}`;
            marker.addEventListener('gmp-click', () => setSelectedPoint(s));
            map3d.appendChild(marker);
          });
        }

        // Simulated VTOL Overlay
        if (activeSection === 'flight-ops') {
          const vtolMarker = document.createElement('gmp-marker-3d') as any;
          vtolMarker.position = {
            lat: flightState.latitude,
            lng: flightState.longitude,
            altitude: flightState.altitude || 42
          };
          vtolMarker.altitudeMode = 'RELATIVE_TO_GROUND';
          vtolMarker.label = `✈ ${flightState.droneId}`;
          map3d.appendChild(vtolMarker);

          // Render trajectory line if targeting hotspot
          if (flightState.targetLatitude && flightState.targetLongitude) {
            const vtolPath = document.createElement('gmp-polyline-3d') as any;
            vtolPath.coordinates = [
              { lat: flightState.latitude, lng: flightState.longitude, altitude: flightState.altitude || 42 },
              { lat: flightState.targetLatitude, lng: flightState.targetLongitude, altitude: 0 }
            ];
            vtolPath.strokeColor = '#F59E0B'; // Amber
            vtolPath.strokeWidth = 2;
            vtolPath.altitudeMode = 'RELATIVE_TO_GROUND';
            map3d.appendChild(vtolPath);
          }
        }

        container.appendChild(map3d);
        google3DInstanceRef.current = map3d;
        return;
      } catch (e) {
        setGoogle3DSupported(false);
      }
    }

    // Google Maps Satellite / Hybrid Basemap
    if ((window as any).google?.maps?.Map) {
      container.innerHTML = '';
      const map = new (window as any).google.maps.Map(container, {
        center: khargharCenter,
        zoom: 16,
        mapTypeId: satelliteMode,
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

      // Real Survey Trajectory Path from CSV
      if (showPath && visibleSamples.length > 1) {
        new (window as any).google.maps.Polyline({
          path: visibleSamples.map((s) => ({ lat: s.location.latitude, lng: s.location.longitude })),
          geodesic: true,
          strokeColor: '#0EA89A',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: map
        });
      }

      // Discrete CSV Sensor Nodes
      if (showSensors && visibleSamples.length > 0) {
        visibleSamples.forEach((s) => {
          const isCurrent = s.sample === currentReading.sample;
          const isHotspot = (s.sensors?.pm25 || 0) >= 60;

          const marker = new (window as any).google.maps.Marker({
            position: { lat: s.location.latitude, lng: s.location.longitude },
            map: map,
            title: `CSV Observation #${s.sample}: ${s.sensors.pm25} µg/m³`,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: isCurrent ? 7.5 : isHotspot ? 6 : 4,
              fillColor: isCurrent ? '#FFFFFF' : isHotspot ? '#EF4444' : '#0EA89A',
              fillOpacity: 1,
              strokeColor: isCurrent ? '#0EA89A' : '#FFFFFF',
              strokeWeight: isCurrent ? 2.5 : 1
            }
          });

          marker.addListener('click', () => setSelectedPoint(s));
        });
      }
    }
  }, [
    mapLoaded, 
    mapEngine, 
    google3DSupported, 
    is3DMode, 
    satelliteMode, 
    allSamples, 
    currentReading.sample, 
    showPath, 
    showSensors
  ]);

  // 4. Real IDW Spatial Field (Interpolated directly from CSV rows)
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = canvas.parentElement?.clientHeight || 500;

    ctx.clearRect(0, 0, width, height);

    if (!showHeatmap || !heatmapData || !heatmapData.grid_cells || heatmapData.grid_cells.length === 0) return;

    // Use exact observation bounding box calculated from the CSV by the backend
    const bounds = heatmapData.bounds;
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
      const intensity = cell.intensity; // 0.0 to 1.0 within CSV min..max

      // Environmental Color Gradient (Teal -> Amber -> Coral Red)
      let r, g, b;
      if (intensity < 0.5) {
        const t = intensity / 0.5;
        r = Math.round(14 + (234 - 14) * t);
        g = Math.round(168 + (179 - 168) * t);
        b = Math.round(154 + (8 - 154) * t);
      } else {
        const t = (intensity - 0.5) / 0.5;
        r = Math.round(234 + (239 - 234) * t);
        g = Math.round(179 + (68 - 179) * t);
        b = Math.round(8 + (68 - 8) * t);
      }

      // Soft translucency with natural confidence falloff
      const alpha = Math.min(0.55, (0.10 + intensity * 0.42) * cell.confidence);

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

  // Recenter
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

  const csvMin = heatmapData?.stats?.min ?? 25.3;
  const csvMax = heatmapData?.stats?.max ?? 63.1;
  const csvUnit = heatmapData?.unit ?? 'µg/m³';
  const obsUsed = heatmapData?.observations_used ?? currentReading.sample;

  return (
    <div className="absolute inset-0 bg-[#EEF4F8] overflow-hidden select-none rounded-xl">
      
      {/* 1. Google Satellite / 3D Earth Basemap */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0 z-0"
      />

      {/* 2. Real IDW Spatial Field Canvas */}
      {showHeatmap && (
        <canvas 
          ref={canvasOverlayRef} 
          className="w-full h-full absolute inset-0 z-10 pointer-events-none mix-blend-screen"
        />
      )}

    </div>
  );
};
