import React from "react";
import { useFluxxStore } from "@/store/useFluxxStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";

const ProductCanvas = dynamic(
  () => import("@/components/ProductCanvas").then((mod) => mod.ProductCanvas),
  { ssr: false }
);

export function OverviewView() {
  const { telemetry, eriScore, activeEvent, isConnected, dataSource } = useFluxxStore();

  return (
    <div className="w-full h-full p-8 pl-32 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-fluxx-text tracking-tight">FLUXX</h1>
          <p className="text-fluxx-muted font-medium mt-1">Environmental Intelligence</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/60 shadow-sm">
          <span className="text-fluxx-text font-medium tracking-wide">KHARGHAR</span>
          <div className="w-1 h-1 rounded-full bg-fluxx-muted/30" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-fluxx-teal animate-pulse' : 'bg-fluxx-warning'}`} />
            <span className="text-sm font-semibold text-fluxx-teal tracking-widest uppercase">
              {isConnected ? dataSource : "Connecting..."}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 mt-4">
        {/* Left Column: ERI & 3D Viewer */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] overflow-hidden relative flex">
            
            {/* ERI Score Card overlay */}
            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white max-w-[200px]">
              <div className="text-[4rem] font-light leading-none text-fluxx-text mb-2">
                {eriScore}
                <span className="text-xl text-fluxx-muted font-normal">/100</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-fluxx-warning/10 text-fluxx-warning rounded-full font-medium text-sm">
                MODERATE
              </div>
            </div>

            {/* Embed the 3D Map / Drone snippet */}
            <div className="absolute inset-0 bg-[#E8EEF6]">
              {/* ProductCanvas needs light mode now */}
              <ProductCanvas progress={0.05} isDark={false} />
            </div>

            <div className="absolute bottom-6 right-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm flex flex-col items-end pointer-events-none">
              <span className="text-sm font-medium text-fluxx-text">3D ENVIRONMENT</span>
              <span className="text-xs text-fluxx-muted">Sensors + Heatmap + Path</span>
            </div>
          </div>
        </div>

        {/* Right Column: Event Alert */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] p-8 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-fluxx-muted tracking-widest uppercase mb-6">Status</h3>
            
            {activeEvent && activeEvent.active ? (
              <div className="flex flex-col gap-4 mt-auto">
                <div className="w-12 h-12 bg-fluxx-critical/10 rounded-2xl flex items-center justify-center text-fluxx-critical mb-2">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-2xl font-medium text-fluxx-text leading-tight">
                  Active environmental event
                </h4>
                <p className="text-fluxx-muted text-lg">{activeEvent.type}</p>
                <button className="mt-4 bg-fluxx-text text-white px-6 py-3 rounded-xl font-medium hover:bg-fluxx-text/90 transition-colors w-full text-center">
                  Review Event
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-auto">
                <div className="w-12 h-12 bg-fluxx-teal/10 rounded-2xl flex items-center justify-center text-fluxx-teal mb-2">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-2xl font-medium text-fluxx-text leading-tight">
                  All systems nominal
                </h4>
                <p className="text-fluxx-muted text-lg">No active anomalies detected in the sector.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-sm rounded-3xl p-6 flex items-center justify-between gap-4 overflow-x-auto">
        <MetricBox label="PM2.5" value={telemetry.pm25.toFixed(1)} />
        <div className="w-[1px] h-10 bg-fluxx-muted/20" />
        <MetricBox label="PM10" value={telemetry.pm10.toFixed(1)} />
        <div className="w-[1px] h-10 bg-fluxx-muted/20" />
        <MetricBox label="CO₂" value={telemetry.co2.toFixed(0)} />
        <div className="w-[1px] h-10 bg-fluxx-muted/20" />
        <MetricBox label="TEMP" value={`${telemetry.temperature.toFixed(1)}°`} />
        <div className="w-[1px] h-10 bg-fluxx-muted/20" />
        <MetricBox label="HUMIDITY" value={`${telemetry.humidity.toFixed(1)}%`} />
        <div className="w-[1px] h-10 bg-fluxx-muted/20" />
        <MetricBox label="WIND" value={`${telemetry.wind.toFixed(1)} m/s`} />
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <span className="text-xs font-semibold text-fluxx-muted tracking-widest uppercase">{label}</span>
      <span className="text-2xl font-medium text-fluxx-text">{value}</span>
    </div>
  );
}
