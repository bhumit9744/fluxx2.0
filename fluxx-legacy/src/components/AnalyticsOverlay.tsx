"use client";

import { Activity, Droplets, TrendingUp, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";

interface AnalyticsOverlayProps {
  onContinue: () => void;
}

export function AnalyticsOverlay({ onContinue }: AnalyticsOverlayProps) {
  const metrics = [
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      value: "85%",
      label: "Chemical Reduction",
      sub: "Targeted nano-urea stomata delivery eliminates broadcast runoff",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      value: "+28%",
      label: "Crop Yield Surge",
      sub: "Immediate recovery of nitrogen-deficient foliage clusters",
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      value: "90%",
      label: "Water Conserved",
      sub: "30-micron electrostatic mist vs conventional flood irrigation",
    },
    {
      icon: <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      value: "14.2 kg",
      label: "CO₂ Offset / Hectare",
      sub: "Bio-circular green hydrogen & rice husk pyrolysis credit",
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-12 font-mono">
      <div className="pointer-events-auto max-w-4xl w-full glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 flex flex-col gap-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>LIVE SECTOR VERIFICATION // SECTOR 13</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              MISSION TELEMETRY VALIDATION
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              100% AUTONOMOUS SUCCESS
            </span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between hover:border-sky-500/40 transition-colors shadow-sm"
            >
              <div>
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 w-fit mb-3">
                  {m.icon}
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-sky-600 dark:text-sky-300 mt-1 uppercase tracking-wide">
                  {m.label}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-3 font-sans leading-relaxed">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER ACTION */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <span>AI Neural Inference: 99.8% Confidence Verified</span>
          </div>
          <button
            onClick={onContinue}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-sky-400 dark:text-black font-bold text-xs hover:opacity-90 transition-all uppercase tracking-wider shadow-md"
          >
            Ascend To Orbital View →
          </button>
        </div>
      </div>
    </div>
  );
}
