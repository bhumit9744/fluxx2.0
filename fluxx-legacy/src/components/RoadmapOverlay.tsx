"use client";

import { ROADMAP_MILESTONES } from "@/lib/sceneData";
import { Milestone } from "lucide-react";

interface RoadmapOverlayProps {
  onContinue: () => void;
}

export function RoadmapOverlay({ onContinue }: RoadmapOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-12 font-mono">
      <div className="pointer-events-auto max-w-5xl w-full glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 flex flex-col gap-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-widest uppercase">
              <Milestone className="w-4 h-4" />
              <span>STRATEGIC EXPANSION // SECTOR 15</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              DECADE ROADMAP TO 2030
            </h2>
          </div>
          <button
            onClick={onContinue}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors uppercase tracking-wider shadow-md self-start sm:self-auto"
          >
            Meet Command Team →
          </button>
        </div>

        {/* ROADMAP TIMELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_MILESTONES.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between hover:border-purple-400/40 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {m.year}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      m.badge === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                        : m.badge === "ACTIVE"
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/30"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-sky-600 dark:text-cyan-300 mb-2 uppercase">
                  {m.title}
                </h3>
                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-gray-300 font-sans">
                  {m.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-sky-600 dark:text-cyan-400 mt-0.5">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
