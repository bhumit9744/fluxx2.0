"use client";

import { useState } from "react";
import { PRODUCT_CHAPTERS, ProductChapter } from "@/lib/productTimeline";
import { CheckCircle2, Send } from "lucide-react";

interface StoryOverlaysProps {
  progress: number;
  onJumpToProgress?: (p: number) => void;
  isDark?: boolean;
}

export function StoryOverlays({
  progress,
  isDark = false,
}: StoryOverlaysProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Find active chapter
  let activeChapter: ProductChapter = PRODUCT_CHAPTERS[0];
  for (let i = 0; i < PRODUCT_CHAPTERS.length; i++) {
    const ch = PRODUCT_CHAPTERS[i];
    if (progress >= ch.scrollRange[0] && progress <= ch.scrollRange[1]) {
      activeChapter = ch;
      break;
    }
  }

  // Smooth fade calculation within active chapter scroll bracket
  const [start, end] = activeChapter.scrollRange;
  const relProgress = (progress - start) / (end - start || 0.01);
  let opacity = 1;
  if (relProgress < 0.12) {
    opacity = relProgress / 0.12;
  } else if (relProgress > 0.88) {
    opacity = (1 - relProgress) / 0.12;
  }

  // 1. Hero Screen (Chapter 1: Pure, Bold, Uncluttered)
  if (activeChapter.id === 1) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-between p-6 sm:p-12 transition-opacity duration-500"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="mt-14 sm:mt-16 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-slate-900/80 dark:bg-white/10 text-[#00E7B3] border border-[#00E7B3]/30 font-mono text-[11px] font-bold tracking-widest uppercase backdrop-blur-md">
            FLUXX VTOL V3.0
          </span>
        </div>

        <div className="text-center max-w-3xl mb-12 space-y-2">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            FLUXX
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl font-medium text-slate-700 dark:text-slate-300 tracking-tight">
            Autonomous Heavy-Lift VTOL
          </p>
          <div className="pt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
              Scroll to explore
            </p>
            <div className="w-4 h-7 rounded-full border-2 border-slate-300 dark:border-slate-700 mx-auto mt-2 flex items-start justify-center p-1">
              <div className="w-1 h-1.5 bg-[#00E7B3] rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Final Deployment CTA (Chapter 14)
  if (activeChapter.id === 14) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center p-4 sm:p-12 transition-opacity duration-500 font-mono"
        style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
      >
        <div className="pointer-events-auto max-w-xl w-full p-8 rounded-3xl bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl">
          {formSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#00E7B3] mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                DEPLOYMENT BRIEF RECEIVED
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans max-w-md mx-auto">
                Our autonomous flight operations team will review your fleet specification and reach out within 4 hours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-[#00E7B3] text-[10px] font-bold tracking-widest uppercase">
                  READY FOR DEPLOYMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  Build The Future With FLUXX
                </h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
              >
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    Commander Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Dr. Elena Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00B8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    Organization
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Sovereign Agro Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00B8FF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    Work Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="elena@agrosystems.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00B8FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="sm:col-span-2 py-3 rounded-xl bg-gradient-to-r from-[#00B8FF] to-[#00E7B3] text-slate-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-md mt-1"
                >
                  <span>Request Fleet Access</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Apple-Style Minimalist Product Story Card (Single focused card: Title, 1 sentence, 3 specs)
  return (
    <div
      className="fixed right-4 sm:right-10 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none z-20 w-full max-w-sm transition-opacity duration-500"
      style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
    >
      <div className="p-7 rounded-3xl bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.25)] pointer-events-auto relative overflow-hidden">
        {/* Subtle accent top border line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00B8FF] via-[#00E7B3] to-transparent opacity-80" />

        <div key={activeChapter.id} className="space-y-4">
          {/* Component Name */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#00E7B3] uppercase tracking-widest">
              {activeChapter.tagline}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {activeChapter.headline}
            </h2>
          </div>

          {/* One Punchy Sentence */}
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {activeChapter.description}
          </p>

          {/* 3 Clean Minimal Specs */}
          {activeChapter.specs && activeChapter.specs.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/70 dark:border-white/10 font-mono">
              {activeChapter.specs.map((spec, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[9px] uppercase text-slate-400 font-medium tracking-wider">
                    {spec.label}
                  </span>
                  <span className="text-[13px] font-bold text-slate-900 dark:text-white mt-0.5">
                    {spec.value} {spec.unit || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
