import React from "react";
import { useFluxxStore } from "@/store/useFluxxStore";
import { FileDown, Map } from "lucide-react";

export function ReportsView() {
  const { telemetry, eriScore, activeEvent } = useFluxxStore();
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full h-full p-8 pl-32 flex flex-col gap-6 max-w-5xl mx-auto">
      
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-fluxx-text tracking-wide uppercase">Reports</h2>
        <button className="flex items-center gap-2 bg-fluxx-teal text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-fluxx-teal/90 transition-colors">
          <FileDown size={18} />
          GENERATE PDF
        </button>
      </header>

      {/* A4 Document Preview */}
      <div className="flex-1 bg-white shadow-xl border border-gray-200 rounded-lg p-12 max-w-3xl mx-auto w-full flex flex-col relative overflow-y-auto">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-fluxx-text pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fluxx-text tracking-widest uppercase">FLUXX</h1>
            <p className="text-fluxx-muted mt-1 font-mono">Environmental Intelligence Report</p>
          </div>
          <div className="text-right">
            <p className="text-fluxx-text font-medium text-lg">Kharghar Survey</p>
            <p className="text-fluxx-muted font-mono">{dateStr}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-fluxx-text mb-4 uppercase tracking-wide">Executive Summary</h2>
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-fluxx-muted uppercase tracking-widest mb-1">Overall ERI</p>
              <p className="text-4xl font-light text-fluxx-text">{eriScore} / 100</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-fluxx-muted uppercase tracking-widest mb-1">Status</p>
              <p className={`text-xl font-medium mt-2 ${activeEvent?.active ? 'text-fluxx-warning' : 'text-fluxx-teal'}`}>
                {activeEvent?.active ? 'Moderate Risk Detected' : 'All Systems Nominal'}
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Snapshot */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-fluxx-text mb-4 uppercase tracking-wide">Telemetry Snapshot</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-fluxx-muted uppercase tracking-widest">Metric</th>
                <th className="py-3 px-4 text-sm font-semibold text-fluxx-muted uppercase tracking-widest">Recorded Value</th>
                <th className="py-3 px-4 text-sm font-semibold text-fluxx-muted uppercase tracking-widest">Threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-fluxx-text font-medium">PM2.5</td>
                <td className="py-3 px-4 text-fluxx-text font-mono">{telemetry.pm25.toFixed(2)} µg/m³</td>
                <td className="py-3 px-4 text-fluxx-muted font-mono">50.0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-fluxx-text font-medium">PM10</td>
                <td className="py-3 px-4 text-fluxx-text font-mono">{telemetry.pm10.toFixed(2)} µg/m³</td>
                <td className="py-3 px-4 text-fluxx-muted font-mono">100.0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-fluxx-text font-medium">CO₂</td>
                <td className="py-3 px-4 text-fluxx-text font-mono">{telemetry.co2.toFixed(0)} ppm</td>
                <td className="py-3 px-4 text-fluxx-muted font-mono">1000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-fluxx-text font-medium">Temperature</td>
                <td className="py-3 px-4 text-fluxx-text font-mono">{telemetry.temperature.toFixed(1)} °C</td>
                <td className="py-3 px-4 text-fluxx-muted font-mono">--</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Map Placeholder */}
        <div className="mt-auto">
          <h2 className="text-xl font-semibold text-fluxx-text mb-4 uppercase tracking-wide">Survey Map</h2>
          <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <Map size={32} className="mb-2" />
            <span className="font-mono text-sm">[ Map Static Render Placed Here ]</span>
          </div>
        </div>

      </div>
    </div>
  );
}
