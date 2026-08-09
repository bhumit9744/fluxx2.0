import React from "react";
import { useFluxxStore } from "@/store/useFluxxStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dynamic from "next/dynamic";

const ProductCanvas = dynamic(
  () => import("@/components/ProductCanvas").then((mod) => mod.ProductCanvas),
  { ssr: false }
);

// Mock historical data for the chart, ideally this comes from backend too
const mockHistory = [
  { time: "08:00", pm25: 35, pm10: 60 },
  { time: "09:00", pm25: 38, pm10: 65 },
  { time: "10:00", pm25: 42, pm10: 70 },
  { time: "11:00", pm25: 48, pm10: 75 },
  { time: "12:00", pm25: 55, pm10: 82 },
  { time: "13:00", pm25: 61, pm10: 85 },
  { time: "14:00", pm25: 48.5, pm10: 77.3 },
];

export function EnvironmentView() {
  const { telemetry } = useFluxxStore();

  return (
    <div className="w-full h-full p-8 pl-32 flex flex-col gap-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-fluxx-text tracking-wide uppercase">Environment</h2>
        <span className="text-fluxx-text font-medium tracking-widest uppercase">KHARGHAR</span>
      </header>

      {/* Hero 3D Section */}
      <div className="flex-1 bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] overflow-hidden relative flex">
        
        {/* Left Side Menu */}
        <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white w-64 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-fluxx-muted tracking-widest uppercase mb-1">Metrics</h3>
            <MetricRow label="PM2.5" value={telemetry.pm25} active />
            <MetricRow label="PM10" value={telemetry.pm10} />
            <MetricRow label="CO₂" value={telemetry.co2} />
            <MetricRow label="Temperature" value={telemetry.temperature} />
            <MetricRow label="Humidity" value={telemetry.humidity} />
            <MetricRow label="Wind" value={telemetry.wind} />
          </div>

          <div className="w-full h-[1px] bg-fluxx-muted/20" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-fluxx-muted tracking-widest uppercase mb-1">Layers</h3>
            <ToggleRow label="Sensors" active={true} />
            <ToggleRow label="Heatmap" active={true} />
            <ToggleRow label="Path" active={true} />
          </div>
        </div>

        {/* 3D Earth / Map Embed */}
        <div className="absolute inset-0 bg-[#E8EEF6]">
          <ProductCanvas progress={0.15} isDark={false} />
        </div>
      </div>

      {/* Bottom Chart & Telemetry Strip */}
      <div className="bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] p-6 flex flex-col gap-6 h-64">
        <div className="flex items-center justify-between gap-4 overflow-x-auto px-2">
          <MiniMetric label="PM2.5" value={telemetry.pm25.toFixed(1)} />
          <MiniMetric label="PM10" value={telemetry.pm10.toFixed(1)} />
          <MiniMetric label="CO₂" value={telemetry.co2.toFixed(0)} />
          <MiniMetric label="TEMP" value={`${telemetry.temperature.toFixed(1)}°`} />
          <MiniMetric label="WIND" value={`${telemetry.wind.toFixed(1)}`} />
        </div>

        {/* Recharts Timeline */}
        <div className="flex-1 w-full relative">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={mockHistory}>
               <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#718087', fontSize: 12 }} 
                  dy={10}
                />
               <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
               <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
               />
               <Line type="monotone" dataKey="pm25" stroke="#0EA89A" strokeWidth={3} dot={{ r: 4, fill: '#0EA89A', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, active = false }: { label: string; value: number; active?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${active ? 'text-fluxx-teal font-medium' : 'text-fluxx-text'}`}>
      <span>{label}</span>
    </div>
  );
}

function ToggleRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 text-fluxx-text">
      <div className={`w-5 h-5 rounded flex items-center justify-center ${active ? 'bg-fluxx-teal text-white' : 'bg-fluxx-muted/20'}`}>
        {active && <span className="text-xs">✓</span>}
      </div>
      <span>{label}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-fluxx-muted tracking-widest uppercase">{label}</span>
      <span className="text-lg font-medium text-fluxx-text">{value}</span>
    </div>
  );
}
