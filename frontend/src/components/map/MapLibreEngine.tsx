import React, { useMemo, useState, useEffect, useRef } from 'react';
import Map, { NavigationControl, GeolocateControl, Source, Layer, Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEnvironmentStore } from '../../stores/environmentStore';
import maplibregl from 'maplibre-gl';

const SATELLITE_STYLE = { 
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
};

interface MapLibreEngineProps {
  onSelectObservation?: (obs: any) => void;
  is3D?: boolean;
}

export const MapLibreEngine: React.FC<MapLibreEngineProps> = ({
  onSelectObservation,
  is3D = false
}) => {
  const {
    allSamples,
    showHeatmap,
    showPath,
    selectedLayer,
    activeSection,
    flightState
  } = useEnvironmentStore();

  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: 73.06907,
    latitude: 19.05028,
    zoom: 14,
    pitch: is3D ? 60 : 0,
    bearing: 0
  });

  // Fit bounds when allSamples changes
  useEffect(() => {
    if (!allSamples || allSamples.length === 0 || !mapRef.current) return;
    const bounds = new maplibregl.LngLatBounds();
    allSamples.forEach(s => {
      bounds.extend([s.location.longitude, s.location.latitude]);
    });
    
    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 16, duration: 1000 });
    }
  }, [allSamples]);

  // Update pitch when is3D changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.easeTo({ pitch: is3D ? 60 : 0, duration: 1000 });
  }, [is3D]);

  const heatmapData = useMemo(() => {
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
          properties: { value: val }
        };
      })
    };
  }, [allSamples, selectedLayer]);

  const pathData = useMemo(() => {
    if (!allSamples || allSamples.length < 2) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: allSamples.map(s => [s.location.longitude, s.location.latitude])
      }
    };
  }, [allSamples]);

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
        ['get', 'value'],
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

  const pathLayerStyle: any = {
    id: 'path-layer',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#F47A24',
      'line-width': 3,
      'line-dasharray': [2, 2]
    }
  };

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#000' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={SATELLITE_STYLE as any}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {showHeatmap && heatmapData && (
          <Source type="geojson" data={heatmapData}>
            <Layer {...heatmapLayerStyle} />
          </Source>
        )}

        {showPath && pathData && (
          <Source type="geojson" data={pathData}>
            <Layer {...pathLayerStyle} />
          </Source>
        )}

        {(activeSection === 'flight-ops' || flightState?.status === 'AIRBORNE') && flightState && (
          <Marker 
            longitude={flightState.longitude} 
            latitude={flightState.latitude} 
            rotation={flightState.heading || 0}
            rotationAlignment="map"
          >
            <div className="vtol-custom-marker">
              <div style={{
                width: '32px', 
                height: '32px', 
                background: 'rgba(244,122,36,0.9)', 
                border: '2px solid white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 4px 12px rgba(244,122,36,0.5)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z"/>
                </svg>
              </div>
            </div>
          </Marker>
        )}
      </Map>
      
      {/* Legend Scale */}
      {showHeatmap && (
        <div className="absolute bottom-6 right-6 z-[1000] bg-[#1E1E1E]/60 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/10 text-white select-none">
          <h4 className="text-[11px] font-bold mb-3 uppercase tracking-wider text-gray-300">
            AQI LEGEND
          </h4>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand-secondary" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="w-16 text-sm font-medium">0 - 50</span>
              <span className="text-sm text-gray-400">Good</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand-warning" style={{ backgroundColor: '#eab308' }}></div>
              <span className="w-16 text-sm font-medium">51 - 100</span>
              <span className="text-sm text-gray-400">Moderate</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand-alert" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="w-16 text-sm font-medium">150+</span>
              <span className="text-sm text-gray-400">Severe</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
