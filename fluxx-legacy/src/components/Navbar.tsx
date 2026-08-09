"use client";

import { Volume2, VolumeX, Sun, Moon } from "lucide-react";

interface NavbarProps {
  progress: number;
  audioMuted: boolean;
  onToggleAudio: () => void;
  onJumpToProgress: (progress: number) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export function Navbar({
  audioMuted,
  onToggleAudio,
  onJumpToProgress,
  isDark = false,
  onToggleTheme,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 pt-6 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="pointer-events-auto">
          <button
            onClick={() => onJumpToProgress(0)}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B8FF] to-[#00E7B3] flex items-center justify-center text-slate-950 font-black text-xs shadow-md group-hover:scale-105 transition-transform">
              FX
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono font-black text-sm tracking-widest text-slate-900 dark:text-white group-hover:text-[#00B8FF] transition-colors">
                FLUXX
              </span>
              <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                AEROSPACE
              </span>
            </div>
          </button>
        </div>

        {/* Clean Center Navigation Links with Breathing Room */}
        <nav className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 pointer-events-auto shadow-sm">
          <button
            onClick={() => onJumpToProgress(0.0)}
            className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Mission
          </button>
          <button
            onClick={() => onJumpToProgress(0.12)}
            className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Technology
          </button>
          <button
            onClick={() => onJumpToProgress(0.85)}
            className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Exploded View
          </button>
          <button
            onClick={() => onJumpToProgress(0.98)}
            className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Controls: Theme Toggle, Audio Toggle & Request Demo */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#00B8FF]/50 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#00B8FF]" />
            )}
          </button>

          {/* Audio Engine Toggle */}
          <button
            onClick={onToggleAudio}
            aria-label="Toggle Audio"
            className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 transition-all shadow-sm ${
              audioMuted
                ? "text-slate-400 dark:text-slate-500"
                : "border-[#00B8FF]/50 text-[#00B8FF]"
            }`}
          >
            {audioMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#00E7B3] animate-pulse" />
            )}
          </button>

          {/* Request Demo Primary CTA Button */}
          <button
            onClick={() => onJumpToProgress(0.98)}
            className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-bold tracking-wider hover:opacity-90 shadow-md transition-all"
          >
            Request Demo
          </button>
        </div>
      </div>
    </header>
  );
}
