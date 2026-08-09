"use client";

import { EXPLODED_COMPONENTS } from "@/lib/sceneData";
import { Cpu, RotateCcw, CheckCircle2 } from "lucide-react";

interface ExplodedInspectorProps {
  selectedPartId: string | null;
  onSelectPart: (id: string) => void;
  onContinue: () => void;
}

export function ExplodedInspector({
  selectedPartId,
  onSelectPart,
  onContinue,
}: ExplodedInspectorProps) {
  const activeComponent =
    EXPLODED_COMPONENTS.find((c) => c.id === selectedPartId) ||
    EXPLODED_COMPONENTS[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-between p-4 sm:p-12 font-mono">
      {/* LEFT COMPONENT SELECTOR LIST */}
      <div className="pointer-events-auto w-80 glass-panel rounded-3xl p-5 border border-slate-200/90 dark:border-white/10 flex flex-col gap-2 max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>MODULAR ARCHITECTURE</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">
            8 SUBSYSTEMS
          </span>
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          {EXPLODED_COMPONENTS.map((item) => {
            const isSelected = item.id === activeComponent.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPart(item.id)}
                className={`text-left px-3.5 py-2.5 rounded-2xl text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-black font-bold shadow-md"
                    : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <span className="truncate">{item.name}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COMPONENT DETAIL CARD */}
      <div className="pointer-events-auto w-96 glass-panel-glow rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
            SPECIFICATION SHEET
          </span>
          <button
            onClick={() => onSelectPart("rotor")}
            className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {activeComponent.name}
          </h2>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">
            {activeComponent.spec}
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-sans">
          {activeComponent.description}
        </p>

        <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            STATUS: ACTIVE & VERIFIED
          </span>
          <button
            onClick={onContinue}
            className="px-4 py-2 rounded-2xl bg-slate-900 text-white dark:bg-sky-400 dark:text-black font-bold text-xs hover:opacity-90 transition-all uppercase tracking-wider shadow-md"
          >
            Proceed →
          </button>
        </div>
      </div>
    </div>
  );
}
