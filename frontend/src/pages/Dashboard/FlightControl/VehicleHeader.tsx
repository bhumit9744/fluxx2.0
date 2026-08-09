import React from 'react';
import { Plane, Radio, Battery, Wifi, Clock, ShieldCheck } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const VehicleHeader: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 select-none font-sans flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Left: Vehicle ID & Link Statuses */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#F47A24] to-[#FF9F5A] text-white flex items-center justify-center font-bold shadow-xs">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-black text-[#2B211C] tracking-tight font-mono">
              VTOL-001
            </div>
            <div className="text-[10.5px] font-mono text-[#8C827A]">
              Autonomous Environmental Aerial Node
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-[#F3E6D7] hidden md:block" />

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
          {/* Connected */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>CONNECTED</span>
          </div>

          {/* GPS Lock */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]">
            <Radio className="w-3.5 h-3.5" />
            <span>GPS 3D LOCK (14 SAT)</span>
          </div>

          {/* Telemetry Live */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#FFF0E5] text-[#F47A24] border border-[#F47A24]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TELEMETRY LIVE</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Vitals Strip */}
      <div className="flex items-center space-x-4 text-xs font-mono">
        {/* Battery */}
        <div className="flex items-center space-x-1.5 bg-[#FAF3EA] px-3 py-1.5 rounded-xl border border-[#F3E6D7]">
          <Battery className="w-4 h-4 text-[#F47A24]" />
          <div>
            <span className="text-[10px] text-[#8C827A] block leading-none">BATTERY</span>
            <span className="font-extrabold text-[#2B211C]">{flightState?.battery?.toFixed(0) || 82}%</span>
          </div>
        </div>

        {/* Signal RSSI */}
        <div className="flex items-center space-x-1.5 bg-[#FAF3EA] px-3 py-1.5 rounded-xl border border-[#F3E6D7]">
          <Wifi className="w-4 h-4 text-[#3FA66B]" />
          <div>
            <span className="text-[10px] text-[#8C827A] block leading-none">SIGNAL</span>
            <span className="font-extrabold text-[#2B211C]">94%</span>
          </div>
        </div>

        {/* Elapsed Flight Time */}
        <div className="flex items-center space-x-1.5 bg-[#FAF3EA] px-3 py-1.5 rounded-xl border border-[#F3E6D7]">
          <Clock className="w-4 h-4 text-[#8C827A]" />
          <div>
            <span className="text-[10px] text-[#8C827A] block leading-none">FLIGHT TIME</span>
            <span className="font-extrabold text-[#2B211C]">14:32</span>
          </div>
        </div>
      </div>

    </div>
  );
};
