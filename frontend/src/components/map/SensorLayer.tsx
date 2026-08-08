import React from 'react';
import { NormalizedReading } from '../../types/environment';
import { formatCoordinate, formatTimestamp } from '../../utils/formatters';

interface SensorLayerProps {
  selectedPoint: NormalizedReading | null;
  onClose: () => void;
}

export const SensorLayer: React.FC<SensorLayerProps> = ({ selectedPoint, onClose }) => {
  if (!selectedPoint) return null;

  const s = selectedPoint.sensors;

  return (
    <div className="absolute top-16 right-4 z-30 w-72 rounded-3xl bg-white/90 p-5 shadow-2xl border border-slate-200/80 backdrop-blur-2xl animate-fadeIn text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="font-mono font-bold text-xs text-slate-900">
          SAMPLE #{selectedPoint.sample}
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">PM2.5:</span>
          <span className="font-bold text-slate-900">{s.pm25.toFixed(1)} µg/m³</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">PM10:</span>
          <span className="font-bold text-slate-900">{s.pm10.toFixed(1)} µg/m³</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">CO₂:</span>
          <span className="font-bold text-slate-900">{Math.round(s.co2)} ppm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">TEMP:</span>
          <span className="font-bold text-slate-900">{s.temperature.toFixed(1)} °C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">HUMIDITY:</span>
          <span className="font-bold text-slate-900">{s.humidity.toFixed(1)} %</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">WIND:</span>
          <span className="font-bold text-slate-900">{s.windSpeed.toFixed(1)} m/s</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex justify-between">
        <span>{formatCoordinate(selectedPoint.location.latitude, true)}</span>
        <span>{formatTimestamp(selectedPoint.timestamp)}</span>
      </div>
    </div>
  );
};
