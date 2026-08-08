import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useEnvironmentStore, LayerType } from '../../stores/environmentStore';

export const ComparisonChart: React.FC = () => {
  const { allSamples, currentReading } = useEnvironmentStore();
  const [activeParam, setActiveParam] = useState<LayerType>('pm25');

  const samples = allSamples.length > 0 ? allSamples : [currentReading];
  const chartData = samples.map((s) => ({
    sample: s.sample,
    value: s.sensors[activeParam]
  }));

  const paramColors: Record<LayerType, string> = {
    pm25: '#0EA89A',
    pm10: '#E6A23C',
    co2: '#6366F1',
    temperature: '#EC4899',
    humidity: '#3B82F6',
    windSpeed: '#10B981'
  };

  return (
    <div className="p-5 rounded-3xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-[#E6A23C]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-900">
              Parameter Comparison
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              Switch multi-sensor streams
            </p>
          </div>
        </div>

        {/* Layer Toggle Strip */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {(['pm25', 'pm10', 'co2', 'temperature', 'humidity', 'windSpeed'] as LayerType[]).map((p) => (
            <button
              key={p}
              onClick={() => setActiveParam(p)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                activeParam === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="sample" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs shadow-xl">
                      <div>Sample #{payload[0].payload.sample}</div>
                      <div className="font-bold text-amber-300">
                        {payload[0].value} {activeParam === 'co2' ? 'ppm' : activeParam === 'temperature' ? '°C' : activeParam === 'humidity' ? '%' : 'µg/m³'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={paramColors[activeParam]}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
