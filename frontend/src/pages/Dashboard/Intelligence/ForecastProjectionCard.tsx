import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Sparkles, Info, TrendingUp } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ForecastProjectionCard: React.FC = () => {
  const { currentReading } = useEnvironmentStore();

  const data = [
    { time: '12:00', actual: 54.2, projected: null },
    { time: '13:00', actual: 61.8, projected: 61.8 },
    { time: '14:00', actual: 58.4, projected: 58.4 },
    { time: '15:00', actual: 48.5, projected: 48.5 },
    { time: '16:00', actual: null, projected: 41.2 },
    { time: '17:00', actual: null, projected: 36.0 },
    { time: '18:00', actual: null, projected: 32.5 }
  ];

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              PM2.5 Modeled Projection
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              +3H Physics-Informed Neural Forecast
            </p>
          </div>
        </div>

        <span className="text-[9.5px] font-extrabold font-mono text-[#8C827A] bg-[#FAF3EA] px-2 py-0.5 rounded-md border border-[#F3E6D7]">
          MODELLED PROJECTION
        </span>
      </div>

      {/* Projection Chart */}
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FAF3EA" vertical={false} />
            <XAxis dataKey="time" stroke="#8C827A" fontSize={10} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
            <YAxis stroke="#8C827A" fontSize={10} tickLine={false} axisLine={false} fontFamily="IBM Plex Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #F3E6D7',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'IBM Plex Mono'
              }}
            />
            {/* Measured Actual */}
            <Line type="monotone" dataKey="actual" name="Measured (µg/m³)" stroke="#F47A24" strokeWidth={2.5} dot={{ r: 3, fill: '#F47A24' }} />
            {/* Modelled Forecast */}
            <Line type="monotone" dataKey="projected" name="Projected (µg/m³)" stroke="#3FA66B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#3FA66B' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Verification Notice */}
      <div className="pt-2 border-t border-[#FAF3EA] text-[10px] text-[#8C827A] flex items-center justify-between font-mono">
        <div className="flex items-center space-x-1">
          <Info className="w-3 h-3 text-[#F47A24]" />
          <span>Modelled projection, not measured data</span>
        </div>
        <span className="text-[#3FA66B] font-bold">Advection Clearance Expected</span>
      </div>

    </div>
  );
};
