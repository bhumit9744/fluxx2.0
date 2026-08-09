import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Clock, Filter, Layers, Flame, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import Map, { NavigationControl, GeolocateControl, Source, Layer, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { calculateAQI, getAQICategory } from '../../utils/aqiCalculator';

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
  const { fetchLiveMapData, fetchHeatmap, allSamples, currentReading } = useEnvironmentStore();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    fetchLiveMapData();
    fetchHeatmap('pm25'); // default
  }, [fetchLiveMapData, fetchHeatmap]);

  const [viewState, setViewState] = useState({
    longitude: 73.06907, 
    latitude: 19.05028,
    zoom: 14,
    pitch: 45,
    bearing: 0
  });

  const [activeStyle, setActiveStyle] = useState('dark');
  const [showAqiHeatmap, setShowAqiHeatmap] = useState(true);
  const [clickedFeature, setClickedFeature] = useState<any | null>(null);

  // Request live geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setViewState(prev => ({ ...prev, longitude, latitude, zoom: 13 }));
        },
        (error) => {
          console.warn("Geolocation permission denied:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Compute feature collection with AQI and intensity
  const data = useMemo(() => {
    if (!allSamples || allSamples.length === 0) return null;
    return {
      type: 'FeatureCollection' as const,
      features: allSamples.map((s, i) => {
        const pm25 = s.sensors?.pm25 || 0;
        const aqi = calculateAQI(pm25);
        return {
          type: 'Feature' as const,
          id: i, // unique ID for maplibre interactions
          geometry: {
            type: 'Point' as const,
            coordinates: [s.location.longitude, s.location.latitude]
          },
          properties: { 
            aqi: aqi,
            mag: Math.min(aqi / 500, 1), // Normalized intensity 0..1
            timestamp: s.timestamp
          }
        };
      })
    };
  }, [allSamples]);

  const heatmapLayerStyle: any = {
    id: 'aqi-heatmap',
    type: 'heatmap',
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        0, 0,
        1, 1 // max intensity maps to weight 1
      ],
      'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 1,
        17, 3
      ],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 176, 80, 0)',   
        0.1, '#00B050',             // 0-50 Good
        0.2, '#92D050',             // 51-100 Satisfactory
        0.4, '#FFFF00',             // 101-200 Moderate
        0.6, '#FF9900',             // 201-300 Poor
        0.8, '#FF0000',             // 301-400 Very Poor
        1.0, '#C00000'              // 401-500 Severe
      ],
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 15,
        17, 35
      ],
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0.8,
        17, 0.25
      ]
    }
  };

  // Clickable points layer representing the raw sensors
  const pointsLayerStyle: any = {
    id: 'aqi-points',
    type: 'circle',
    source: 'aqi-data',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 2,
        17, 6
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'aqi'],
        50, '#00B050',
        100, '#92D050',
        200, '#FFFF00',
        300, '#FF9900',
        400, '#FF0000',
        500, '#C00000'
      ],
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.9
    }
  };

  const handleMapClick = (event: any) => {
    const feature = event.features && event.features[0];
    if (feature && feature.layer.id === 'aqi-points') {
      setClickedFeature({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
        properties: feature.properties
      });
    } else {
      setClickedFeature(null);
    }
  };

  const currentAqi = currentReading?.sensors?.pm25 ? calculateAQI(currentReading.sensors.pm25) : 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6 bg-[#F7F1E8] font-sans select-none">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Real-Time AQI" value={currentAqi || "—"} color="text-yellow-500" />
        <StatsCard title="PM2.5" value={currentReading?.sensors?.pm25 || "—"} color="text-red-500" />
        <StatsCard title="CO" value={currentReading?.sensors?.co || "0.9"} color="text-green-500" />
        <StatsCard title="NO2" value={currentReading?.sensors?.no2 || "45"} color="text-blue-500" />
      </div>
      
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold mb-1 text-[#2B211C] transition-colors">Live AQI Heatmap</h2>
            <p className="text-[#8C827A] text-sm transition-colors">Real-time spatial interpolation of environmental intelligence.</p>
         </div>
         <div className="flex gap-3">
           
           <button 
             onClick={() => setShowAqiHeatmap(!showAqiHeatmap)}
             className={clsx(
               "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors cursor-pointer shadow-sm text-sm font-bold",
               showAqiHeatmap 
                 ? "bg-[#FFF0E5] border-[#F47A24] text-[#F47A24]" 
                 : "bg-white border-[#F3E6D7] text-[#8C827A] hover:text-[#2B211C]"
             )}
           >
             <Flame className="w-4 h-4" />
             AQI HEATMAP
           </button>

           <div className="relative">
             <select className="bg-white border border-[#F3E6D7] rounded-lg px-4 py-2 text-sm text-[#2B211C] appearance-none focus:outline-none focus:border-[#F47A24] cursor-pointer hover:bg-gray-50 transition-colors pr-10 shadow-sm">
               <option>Last 15 minutes</option>
               <option>Last 1 hour</option>
               <option>Last 24 hours</option>
             </select>
             <Clock className="w-4 h-4 text-[#8C827A] absolute right-3 top-2.5 pointer-events-none transition-colors" />
           </div>
         </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden bg-white/50 backdrop-blur-md border border-[#F3E6D7] p-1.5 flex transition-colors shadow-lg">
        
        <div className="w-full h-full rounded-xl overflow-hidden relative isolate pointer-events-auto bg-black/5">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onClick={handleMapClick}
            interactiveLayerIds={['aqi-points']}
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
                {showAqiHeatmap && <Layer {...heatmapLayerStyle} />}
                <Layer {...pointsLayerStyle} />
              </Source>
            )}

            {/* Sensor Popup Overlay */}
            {clickedFeature && (
              <div className="absolute top-4 right-14 z-20 pointer-events-auto">
                <Card className="p-4 shadow-xl border-[#F47A24]/30 min-w-[220px]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#2B211C] flex items-center gap-1.5 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-[#F47A24]" />
                      Sensor Reading
                    </h3>
                    <button onClick={() => setClickedFeature(null)} className="text-[#8C827A] hover:text-black">✕</button>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8C827A]">AQI:</span>
                      <span className="font-bold text-[#2B211C]">{clickedFeature.properties.aqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C827A]">Category:</span>
                      <span className="font-bold" style={{ color: getAQICategory(clickedFeature.properties.aqi).color }}>
                        {getAQICategory(clickedFeature.properties.aqi).label}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-[#F3E6D7]">
                      <span className="text-[#8C827A] text-xs">Lat:</span>
                      <span className="font-mono text-xs">{clickedFeature.lat.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C827A] text-xs">Lng:</span>
                      <span className="font-mono text-xs">{clickedFeature.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C827A] text-xs">Updated:</span>
                      <span className="text-xs">{new Date(clickedFeature.properties.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Map>
        </div>

        {/* Floating Legends */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-none z-10">
          <Card className="!p-5 !rounded-2xl border-[#F3E6D7] bg-white/95 backdrop-blur-xl pointer-events-auto shadow-xl">
             <h4 className="text-[11px] font-bold uppercase tracking-wider mb-4 text-[#8C827A] transition-colors">AQI</h4>
             <div className="flex flex-col gap-3">
                {[
                  { range: '0–50', label: 'Good', color: 'bg-[#00B050]' },
                  { range: '51–100', label: 'Satisfactory', color: 'bg-[#92D050]' },
                  { range: '101–200', label: 'Moderate', color: 'bg-[#FFFF00]' },
                  { range: '201–300', label: 'Poor', color: 'bg-[#FF9900]' },
                  { range: '301–400', label: 'Very Poor', color: 'bg-[#FF0000]' },
                  { range: '401–500', label: 'Severe', color: 'bg-[#C00000]' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-4 text-sm">
                     <span className={clsx("w-3 h-3 rounded-full shadow-sm border border-black/10", l.color)}></span>
                     <span className="w-16 font-mono font-bold text-[#2B211C]">{l.range}</span>
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
