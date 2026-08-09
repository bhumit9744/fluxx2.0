"use client";

import { TEAM_MEMBERS } from "@/lib/sceneData";
import { Users, Award } from "lucide-react";

interface TeamOverlayProps {
  onContinue: () => void;
}

export function TeamOverlay({ onContinue }: TeamOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-12 font-mono">
      <div className="pointer-events-auto max-w-5xl w-full glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-white/10 flex flex-col gap-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-widest uppercase">
              <Users className="w-4 h-4" />
              <span>COMMAND & AUTONOMY // SECTOR 16</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              ENGINEERING LEADERSHIP
            </h2>
          </div>
          <button
            onClick={onContinue}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-sky-400 dark:text-black font-bold text-xs hover:opacity-90 transition-all uppercase tracking-wider shadow-md self-start sm:self-auto"
          >
            Deploy Mission CTA →
          </button>
        </div>

        {/* TEAM CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between hover:border-sky-500/40 transition-all shadow-sm group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20 block w-fit mb-2">
                  {member.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5 mb-2">
                  {member.role}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-gray-300 font-sans leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
