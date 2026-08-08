import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEnvironmentStore } from '../../stores/environmentStore';

export const ForecastChart: React.FC = () => {
  const { history } = useEnvironmentStore();

  const data = history.slice(-20).map((h, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Number(h.sensors.pm25.toFixed(1))
  }));

  const cur = data.length > 0 ? data[data.length - 1].value : 48.5;

  return (
    <div className="bg-white dark:bg-[#0D131C] border border-[#DDE5E2] dark:border-slate-800 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,33,38,0.05)] space-y-4 transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-6">
        <div>
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
            PM2.5 ENVIRONMENTAL TREND
          </h2>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{cur.toFixed(1)} µg/m³ <span className="text-sm font-medium text-[#0A9F91]">↑ 8.2%</span></div>
        </div>
        <div className="text-[10px] font-mono text-slate-400 font-bold border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-[10px] bg-slate-50 dark:bg-slate-800/50">
          24H · 300 OBSERVATIONS
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A9F91" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#0A9F91" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDE5E2" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#718087" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              fontFamily="IBM Plex Mono"
            />
            <YAxis 
              stroke="#718087" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}`}
              fontFamily="IBM Plex Mono"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDE5E2', borderRadius: '12px', boxShadow: '0 4px 20px rgba(20,33,38,0.05)', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
              itemStyle={{ color: '#0A9F91', fontWeight: 'bold' }}
              labelStyle={{ color: '#475569', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0A9F91" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTeal)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
