import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine
} from 'recharts';
import { useEnvironmentStore } from '../../stores/environmentStore';

type Parameter = 'pm25' | 'pm10' | 'co2' | 'temperature';

export const AnalyticsGraphCard: React.FC = () => {
  const { currentReading, allSamples } = useEnvironmentStore();
  const [param, setParam] = useState<Parameter>('pm25');

  const samples = allSamples.length > 0 ? allSamples : [currentReading];

  const trendData = useMemo(() => {
    return samples.map((s) => ({
      sample: s.sample,
      value: s.sensors[param]
    }));
  }, [samples, param]);

  const paramConfig = {
    pm25: { label: 'PM2.5 TREND', unit: 'µg/m³', color: 'url(#orangeCoral)', threshold: 50 },
    pm10: { label: 'PM10 TREND', unit: 'µg/m³', color: 'url(#orangeCoral)', threshold: 100 },
    co2: { label: 'CO₂ TREND', unit: 'ppm', color: 'url(#orangeCoral)', threshold: 1000 },
    temperature: { label: 'TEMP TREND', unit: '°C', color: 'url(#orangeCoral)', threshold: 35 }
  };

  const config = paramConfig[param];
  const lastVal = trendData[trendData.length - 1]?.value || 0;

  return (
    <div className="w-full bg-white border border-[var(--fluxx-border)] rounded-2xl shadow-[var(--fluxx-shadow-card)] p-6 select-none font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-sm text-[var(--fluxx-text)] tracking-wider uppercase">
            {config.label}
          </h3>
          <p className="text-[11px] text-[var(--fluxx-muted)] font-mono mt-1 uppercase tracking-widest">
            {config.unit} · 24H LIVE DATA
          </p>
        </div>

        {/* Small controls */}
        <div className="flex items-center space-x-2">
          {(Object.keys(paramConfig) as Parameter[]).map((key) => (
            <button
              key={key}
              onClick={() => setParam(key)}
              className={`px-3 py-1.5 rounded-[8px] text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${
                param === key 
                  ? 'bg-[var(--fluxx-orange)] text-white' 
                  : 'bg-white border border-[var(--fluxx-border)] text-[var(--fluxx-muted)] hover:text-[var(--fluxx-text)]'
              }`}
            >
              {key === 'temperature' ? 'TEMP' : key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Area */}
      <div className="h-56 relative -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="orangeCoral" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--fluxx-orange)" />
                <stop offset="100%" stopColor="var(--fluxx-coral)" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="sample" 
              axisLine={{ stroke: '#E4E9ED' }}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#7A858C', fontFamily: '"IBM Plex Mono", monospace' }}
              tickFormatter={(v) => `0${v % 24}:00`}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#7A858C', fontFamily: '"IBM Plex Mono", monospace' }}
              width={35}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--fluxx-text)', 
                border: 'none', 
                borderRadius: '8px', 
                color: 'white',
                fontSize: '11px',
                fontFamily: '"IBM Plex Mono", monospace'
              }}
              itemStyle={{ color: 'white' }}
              formatter={(value: any) => [`${value} ${config.unit}`, config.label]}
              labelFormatter={(label) => `Sample #${label}`}
              cursor={{ stroke: 'var(--fluxx-border)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <ReferenceLine 
              y={config.threshold} 
              stroke="var(--fluxx-critical)" 
              strokeDasharray="3 3" 
              strokeWidth={1}
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#172027', stroke: '#172027' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Floating Latest Value */}
        <div className="absolute right-0 top-0 flex items-center space-x-1.5 px-3 py-1 bg-white border border-[#172027] rounded-full shadow-sm z-10 translate-x-1/4 -translate-y-1/2">
          <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: config.color }} />
          <span className="font-mono text-[10px] font-bold text-[#172027]">Live: {lastVal.toFixed(1)}</span>
        </div>
      </div>
      
    </div>
  );
};
