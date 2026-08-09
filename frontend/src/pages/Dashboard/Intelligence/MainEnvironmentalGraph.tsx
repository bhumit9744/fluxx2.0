import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { Layers, Clock, GitCompare, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../../stores/environmentStore';

export const MainEnvironmentalGraph: React.FC = () => {
  const { allSamples, currentReading, seekSample } = useEnvironmentStore();

  const [selectedParam, setSelectedParam] = useState<string>('pm25');
  const [timeRange, setTimeRange] = useState<string>('24H');
  const [compareMode, setCompareMode] = useState<string>('none');

  const paramConfig: Record<string, { label: string; unit: string; color: string; fillId: string }> = {
    pm25: { label: 'PM2.5', unit: 'µg/m³', color: '#F47A24', fillId: 'gradPM25' },
    pm10: { label: 'PM10', unit: 'µg/m³', color: '#E06815', fillId: 'gradPM10' },
    co2: { label: 'CO₂', unit: 'ppm', color: '#3FA66B', fillId: 'gradCO2' },
    temperature: { label: 'Temperature', unit: '°C', color: '#EA580C', fillId: 'gradTemp' },
    humidity: { label: 'Humidity', unit: '%', color: '#0284C7', fillId: 'gradHum' },
    windSpeed: { label: 'Wind Velocity', unit: 'm/s', color: '#8B5CF6', fillId: 'gradWind' }
  };

  // Compare config
  const comparePairs: Record<string, { primary: string; secondary: string; label: string }> = {
    'pm25_pm10': { primary: 'pm25', secondary: 'pm10', label: 'PM2.5 vs PM10' },
    'temp_hum': { primary: 'temperature', secondary: 'humidity', label: 'Temperature vs Humidity' },
    'pm25_wind': { primary: 'pm25', secondary: 'windSpeed', label: 'PM2.5 vs Wind Velocity' }
  };

  // Build chart dataset
  const chartData = useMemo(() => {
    const raw = allSamples && allSamples.length > 0 ? allSamples : [];
    if (raw.length === 0) {
      // Fallback synthetic dataset for preview if samples are initializing
      return Array.from({ length: 24 }).map((_, i) => ({
        index: i + 1,
        time: `${(6 + Math.floor(i / 2)).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
        pm25: 35 + Math.sin(i / 3) * 18 + (i === 13 ? 24 : 0),
        pm10: 55 + Math.sin(i / 3) * 25 + (i === 13 ? 35 : 0),
        co2: 450 + Math.cos(i / 4) * 80,
        temperature: 24 + (i * 0.4),
        humidity: 85 - (i * 0.8),
        windSpeed: 2.2 + Math.sin(i / 2) * 1.4
      }));
    }

    // Filter by timeRange if needed
    let sliced = raw;
    if (timeRange === '6H') sliced = raw.slice(0, Math.min(raw.length, 12));
    else if (timeRange === '12H') sliced = raw.slice(0, Math.min(raw.length, 25));

    return sliced.map((s, idx) => {
      const timeStr = s.timestamp ? s.timestamp.substring(11, 16) : `${(6 + Math.floor(idx / 2)).toString().padStart(2, '0')}:${idx % 2 === 0 ? '00' : '30'}`;
      return {
        index: s.sample || (idx + 1),
        time: timeStr,
        pm25: Number((s.sensors?.pm25 ?? 48.5).toFixed(1)),
        pm10: Number((s.sensors?.pm10 ?? 77.3).toFixed(1)),
        co2: Number((s.sensors?.co2 ?? 558.8).toFixed(1)),
        temperature: Number((s.sensors?.temperature ?? 28.1).toFixed(1)),
        humidity: Number((s.sensors?.humidity ?? 80.1).toFixed(1)),
        windSpeed: Number((s.sensors?.windSpeed ?? 2.6).toFixed(1))
      };
    });
  }, [allSamples, timeRange]);

  const activePrimary = compareMode !== 'none' && comparePairs[compareMode]
    ? comparePairs[compareMode].primary
    : selectedParam;

  const activeSecondary = compareMode !== 'none' && comparePairs[compareMode]
    ? comparePairs[compareMode].secondary
    : null;

  const currentSampleIndex = currentReading?.sample || 1;
  const currentItem = chartData.find(d => d.index === currentSampleIndex) || chartData[0];
  const peakItem = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((prev, curr) => (curr.pm25 > prev.pm25 ? curr : prev), chartData[0]);
  }, [chartData]);

  const handleChartClick = (e: any) => {
    if (e && e.activePayload && e.activePayload[0]) {
      const targetIndex = e.activePayload[0].payload.index;
      seekSample(targetIndex);
    }
  };

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-5 select-none font-sans">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#FAF3EA] pb-5">
        
        {/* Title & Active Metric */}
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-[#2B211C] tracking-tight">
              Environmental Trend
            </h2>
            {peakItem && (
              <span className="flex items-center space-x-1 text-[10px] font-extrabold text-[#DC2626] font-mono bg-[#FEE2E2] px-2 py-0.5 rounded-md">
                <AlertTriangle className="w-3 h-3" />
                <span>Peak {peakItem.pm25} µg/m³ @ {peakItem.time}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#8C827A] font-medium mt-0.5">
            Continuous calibrated time series · Click anywhere on graph to scrub timeline
          </p>
        </div>

        {/* Graph Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Parameter Selector */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7] text-xs font-bold text-[#2B211C]">
            <Layers className="w-3.5 h-3.5 text-[#F47A24]" />
            <span className="text-[10px] font-mono text-[#8C827A] uppercase">PARAM:</span>
            <select
              value={selectedParam}
              disabled={compareMode !== 'none'}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="bg-transparent font-extrabold text-[#2B211C] focus:outline-none cursor-pointer text-xs"
            >
              <option value="pm25">PM2.5</option>
              <option value="pm10">PM10</option>
              <option value="co2">CO₂</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="windSpeed">Wind Velocity</option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7] text-xs font-bold text-[#2B211C]">
            <Clock className="w-3.5 h-3.5 text-[#F47A24]" />
            <span className="text-[10px] font-mono text-[#8C827A] uppercase">RANGE:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent font-extrabold text-[#2B211C] focus:outline-none cursor-pointer text-xs"
            >
              <option value="6H">6 HOURS</option>
              <option value="12H">12 HOURS</option>
              <option value="24H">24 HOURS</option>
              <option value="ALL">ALL DATASET</option>
            </select>
          </div>

          {/* Compare Selector */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7] text-xs font-bold text-[#2B211C]">
            <GitCompare className="w-3.5 h-3.5 text-[#F47A24]" />
            <span className="text-[10px] font-mono text-[#8C827A] uppercase">COMPARE:</span>
            <select
              value={compareMode}
              onChange={(e) => setCompareMode(e.target.value)}
              className="bg-transparent font-extrabold text-[#2B211C] focus:outline-none cursor-pointer text-xs"
            >
              <option value="none">None</option>
              <option value="pm25_pm10">PM2.5 vs PM10</option>
              <option value="temp_hum">Temperature vs Humidity</option>
              <option value="pm25_wind">PM2.5 vs Wind</option>
            </select>
          </div>

        </div>

      </div>

      {/* Hero Graph Canvas */}
      <div className="h-72 w-full pt-2 cursor-crosshair relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onClick={handleChartClick}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* PM2.5 Gradient */}
              <linearGradient id="gradPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F47A24" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F47A24" stopOpacity={0.0} />
              </linearGradient>
              {/* PM10 Gradient */}
              <linearGradient id="gradPM10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E06815" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E06815" stopOpacity={0.0} />
              </linearGradient>
              {/* CO2 Gradient */}
              <linearGradient id="gradCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3FA66B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3FA66B" stopOpacity={0.0} />
              </linearGradient>
              {/* Temp Gradient */}
              <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
              </linearGradient>
              {/* Humidity Gradient */}
              <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
              </linearGradient>
              {/* Wind Gradient */}
              <linearGradient id="gradWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F3E6D7" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#8C827A"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#F3E6D7' }}
              fontFamily="IBM Plex Mono"
            />

            <YAxis
              yAxisId="primary"
              stroke="#8C827A"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              fontFamily="IBM Plex Mono"
              tickFormatter={(val) => `${val}`}
            />

            {activeSecondary && (
              <YAxis
                yAxisId="secondary"
                orientation="right"
                stroke="#8C827A"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                fontFamily="IBM Plex Mono"
                tickFormatter={(val) => `${val}`}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #F3E6D7',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(43, 33, 28, 0.1)',
                fontFamily: 'IBM Plex Mono',
                fontSize: '12px'
              }}
              labelStyle={{ color: '#2B211C', fontWeight: 'bold', marginBottom: '4px' }}
            />

            {/* Current Scrubbed Position Line */}
            {currentItem && (
              <ReferenceLine
                x={currentItem.time}
                stroke="#2B211C"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `◉ ${currentItem.time}`,
                  position: 'top',
                  fill: '#2B211C',
                  fontSize: 10,
                  fontFamily: 'IBM Plex Mono',
                  fontWeight: 'bold'
                }}
              />
            )}

            {/* Peak Anomaly Marker */}
            {peakItem && (
              <ReferenceDot
                x={peakItem.time}
                y={peakItem.pm25}
                yAxisId="primary"
                r={5}
                fill="#DC2626"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            )}

            {/* Primary Area */}
            <Area
              yAxisId="primary"
              type="monotone"
              dataKey={activePrimary}
              name={paramConfig[activePrimary]?.label || activePrimary}
              stroke={paramConfig[activePrimary]?.color || '#F47A24'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${paramConfig[activePrimary]?.fillId || 'gradPM25'})`}
            />

            {/* Secondary Comparison Line */}
            {activeSecondary && (
              <Line
                yAxisId="secondary"
                type="monotone"
                dataKey={activeSecondary}
                name={paramConfig[activeSecondary]?.label || activeSecondary}
                stroke={paramConfig[activeSecondary]?.color || '#0284C7'}
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
