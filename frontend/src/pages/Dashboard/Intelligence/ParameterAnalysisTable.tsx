import React from 'react';
import { Table, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ParameterAnalysisTable: React.FC = () => {
  const { currentReading } = useEnvironmentStore();

  const sensors = currentReading?.sensors || {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6
  };

  const rows = [
    {
      param: 'PM2.5',
      unit: 'µg/m³',
      avg: '42.8',
      peak: '63.1',
      trend: '+8.2%',
      trendDir: 'up',
      status: 'Elevated'
    },
    {
      param: 'PM10',
      unit: 'µg/m³',
      avg: '69.4',
      peak: '115.3',
      trend: '+4.1%',
      trendDir: 'up',
      status: 'Moderate'
    },
    {
      param: 'CO₂',
      unit: 'ppm',
      avg: '548.0',
      peak: '612.0',
      trend: '+1.2%',
      trendDir: 'up',
      status: 'Nominal'
    },
    {
      param: 'Temperature',
      unit: '°C',
      avg: '27.4',
      peak: '29.2',
      trend: '+0.4°',
      trendDir: 'up',
      status: 'Nominal'
    },
    {
      param: 'Humidity',
      unit: '%',
      avg: '78.2',
      peak: '84.1',
      trend: '-2.1%',
      trendDir: 'down',
      status: 'High'
    },
    {
      param: 'Wind Velocity',
      unit: 'm/s',
      avg: '2.8',
      peak: '4.2',
      trend: '0.0%',
      trendDir: 'flat',
      status: 'Stagnant'
    }
  ];

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              Parameter Analysis
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              Statistical Summary Across 300 Observations
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-[#8C827A]">
          6 Parameters
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#FAF3EA] text-[#8C827A] text-[10px] uppercase">
              <th className="pb-2 font-bold">Parameter</th>
              <th className="pb-2 font-bold text-center">Average</th>
              <th className="pb-2 font-bold text-center">Peak</th>
              <th className="pb-2 font-bold text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF3EA]">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#FFFDF9] transition-colors">
                <td className="py-2.5 font-bold text-[#2B211C] flex items-center space-x-1">
                  <span>{r.param}</span>
                  <span className="text-[10px] text-[#8C827A] font-normal font-sans">({r.unit})</span>
                </td>
                <td className="py-2.5 text-center text-[#2B211C] font-semibold">{r.avg}</td>
                <td className="py-2.5 text-center text-[#F47A24] font-bold">{r.peak}</td>
                <td className="py-2.5 text-right font-bold">
                  <span className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10.5px] ${
                    r.trendDir === 'up' ? 'text-[#DC2626] bg-[#FEE2E2]' :
                    r.trendDir === 'down' ? 'text-[#16A34A] bg-[#DCFCE7]' :
                    'text-[#8C827A] bg-[#FAF3EA]'
                  }`}>
                    {r.trendDir === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                    {r.trendDir === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                    {r.trendDir === 'flat' && <Minus className="w-2.5 h-2.5" />}
                    <span>{r.trend}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#FAF3EA] text-[10.5px] text-[#8C827A] font-mono flex items-center justify-between">
        <span>Calibration Confidence:</span>
        <span className="font-bold text-[#2B211C]">98.7% Certified</span>
      </div>

    </div>
  );
};
