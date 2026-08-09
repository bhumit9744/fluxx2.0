"use client";

import { useState } from "react";
import {
  Compass,
  Wind,
  Battery,
  Radio,
  Eye,
  Activity,
  Crosshair,
} from "lucide-react";
import { getInterpolatedTrajectory } from "@/lib/splinePaths";

interface HUDProps {
  progress: number;
  isDark?: boolean;
}

export type VisionMode = "RGB" | "THERMAL" | "NDVI" | "LIDAR";

export function HUD({ progress, isDark = false }: HUDProps) {
  const [visionMode, setVisionMode] = useState<VisionMode>("RGB");
  const traj = getInterpolatedTrajectory(progress);

  // Derive dynamic simulated flight telemetry
  const airspeed = Math.round(traj.rotorSpeed * 92); // km/h
  const altitude = Math.round((traj.dronePos.y + 1.2) * 14); // meters AGL
  const batteryPct = Math.max(
    18,
    Math.round(98 - progress * 14 + Math.sin(progress * 20) * 1.5)
  );
  const busVoltage = (94.2 + (batteryPct / 100) * 4.2).toFixed(1);
  const heading = Math.round(((traj.droneRot.y * 180) / Math.PI + 360) % 360);
  const rtkAccuracy = "±1.2cm";
  const aiConfidence = (98.4 + Math.sin(progress * 15) * 1.4).toFixed(1);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none font-mono">
      {/* 1. VISION MODE FULLSCREEN POST-PROCESSING FILTER OVERLAYS */}
      {visionMode === "THERMAL" && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-orange-500/20 via-rose-500/10 to-indigo-600/25 mix-blend-color z-10 scanlines" />
      )}
      {visionMode === "NDVI" && (
        <div className="absolute inset-0 pointer-events-none bg-emerald-500/15 mix-blend-color-dodge z-10 scanlines" />
      )}
      {visionMode === "LIDAR" && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(2,132,199,0.15)_1px,transparent_1px)] bg-[size:24px_24px] z-10" />
      )}

      {/* 2. TOP COMPASS HEADING RIBBON */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-slate-200/80 dark:border-white/10 text-xs shadow-sm">
          <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="text-slate-500 dark:text-gray-400">HDG:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {heading.toString().padStart(3, "0")}°
          </span>
          <span className="text-slate-400 dark:text-gray-500">|</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            RTK FIX ({rtkAccuracy})
          </span>
        </div>
      </div>

      {/* 3. LEFT FLIGHT INSTRUMENTS: AIRSPEED TAPE */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 flex flex-col items-center w-20 sm:w-24 shadow-sm">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-semibold">
            AIRSPEED
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1">
            {airspeed}
          </div>
          <span className="text-[9px] text-sky-600 dark:text-sky-400 font-semibold">KM/H</span>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-150"
              style={{ width: `${Math.min(100, (airspeed / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Rotor RPM Indicator */}
        <div className="px-3 py-2 rounded-xl glass-panel border border-slate-200/80 dark:border-white/10 text-[10px] flex items-center justify-between shadow-sm">
          <span className="text-slate-500 dark:text-gray-400">RPM</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {Math.round(traj.rotorSpeed * 4800)}
          </span>
        </div>
      </div>

      {/* 4. RIGHT FLIGHT INSTRUMENTS: ALTIMETER TAPE */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 flex flex-col items-center w-20 sm:w-24 shadow-sm">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-gray-400 font-semibold">
            ALTITUDE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1">
            {altitude}
          </div>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">M AGL</span>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-150"
              style={{ width: `${Math.min(100, (altitude / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Tilt Vectoring Angle */}
        <div className="px-3 py-2 rounded-xl glass-panel border border-slate-200/80 dark:border-white/10 text-[10px] flex items-center justify-between shadow-sm">
          <span className="text-slate-500 dark:text-gray-400">TILT</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {Math.round(90 - (traj.tiltAngle * 180) / Math.PI)}°
          </span>
        </div>
      </div>

      {/* 5. CENTER ARTIFICIAL HORIZON RETICLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 hover:opacity-80 transition-opacity">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 border border-slate-400/40 dark:border-sky-400/40 rounded-full flex items-center justify-center">
          {/* Crosshair Center */}
          <Crosshair className="w-6 h-6 text-sky-600 dark:text-sky-400 stroke-[1.5]" />

          {/* Pitch Ladder Marks */}
          <div className="absolute w-16 h-[1px] bg-slate-400 dark:bg-sky-400/60 top-8" />
          <div className="absolute w-16 h-[1px] bg-slate-400 dark:bg-sky-400/60 bottom-8" />
          <div className="absolute w-8 h-[1px] bg-slate-400 dark:bg-sky-400/40 top-12" />
          <div className="absolute w-8 h-[1px] bg-slate-400 dark:bg-sky-400/40 bottom-12" />

          {/* Left / Right Horizon Wings */}
          <div className="absolute -left-6 w-5 h-[1.5px] bg-slate-600 dark:bg-sky-400" />
          <div className="absolute -right-6 w-5 h-[1.5px] bg-slate-600 dark:bg-sky-400" />
        </div>
      </div>

      {/* 6. BOTTOM TELEMETRY BAR & MULTISPECTRAL VISION SWITCHER */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-auto">
        {/* Interactive Vision Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel border border-slate-200/80 dark:border-white/10 shadow-md">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">
            <Eye className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>SENSOR:</span>
          </div>

          {(["RGB", "THERMAL", "NDVI", "LIDAR"] as VisionMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setVisionMode(mode)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all duration-200 ${
                visionMode === mode
                  ? "bg-slate-900 dark:bg-sky-500 text-white shadow-sm"
                  : "text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Live Power & Communications Ribbon */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-full glass-panel border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-600 dark:text-gray-300 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {batteryPct}%
            </span>
            <span className="text-[10px] text-slate-400">({busVoltage}V)</span>
          </div>

          <div className="w-[1px] h-3 bg-slate-300 dark:bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>WIND:</span>
            <span className="font-semibold text-slate-900 dark:text-white">4.2 KT NE</span>
          </div>

          <div className="w-[1px] h-3 bg-slate-300 dark:bg-white/10" />

          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AI CONF:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {aiConfidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
