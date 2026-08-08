import React from 'react';

export const SceneData: React.FC = () => {
  const metrics = [
    { label: 'PM2.5 PARTICULATE', val: '48.5', unit: 'µg/m³', desc: 'Respirable dust concentration' },
    { label: 'PM10 COARSE', val: '77.3', unit: 'µg/m³', desc: 'Atmospheric particulate matter' },
    { label: 'CO₂ LEVEL', val: '559', unit: 'ppm', desc: 'Ambient carbon density' },
    { label: 'TEMPERATURE', val: '28.1', unit: '°C', desc: 'Surface boundary layer' }
  ];

  return (
    <div className="scene-container flex flex-col items-center justify-center text-center px-6 relative z-10">
      <div className="max-w-4xl w-full space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#3DD6C6] uppercase tracking-widest font-bold">
            PHASE 02 / REAL PHYSICAL TELEMETRY
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            High-Fidelity Sensor Observations
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center space-y-2 hover:border-[#3DD6C6]/40 transition-all"
            >
              <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase">{m.label}</div>
              <div className="font-mono text-4xl font-black text-white">{m.val}</div>
              <div className="text-xs font-mono text-[#3DD6C6] font-bold">{m.unit}</div>
              <div className="text-[10px] text-slate-500 font-mono">{m.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
