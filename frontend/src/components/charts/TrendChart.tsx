import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const TrendChart: React.FC = () => {
  const { currentReading, allSamples, seekSample } = useEnvironmentStore();

  const samples = allSamples.length > 0 ? allSamples : [currentReading];
  const chartData = samples.map((s) => ({
    sample: s.sample,
    pm25: s.sensors.pm25,
    timestamp: s.timestamp
  }));

  return (
    <div className="p-5 rounded-3xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#DDF6F2] text-[#0EA89A]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-900">
              Environmental Trend (PM2.5)
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              Real-time sequence of 50 physical observations
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xl font-bold text-slate-900">{currentReading.sensors.pm25.toFixed(1)}</span>
          <span className="text-xs text-[#0EA89A] ml-1 font-semibold">µg/m³</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length) {
                seekSample(e.activePayload[0].payload.sample);
              }
            }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA89A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0EA89A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="sample" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs shadow-xl">
                      <div>Sample #{payload[0].payload.sample}</div>
                      <div className="text-[#3DD6C6] font-bold">{payload[0].value} µg/m³</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={50} stroke="#D95353" strokeDasharray="3 3" label={{ value: 'Limit: 50', fill: '#D95353', fontSize: 10 }} />
            <ReferenceLine x={currentReading.sample} stroke="#0EA89A" strokeWidth={2} />
            <Area type="monotone" dataKey="pm25" stroke="#0EA89A" strokeWidth={2.5} fillOpacity={1} fill="url(#trendGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
        <span>SAMPLE #01</span>
        <span className="text-[#0EA89A] font-bold">CLICK POINT TO SEEK</span>
        <span>SAMPLE #50</span>
      </div>
    </div>
  );
};
