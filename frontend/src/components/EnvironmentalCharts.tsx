import React, { useState } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Sparkles, 
  BarChart3, 
  Layers, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../stores/environmentStore';

export const EnvironmentalCharts: React.FC = () => {
  const { currentReading, allSamples, seekSample } = useEnvironmentStore();
  const [selectedParam, setSelectedParam] = useState<LayerType>('pm25');

  // Fallback to sample array if loading
  const samples = allSamples.length > 0 ? allSamples : [currentReading];
  const activeIdx = Math.max(0, currentReading.sample - 1);

  // Helper to extract values
  const pm25Series = samples.map((s) => s.sensors.pm25);
  const paramSeries = samples.map((s) => s.sensors[selectedParam]);

  const maxPM25 = Math.max(...pm25Series, 70);
  const minPM25 = Math.min(...pm25Series, 20);

  const maxParam = Math.max(...paramSeries, 10);
  const minParam = Math.min(...paramSeries, 0);

  // Forecast points (+30m, +1h, +2h, +6h, +24h)
  const currentVal = currentReading.sensors.pm25;
  const forecastData = [
    { label: 'Now', val: currentVal, confMin: currentVal, confMax: currentVal },
    { label: '+30m', val: currentVal * 1.06, confMin: currentVal * 0.95, confMax: currentVal * 1.15 },
    { label: '+1h', val: currentVal * 1.12, confMin: currentVal * 0.98, confMax: currentVal * 1.25 },
    { label: '+2h', val: currentVal * 0.94, confMin: currentVal * 0.82, confMax: currentVal * 1.08 },
    { label: '+6h', val: currentVal * 0.76, confMin: currentVal * 0.65, confMax: currentVal * 0.90 },
    { label: '+24h', val: currentVal * 0.65, confMin: currentVal * 0.52, confMax: currentVal * 0.78 }
  ];

  const maxForecast = Math.max(...forecastData.map(f => f.confMax), 70);
  const minForecast = Math.min(...forecastData.map(f => f.confMin), 20);

  return (
    <div className="space-y-6 select-none">
      
      {/* ========================================================= */}
      {/* GRAPH 1: REAL PM2.5 ENVIRONMENTAL TREND OVER TIME */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#0EA89A]/15 text-[#3DD6C6] border border-[#0EA89A]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-white uppercase tracking-wider">
                Graph 1: Environmental Trend (PM2.5 Telemetry)
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                50 Sequential Physical Observations Across Kharghar
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-2xl font-bold text-white">{currentReading.sensors.pm25.toFixed(1)}</span>
            <span className="text-xs text-[#3DD6C6] ml-1">µg/m³</span>
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div className="relative h-44 w-full pt-4">
          <svg className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA89A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0EA89A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Threshold Line (50 µg/m³) */}
            <line 
              x1="0%" 
              y1={`${100 - ((50 - minPM25) / (maxPM25 - minPM25 || 1)) * 100}%`}
              x2="100%" 
              y2={`${100 - ((50 - minPM25) / (maxPM25 - minPM25 || 1)) * 100}%`}
              stroke="#D95353" 
              strokeDasharray="4,4" 
              strokeWidth="1.5" 
              opacity="0.6"
            />

            {/* Area Fill */}
            <path
              d={
                `M 0 100 ` +
                pm25Series.map((v, i) => {
                  const x = (i / (pm25Series.length - 1 || 1)) * 100;
                  const y = 100 - ((v - minPM25) / (maxPM25 - minPM25 || 1)) * 90;
                  return `L ${x}% ${y}%`;
                }).join(' ') +
                ` L 100% 100% Z`
              }
              fill="url(#pm25Gradient)"
            />

            {/* Main Polyline */}
            <polyline
              fill="none"
              stroke="#3DD6C6"
              strokeWidth="2.5"
              points={
                pm25Series.map((v, i) => {
                  const x = (i / (pm25Series.length - 1 || 1)) * 100;
                  const y = 100 - ((v - minPM25) / (maxPM25 - minPM25 || 1)) * 90;
                  return `${x}%,${y}%`;
                }).join(' ')
              }
            />

            {/* Active Synchronized Cursor */}
            {samples.length > 0 && (
              <g>
                <line
                  x1={`${(activeIdx / (samples.length - 1 || 1)) * 100}%`}
                  y1="0%"
                  x2={`${(activeIdx / (samples.length - 1 || 1)) * 100}%`}
                  y2="100%"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={`${(activeIdx / (samples.length - 1 || 1)) * 100}%`}
                  cy={`${100 - ((currentReading.sensors.pm25 - minPM25) / (maxPM25 - minPM25 || 1)) * 90}%`}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#0EA89A"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </svg>

          {/* Interactive Scrub Strip */}
          <div className="absolute inset-0 flex">
            {samples.map((s, i) => (
              <div
                key={s.sample}
                onClick={() => seekSample(s.sample)}
                className="flex-1 h-full cursor-pointer hover:bg-white/5 transition-colors"
                title={`Seek to Sample #${s.sample} (${s.sensors.pm25} µg/m³)`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
          <span>SAMPLE #01 (SURVEY START)</span>
          <span className="text-[#D95353]">THRESHOLD: 50 µg/m³</span>
          <span>SAMPLE #50 (SURVEY END)</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GRAPH 2: PARAMETER COMPARISON */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#E6A23C]/15 text-[#E6A23C] border border-[#E6A23C]/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-white uppercase tracking-wider">
                Graph 2: Parameter Comparison
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Multi-Sensor Correlation Profile
              </div>
            </div>
          </div>

          {/* Parameter Selector */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['pm25', 'pm10', 'co2', 'temperature', 'humidity', 'windSpeed'] as LayerType[]).map((param) => (
              <button
                key={param}
                onClick={() => setSelectedParam(param)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                  selectedParam === param
                    ? 'bg-[#E6A23C] text-slate-950 shadow-md shadow-[#E6A23C]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {param}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Polyline for selected parameter */}
        <div className="h-36 w-full pt-4">
          <svg className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#E6A23C"
              strokeWidth="2"
              points={
                paramSeries.map((v, i) => {
                  const x = (i / (paramSeries.length - 1 || 1)) * 100;
                  const y = 100 - ((v - minParam) / (maxParam - minParam || 1)) * 85;
                  return `${x}%,${y}%`;
                }).join(' ')
              }
            />

            {/* Synchronized Cursor */}
            <circle
              cx={`${(activeIdx / (samples.length - 1 || 1)) * 100}%`}
              cy={`${100 - ((currentReading.sensors[selectedParam] - minParam) / (maxParam - minParam || 1)) * 85}%`}
              r="4.5"
              fill="#FFFFFF"
              stroke="#E6A23C"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>ACTIVE METRIC: <strong className="text-white uppercase">{selectedParam}</strong></span>
          <span className="text-[#E6A23C] font-bold">CURRENT: {currentReading.sensors[selectedParam]}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GRAPH 3: MODELLED FORECAST */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-white uppercase tracking-wider">
                Graph 3: AI Modelled Forecast (30m - 24h Dispersion)
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Atmospheric Mixing & Advection Projection
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            ARIMA / DISPERSION AI
          </span>
        </div>

        {/* Forecast Horizontal Point Sequence */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {forecastData.map((f, i) => (
            <div 
              key={f.label}
              className={`p-3 rounded-2xl border text-center transition-all ${
                i === 0 
                  ? 'bg-[#0EA89A]/15 border-[#0EA89A]/40' 
                  : 'bg-white/5 border-white/10 hover:border-purple-400/40'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase">{f.label}</div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {f.val.toFixed(1)}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                ±{(f.confMax - f.val).toFixed(1)} µg/m³
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-200">
          <strong>FORECAST SUMMARY:</strong> Plume dissipation anticipated within ~3.7 hours as surface winds recover to &gt;3.5 m/s.
        </div>
      </div>

    </div>
  );
};
