import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Clock, Filter, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import Map, { NavigationControl, GeolocateControl, Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEnvironmentStore } from '../../stores/environmentStore';
import maplibregl from 'maplibre-gl';

const StatsCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#F3E6D7] shadow-sm flex flex-col gap-1 transition-all hover:shadow-md">
    <span className="text-[#8C827A] text-[11px] font-bold uppercase tracking-wider">{title}</span>
    <span className={`text-3xl font-bold font-mono ${color}`}>{value}</span>
  </div>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={clsx("bg-white/90 backdrop-blur-md rounded-2xl border border-[#F3E6D7] shadow-sm", className)}>
    {children}
  </div>
);

const MAP_STYLES: Record<string, any> = {
  dark: { name: 'Dark Theme', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  light: { name: 'Light Theme', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  satellite: { 
    name: 'Satellite', 
    url: {
      version: 8,
      sources: {
        "esri-satellite": {
          type: "raster",
          tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
          tileSize: 256,
          attribution: "&copy; Esri, Maxar, Earthstar Geographics"
        }
      },
      layers: [
        {
          id: "satellite",
          type: "raster",
          source: "esri-satellite",
          minzoom: 0,
          maxzoom: 22
        }
      ]
    }
  }
};

export const LiveMapPage: React.FC = () => {
  const { fetchLiveMapData, fetchHeatmap, selectedLayer, allSamples, currentReading } = useEnvironmentStore();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    fetchLiveMapData();
    fetchHeatmap(selectedLayer);
  }, [fetchLiveMapData, fetchHeatmap, selectedLayer]);

  const [viewState, setViewState] = useState({
    longitude: 73.06907, 
    latitude: 19.05028,
    zoom: 14,
    pitch: 45,
    bearing: 0
  });

  const [activeStyle, setActiveStyle] = useState('dark');

  // Request live geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          // Fly to the new location smoothly
          setViewState(prev => ({ ...prev, longitude, latitude, zoom: 13 }));
        },
        (error) => {
          console.warn("Geolocation permission denied or unavailable:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Compute heatmap data dynamically from allSamples instead of mock
  const data = useMemo(() => {
    if (!allSamples || allSamples.length === 0) return null;
    return {
      type: 'FeatureCollection' as const,
      features: allSamples.map(s => {
        let val = 0;
        if (selectedLayer === 'pm25') val = s.sensors?.pm25 || 0;
        else if (selectedLayer === 'pm10') val = s.sensors?.pm10 || 0;
        else if (selectedLayer === 'co2') val = s.sensors?.co2 || 400;
        else if (selectedLayer === 'temperature') val = s.sensors?.temperature || 25;
        else if (selectedLayer === 'humidity') val = s.sensors?.humidity || 50;
        else if (selectedLayer === 'windSpeed') val = s.sensors?.windSpeed || 0;
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [s.location.longitude, s.location.latitude]
          },
          properties: { mag: val } // using 'mag' to match the FluxMap.jsx paint properties
        };
      })
    };
  }, [allSamples, selectedLayer]);

  let maxVal = 100;
  if (selectedLayer === 'co2') maxVal = 800;
  else if (selectedLayer === 'pm10') maxVal = 150;

  const heatmapLayerStyle: any = {
    id: 'aqi-heatmap',
    type: 'heatmap',
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        0, 0,
        maxVal, 1
      ],
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 1,
        15, 3
      ],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(34, 197, 94, 0)', 
        0.2, '#22c55e',            
        0.5, '#eab308',            
        0.8, '#ef4444',            
        1, '#ffffff'               
      ],
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 15,
        15, 40
      ],
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0.8,
        18, 0.4
      ]
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6 bg-[#F7F1E8] font-sans select-none">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="AQI" value={currentReading?.sensors?.pm25 ? Math.round(currentReading.sensors.pm25 * 1.5) : "—"} color="text-yellow-500" />
        <StatsCard title="PM2.5" value={currentReading?.sensors?.pm25 || "—"} color="text-red-500" />
        <StatsCard title="CO" value={currentReading?.sensors?.co || "0.9"} color="text-green-500" />
        <StatsCard title="NO2" value={currentReading?.sensors?.no2 || "45"} color="text-blue-500" />
      </div>
      
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold mb-1 text-[#2B211C] transition-colors">Live Flux Map</h2>
            <p className="text-[#8C827A] text-sm transition-colors">Real-time volumetric mapping powered by MapLibre GL.</p>
         </div>
         <div className="flex gap-3">
           <div className="relative">
             <select className="bg-white border border-[#F3E6D7] rounded-lg px-4 py-2 text-sm text-[#2B211C] appearance-none focus:outline-none focus:border-[#F47A24] cursor-pointer hover:bg-gray-50 transition-colors pr-10 shadow-sm">
               <option>Last 15 minutes</option>
               <option>Last 1 hour</option>
               <option>Last 24 hours</option>
             </select>
             <Clock className="w-4 h-4 text-[#8C827A] absolute right-3 top-2.5 pointer-events-none transition-colors" />
           </div>
           <button className="p-2 bg-white border border-[#F3E6D7] rounded-lg hover:bg-gray-50 text-[#8C827A] hover:text-[#F47A24] transition-colors cursor-pointer shadow-sm">
             <Filter className="w-4 h-4" />
           </button>
         </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-[#F3E6D7] p-1.5 flex transition-colors shadow-lg">
        
        <div className="w-full h-full rounded-xl overflow-hidden relative isolate pointer-events-auto bg-black/5">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle={MAP_STYLES[activeStyle].url}
            attributionControl={true}
          >
            <NavigationControl position="top-right" />
            <GeolocateControl position="top-right" positionOptions={{ enableHighAccuracy: true }} trackUserLocation={true} />
            
            {/* Map Style Toggle */}
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F3E6D7] shadow-md">
              <div className="flex items-center px-2 mr-1">
                 <Layers className="w-4 h-4 text-[#8C827A]" />
              </div>
              {Object.entries(MAP_STYLES).map(([key, style]) => (
                 <button 
                    key={key}
                    onClick={() => setActiveStyle(key)}
                    className={clsx(
                      "px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer",
                      activeStyle === key 
                        ? "bg-[#F47A24] text-white shadow-sm" 
                        : "text-[#8C827A] hover:text-[#2B211C] hover:bg-black/5"
                    )}
                 >
                    {style.name}
                 </button>
              ))}
            </div>

            {data && (
              <Source type="geojson" data={data}>
                <Layer {...heatmapLayerStyle} />
              </Source>
            )}
          </Map>
        </div>

        {/* Floating Legends */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-10">
          <Card className="!p-5 !rounded-2xl border-[#F3E6D7] bg-white/95 backdrop-blur-xl pointer-events-auto shadow-xl">
             <h4 className="text-[11px] font-bold uppercase tracking-wider mb-4 text-[#8C827A] transition-colors">AQI Legend</h4>
             <div className="flex flex-col gap-3">
                {[
                  { range: '0 - 50', label: 'Good', color: 'bg-green-500' },
                  { range: '51 - 100', label: 'Moderate', color: 'bg-yellow-500' },
                  { range: '150+', label: 'Severe', color: 'bg-red-500' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-4 text-sm">
                     <span className={clsx("w-3 h-3 rounded-full shadow-sm", l.color)}></span>
                     <span className="w-20 font-mono font-bold text-[#2B211C]">{l.range}</span>
                     <span className="text-[#8C827A] font-semibold">{l.label}</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveMapPage;
