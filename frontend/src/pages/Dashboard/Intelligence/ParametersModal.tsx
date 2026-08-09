import React from 'react';
import { X, Activity, Wind, Droplets, Thermometer, Gauge, Sparkles } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

interface ParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParametersModal: React.FC<ParametersModalProps> = ({ isOpen, onClose }) => {
  const { currentReading, dashboardData } = useEnvironmentStore();

  if (!isOpen) return null;

  const sensors = currentReading?.sensors || {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6
  };

  const paramList = [
    {
      id: 'pm25',
      name: 'Fine Particulate Matter (PM2.5)',
      symbol: 'PM2.5',
      value: sensors.pm25.toFixed(1),
      unit: 'µg/m³',
      threshold: '< 35.0 µg/m³ (WHO Daily)',
      status: sensors.pm25 > 50 ? 'ELEVATED' : sensors.pm25 > 35 ? 'MODERATE' : 'OPTIMAL',
      statusColor: sensors.pm25 > 50 ? 'text-[#DC2626] bg-[#FEE2E2]' : sensors.pm25 > 35 ? 'text-[#F47A24] bg-[#FFF0E5]' : 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Respirable airborne particles ≤ 2.5 micrometers in aerodynamic diameter, capable of deep pulmonary penetration.',
      icon: Activity
    },
    {
      id: 'pm10',
      name: 'Coarse Particulate Matter (PM10)',
      symbol: 'PM10',
      value: sensors.pm10.toFixed(1),
      unit: 'µg/m³',
      threshold: '< 50.0 µg/m³ (WHO Daily)',
      status: sensors.pm10 > 100 ? 'ELEVATED' : sensors.pm10 > 50 ? 'MODERATE' : 'OPTIMAL',
      statusColor: sensors.pm10 > 100 ? 'text-[#DC2626] bg-[#FEE2E2]' : sensors.pm10 > 50 ? 'text-[#F47A24] bg-[#FFF0E5]' : 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Inhalable particulate matter comprising road dust, industrial pulverization, and pollen.',
      icon: Activity
    },
    {
      id: 'co2',
      name: 'Carbon Dioxide (CO₂)',
      symbol: 'CO₂',
      value: sensors.co2.toFixed(1),
      unit: 'ppm',
      threshold: '< 600 ppm (Ambient Urban)',
      status: sensors.co2 > 700 ? 'HIGH' : 'NOMINAL',
      statusColor: sensors.co2 > 700 ? 'text-[#F47A24] bg-[#FFF0E5]' : 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Atmospheric greenhouse tracer indicating combustion emissions and enclosed vehicular accumulation.',
      icon: Gauge
    },
    {
      id: 'temperature',
      name: 'Ambient Temperature',
      symbol: 'TEMP',
      value: sensors.temperature.toFixed(1),
      unit: '°C',
      threshold: '18°C – 32°C (Thermal Comfort)',
      status: 'NOMINAL',
      statusColor: 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Thermodynamic surface temperature driving thermal updrafts and atmospheric boundary layer expansion.',
      icon: Thermometer
    },
    {
      id: 'humidity',
      name: 'Relative Humidity',
      symbol: 'RH',
      value: sensors.humidity.toFixed(1),
      unit: '%',
      threshold: '40% – 70% (Comfort Range)',
      status: sensors.humidity > 75 ? 'HIGH' : 'NOMINAL',
      statusColor: sensors.humidity > 75 ? 'text-[#F47A24] bg-[#FFF0E5]' : 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Water vapor saturation promoting hygroscopic growth of secondary particulate matter.',
      icon: Droplets
    },
    {
      id: 'windSpeed',
      name: 'Surface Wind Velocity',
      symbol: 'WIND',
      value: sensors.windSpeed.toFixed(1),
      unit: 'm/s',
      threshold: '> 3.0 m/s (Active Advection)',
      status: sensors.windSpeed < 2.0 ? 'STAGNANT' : 'DISPERSING',
      statusColor: sensors.windSpeed < 2.0 ? 'text-[#DC2626] bg-[#FEE2E2]' : 'text-[#16A34A] bg-[#DCFCE7]',
      desc: 'Horizontal advection velocity governing atmospheric pollutant dispersion and regional transport.',
      icon: Wind
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B211C]/60 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[28px] bg-[#FAF6F0] border border-[#F3E6D7] shadow-[0_24px_64px_rgba(43,33,28,0.25)] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-[#F3E6D7] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2B211C] tracking-tight">
                Comprehensive Environmental Telemetry
              </h2>
              <p className="text-xs font-mono text-[#8C827A]">
                6 Monitored Parameters · Calibrated Real-Time Sensor Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paramList.map((param) => {
              const Icon = param.icon;
              return (
                <div
                  key={param.id}
                  className="rounded-2xl bg-white/80 border border-[#F3E6D7] p-5 shadow-xs hover:border-[#F47A24]/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2B211C]">{param.name}</div>
                        <div className="text-[10px] font-mono text-[#8C827A]">{param.symbol}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md ${param.statusColor}`}>
                      {param.status}
                    </span>
                  </div>

                  <div className="my-3 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-[#2B211C] font-mono">{param.value}</span>
                    <span className="text-xs font-mono text-[#8C827A]">{param.unit}</span>
                  </div>

                  <p className="text-[11px] text-[#8C827A] leading-relaxed mb-2">
                    {param.desc}
                  </p>

                  <div className="pt-2 border-t border-[#F8EFE4] text-[10px] font-mono text-[#8C827A] flex items-center justify-between">
                    <span>Baseline Reference:</span>
                    <span className="font-bold text-[#2B211C]">{param.threshold}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white/90 backdrop-blur-xl border-t border-[#F3E6D7] flex items-center justify-between text-xs text-[#8C827A] font-mono shrink-0">
          <span>Kharghar Municipal Sensor Mesh · Replay Synchronized</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#F47A24] hover:bg-[#E06815] text-white font-extrabold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
