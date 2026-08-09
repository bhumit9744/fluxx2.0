import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { MapLibreEngine } from './MapLibreEngine';

export const EarthMap: React.FC<{ isOverview?: boolean }> = ({
  isOverview = false
}) => {
  const { is3DMode } = useEnvironmentStore();

  return (
    <div className="relative w-full h-full bg-[#1C1613] overflow-hidden select-none">
      {/* Primary Map Tile Engine with custom Heatmap Overlay built-in */}
      <MapLibreEngine is3D={is3DMode} />
    </div>
  );
};
