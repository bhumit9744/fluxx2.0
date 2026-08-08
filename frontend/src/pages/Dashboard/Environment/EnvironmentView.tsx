import React from 'react';
import { EarthMap } from '../../../components/map/EarthMap';
import { AnalyticsGraphCard } from '../../../components/charts/AnalyticsGraphCard';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const EnvironmentView: React.FC = () => {
  const { 
    currentReading, 
    selectedLayer, 
    setSelectedLayer,
    showSensors, setShowSensors,
    showHeatmap, setShowHeatmap,
    showPath, setShowPath,
    is3DMode, setIs3DMode
  } = useEnvironmentStore();

  const parameters = [
    { id: 'pm25', label: 'PM2.5', max: 80, current: currentReading.sensors.pm25, unit: 'µg/m³' },
    { id: 'pm10', label: 'PM10', max: 120, current: currentReading.sensors.pm10, unit: 'µg/m³' },
    { id: 'co2', label: 'CO₂', max: 800, current: currentReading.sensors.co2, unit: 'ppm' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 h-[calc(100vh-100px)] font-sans pb-4">
      
      {/* Main Map Zone */}
      <div className="xl:col-span-3 relative bg-white border border-[#E4E9ED] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Unified Top Controls Panel */}
        <div className="absolute top-5 left-5 z-10 w-64 bg-white border border-[#E4E9ED] rounded-xl p-4 shadow-md">
          <div className="text-[10px] font-bold text-[#172027] tracking-widest font-mono uppercase mb-4">MAP CONTROLS</div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#172027]">3D Perspective</span>
              <input type="checkbox" checked={is3DMode} onChange={(e) => setIs3DMode(e.target.checked)} className="w-4 h-4 accent-[#0EA89A]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#172027]">Sensors</span>
              <input type="checkbox" checked={showSensors} onChange={(e) => setShowSensors(e.target.checked)} className="w-4 h-4 accent-[#0EA89A]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#172027]">Heatmap</span>
              <input type="checkbox" checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} className="w-4 h-4 accent-[#0EA89A]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#172027]">Survey Path</span>
              <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} className="w-4 h-4 accent-[#0EA89A]" />
            </div>
          </div>

          <div className="w-full h-px bg-[#E4E9ED] my-4" />

          <div className="space-y-1">
            {['pm25', 'pm10', 'co2', 'temperature'].map((p) => (
              <button 
                key={p}
                onClick={() => setSelectedLayer(p as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-colors ${
                  selectedLayer === p ? 'bg-[#172027] text-white' : 'text-[#7A858C] hover:bg-[#EEF4F8] hover:text-[#172027]'
                }`}
              >
                {p === 'temperature' ? 'TEMP' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[300px] bg-white border border-[#E4E9ED] rounded-xl p-3 shadow-md text-center">
          <div className="flex justify-between text-[10px] font-mono font-bold text-[#7A858C] uppercase mb-1">
            <span>LOW</span>
            <span>{selectedLayer === 'pm25' ? 'PM2.5' : selectedLayer === 'pm10' ? 'PM10' : 'CO2'}</span>
            <span>HIGH</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 mb-1" />
          <div className="flex justify-between text-[9px] font-mono text-[#7A858C]">
            <span>18 µg/m³</span>
            <span>63 µg/m³</span>
          </div>
        </div>

        <div className="flex-1 relative">
          <EarthMap />
        </div>
      </div>

      {/* Right Intelligence Column */}
      <div className="space-y-5 flex flex-col h-full overflow-y-auto pr-1">
        
        {/* Trend Graph */}
        <AnalyticsGraphCard />

        {/* Parameter Comparison */}
        <div className="bg-white border border-[#E4E9ED] rounded-2xl shadow-sm p-6 flex-1">
          <div className="text-xs font-bold text-[#172027] uppercase tracking-wider mb-6">
            PARAMETER COMPARISON
          </div>

          <div className="space-y-6">
            {parameters.map(param => (
              <div key={param.id}>
                <div className="flex items-end justify-between mb-2">
                  <div className="text-[11px] font-bold text-[#172027] uppercase font-mono">{param.label}</div>
                  <div className="text-[10px] font-mono text-[#7A858C]">
                    <span className="text-sm font-black text-[#172027] mr-1">{param.current.toFixed(1)}</span>
                    {param.unit}
                  </div>
                </div>
                {/* Progress bar representing current vs max */}
                <div className="w-full h-1.5 bg-[#EEF4F8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#172027] rounded-full" 
                    style={{ width: `${Math.min(100, (param.current / param.max) * 100)}%` }} 
                  />
                </div>
                {param.id === 'pm25' && (
                  <div className="mt-1.5">
                    <div className="flex justify-between text-[9px] font-mono text-[#7A858C] uppercase mb-1">
                      <span>Reference (15 µg/m³)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EEF4F8] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#7A858C] rounded-full opacity-40" 
                        style={{ width: `${(15 / param.max) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
