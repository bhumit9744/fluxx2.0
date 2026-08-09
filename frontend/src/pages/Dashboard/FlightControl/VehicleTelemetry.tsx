import React from 'react';
import { Gauge, ArrowUpRight, Battery, Radio, Wifi, Navigation } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const VehicleTelemetry: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  const alt = flightState?.altitude || 42.0;
  const speed = flightState?.airspeed || 12.4;
  const heading = Math.round(flightState?.heading || 218);
  const battery = flightState?.battery || 82;

  const telemetryItems = [
    { label: 'ALTITUDE', value: `${alt.toFixed(1)} m`, sub: 'AGL Barometric' },
    { label: 'GROUND SPEED', value: `${speed.toFixed(1)} m/s`, sub: 'GPS Calculated' },
    { label: 'VERTICAL SPEED', value: '+0.8 m/s', sub: 'Climb Rate' },
    { label: 'HEADING', value: `${heading}°`, sub: 'Magnetic Compass' },
    { label: 'BATTERY', value: `${battery.toFixed(0)}%`, sub: '22.8V 6S LiPo' },
    { label: 'GPS', value: '14 satellites', sub: 'RTK Fix 3D' },
    { label: 'SIGNAL RSSI', value: '94%', sub: '2.4GHz Telemetry' }
  ];

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 space-y-3.5 select-none font-sans flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            VEHICLE TELEMETRY
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#3FA66B] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#86EFAC]">
          10 HZ STREAM
        </span>
      </div>

      {/* Grid of Telemetry Values */}
      <div className="space-y-2.5">
        {telemetryItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#FFF9F2] border border-[#F3E6D7]/60">
            <div>
              <span className="text-[10px] font-mono font-extrabold text-[#8C827A] block">
                {item.label}
              </span>
              <span className="text-[9.5px] text-[#A0958C] font-mono">
                {item.sub}
              </span>
            </div>
            <span className="text-sm font-black font-mono text-[#2B211C]">
              {item.value}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
