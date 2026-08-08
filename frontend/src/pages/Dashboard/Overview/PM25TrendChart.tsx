import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const PM25TrendChart: React.FC = () => {
  const { dashboardData, timeFilter, setTimeFilter } = useEnvironmentStore();
  const trendData = dashboardData?.trend || [];
  const filters: ('6H' | '12H' | '24H' | '7D' | '30D')[] = ['6H', '12H', '24H', '7D', '30D'];

  // Custom Tooltip Matching Warm Theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-2xl bg-white border border-[#F3E6D7] shadow-[0_10px_30px_rgba(70,40,20,0.15)] select-none">
          <div className="text-[11px] font-bold text-[#8C827A] mb-1">
            Time: {data.time} {data.timestamp ? `(${data.timestamp.substring(0, 10)})` : ''}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F47A24]"></span>
            <span className="text-[15px] font-extrabold text-[#2B211C]">
              {payload[0].value} µg/m³
            </span>
          </div>
          {data.isPeak && (
            <div className="mt-1 text-[10px] font-extrabold text-[#E55353] uppercase tracking-wider">
              ★ Peak Hotspot Concentration
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-[20px] bg-white border border-[#F3E6D7] shadow-[0_12px_35px_rgba(70,40,20,0.06)] p-5 flex flex-col justify-between h-[340px] select-none">
      
      {/* Header Bar with Time Range Buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F9F3EA]">
        <div>
          <h2 className="text-[16px] font-extrabold text-[#2B211C] tracking-tight">
            PM2.5 Trend
          </h2>
          <p className="text-[12px] text-[#8C827A] font-medium mt-0.5">
            Temporal concentration curve & peak surge intervals
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF3EA] border border-[#F3E6D7] text-[11px] font-bold">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === f
                  ? 'bg-white text-[#F47A24] shadow-xs font-extrabold'
                  : 'text-[#8C827A] hover:text-[#2B211C]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full mt-2 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F47A24" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F47A24" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE1" vertical={false} />

            <XAxis 
              dataKey="time" 
              tickLine={false} 
              axisLine={{ stroke: '#F3E6D7' }}
              tick={{ fill: '#8C827A', fontSize: 11, fontWeight: 500 }}
            />

            <YAxis 
              domain={[0, 'dataMax + 15']} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#8C827A', fontSize: 11, fontWeight: 500 }}
              unit=" µg"
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="pm25"
              stroke="#F47A24"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#pm25Gradient)"
              activeDot={{ r: 6, fill: '#F47A24', stroke: '#FFFFFF', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
