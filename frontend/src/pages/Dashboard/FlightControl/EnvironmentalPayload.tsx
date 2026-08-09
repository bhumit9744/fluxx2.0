import React from 'react';
import { Cpu, Wind, Droplets, Thermometer, Flame } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const EnvironmentalPayload: React.FC = () => {
  const { currentReading } = useEnvironmentStore();

  const sensors = currentReading?.sensors || {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6
  };

  const payloadMetrics = [
    { label: 'PM2.5', val: `${sensors.pm25.toFixed(1)}`, unit: 'µg/m³', isHot: sensors.pm25 >= 60 },
    { label: 'PM10', val: `${sensors.pm10.toFixed(1)}`, unit: 'µg/m³', isHot: false },
    { label: 'CO₂', val: `${Math.round(sensors.co2)}`, unit: 'ppm', isHot: false },
    { label: 'TEMP', val: `${sensors.temperature.toFixed(1)}`, unit: '°C', isHot: false },
    { label: 'HUMIDITY', val: `${sensors.humidity.toFixed(1)}`, unit: '%', isHot: false },
    { label: 'WIND', val: `${sensors.windSpeed.toFixed(1)}`, unit: 'm/s', isHot: false }
  ];

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-5 select-none font-sans flex flex-col justify-between space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#F47A24]" />
          <span className="text-xs font-black text-[#2B211C] uppercase font-mono tracking-wider">
            SENSOR PAYLOAD (ESP32)
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#86EFAC]">
          ACTIVE SENSORS
        </span>
      </div>

      {/* Grid of 6 payload cards */}
      <div className="grid grid-cols-3 gap-2">
        {payloadMetrics.map((p, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-2xl border transition-all ${
              p.isHot
                ? 'bg-[#FFF0E5] border-[#F47A24]/40'
                : 'bg-[#FFF9F2] border-[#F3E6D7]/60'
            }`}
          >
            <span className="text-[9.5px] font-mono font-extrabold text-[#8C827A] block">
              {p.label}
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className={`text-sm font-black font-mono ${p.isHot ? 'text-[#DC2626]' : 'text-[#2B211C]'}`}>
                {p.val}
              </span>
              <span className="text-[9px] text-[#8C827A] font-mono">{p.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Calibration Status */}
      <div className="text-[10px] font-mono text-[#8C827A] flex items-center justify-between pt-1 border-t border-[#FAF3EA]">
        <span>Payload Node: ESP32-S3</span>
        <span className="font-bold text-[#2B211C]">Sample #{currentReading?.sample || 1}</span>
      </div>

    </div>
  );
};
