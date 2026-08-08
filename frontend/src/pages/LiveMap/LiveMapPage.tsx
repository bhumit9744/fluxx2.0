import React, { useEffect } from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { LiveMapHeader } from './LiveMapHeader';
import { MapMetricCards } from './MapMetricCards';
import { LiveMapContainer } from './LiveMapContainer';

export const LiveMapPage: React.FC = () => {
  const { fetchLiveMapData, fetchHeatmap, selectedLayer } = useEnvironmentStore();

  useEffect(() => {
    fetchLiveMapData();
    fetchHeatmap(selectedLayer);
  }, [fetchLiveMapData, fetchHeatmap, selectedLayer]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-3 bg-[#F7F1E8] font-sans select-none">
      
      {/* 1. Header (Compact) */}
      <LiveMapHeader />

      {/* 2. 4 Metric Cards (PM2.5, PM10, CO2, Environmental Risk) */}
      <MapMetricCards />

      {/* 3. Hero 3D Earth Map Viewport (80-85% of screen) */}
      <div className="flex-1 min-h-[400px] w-full relative">
        <LiveMapContainer />
      </div>

    </div>
  );
};
export default LiveMapPage;
