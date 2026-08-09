"use client";

import { useEffect, useState } from "react";
import { Cpu, ArrowRight } from "lucide-react";

interface LoaderProps {
  onEnter: () => void;
  isDark?: boolean;
}

export function Loader({ onEnter }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 select-none font-mono transition-colors duration-300">
      {/* Central Pulsing Aerospace Monogram */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-32 h-32 rounded-full border border-sky-500/30 animate-ping opacity-25" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-sky-500/60 animate-spin-slow" />
        <div className="absolute w-14 h-14 rounded-2xl bg-white dark:bg-sky-500/10 border border-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <span className="text-xl font-black text-sky-600 dark:text-sky-300">
            FX
          </span>
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-center text-slate-900 dark:text-white">
        FLUXX
      </h1>
      <p className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest mt-1 mb-8">
        Autonomous VTOL Agricultural Ecosystem
      </p>

      {/* Progress & Diagnostics */}
      <div className="w-72 sm:w-96 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-semibold">
          <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-300">
            <Cpu className="w-3.5 h-3.5" />
            {isReady ? "AVIONICS SYSTEMS CALIBRATED" : "INITIALIZING AVIONICS..."}
          </span>
          <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 dark:bg-gray-900 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-75 shadow-md shadow-sky-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Launch Button when Ready */}
      {isReady && (
        <button
          onClick={onEnter}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-widest hover:opacity-95 shadow-xl shadow-sky-500/25 transition-all flex items-center gap-2 animate-bounce"
        >
          <span>ENTER MISSION SIMULATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Version Tag */}
      <div className="absolute bottom-6 text-[10px] text-slate-400 dark:text-gray-500 tracking-wider">
        THREE.JS // R3F // NEXT.JS 15 // GSAP FLIGHT RIG
      </div>
    </div>
  );
}
