import React from "react";
import { useFluxxStore } from "@/store/useFluxxStore";
import dynamic from "next/dynamic";

const ProductCanvas = dynamic(
  () => import("@/components/ProductCanvas").then((mod) => mod.ProductCanvas),
  { ssr: false }
);

export function MissionsView() {
  const { droneStatus } = useFluxxStore();

  return (
    <div className="w-full h-full p-8 pl-32 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <header className="flex items-center justify-between bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-3xl p-6">
        <div>
          <h2 className="text-xs font-semibold text-fluxx-teal tracking-widest uppercase mb-1">Active Mission</h2>
          <h1 className="text-3xl font-medium text-fluxx-text tracking-tight">KHARGHAR SURVEY</h1>
          <p className="text-fluxx-muted font-mono mt-1 text-sm">VTOL-001</p>
        </div>

        <div className="flex items-center gap-2 bg-fluxx-teal/10 px-4 py-2 rounded-full border border-fluxx-teal/20">
          <div className="w-2 h-2 rounded-full bg-fluxx-teal animate-pulse" />
          <span className="text-sm font-semibold text-fluxx-teal tracking-widest uppercase">
            {droneStatus.status}
          </span>
        </div>
      </header>

      {/* Main Telemetry & Map Split */}
      <div className="flex-1 grid grid-cols-12 gap-6">
        
        {/* Left: Telemetry Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] p-8 flex-1 flex flex-col justify-center">
            
            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
              <TelemetryBox label="ALT" value={`${droneStatus.altitude.toFixed(1)}m`} />
              <TelemetryBox label="SPEED" value={`${droneStatus.speed.toFixed(1)}m/s`} />
              <TelemetryBox label="BATTERY" value={`${droneStatus.battery}%`} />
              <TelemetryBox label="COVERAGE" value={`${droneStatus.coverage}%`} />
            </div>

          </div>
        </div>

        {/* Right: 3D Map / Tracker */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <div className="flex-1 bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] overflow-hidden relative flex">
            {/* 3D Map representing VTOL location */}
            <div className="absolute inset-0 bg-[#E8EEF6]">
              {/* Using a higher progress value to show the drone tracking / flight mode */}
              <ProductCanvas progress={0.5} isDark={false} />
            </div>

            <div className="absolute bottom-6 right-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm flex flex-col items-end pointer-events-none">
              <span className="text-sm font-medium text-fluxx-text">3D MAP</span>
              <span className="text-xs text-fluxx-muted">Live Tracking 🚁</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function TelemetryBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[2.5rem] font-light text-fluxx-text leading-none">{value}</span>
      <span className="text-sm font-semibold text-fluxx-muted tracking-widest uppercase">{label}</span>
    </div>
  );
}
