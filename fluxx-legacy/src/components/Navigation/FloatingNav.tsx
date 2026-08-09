import React from "react";
import { useFluxxStore, ViewState } from "@/store/useFluxxStore";
import {
  LayoutDashboard,
  Globe2,
  Crosshair,
  BrainCircuit,
  FileText,
  Settings,
} from "lucide-react";
import clsx from "clsx";

const navItems: { label: string; view: ViewState; icon: React.ReactNode }[] = [
  { label: "Overview", view: "overview", icon: <LayoutDashboard size={20} /> },
  { label: "Environment", view: "environment", icon: <Globe2 size={20} /> },
  { label: "Missions", view: "missions", icon: <Crosshair size={20} /> },
  { label: "Intelligence", view: "intelligence", icon: <BrainCircuit size={20} /> },
  { label: "Reports", view: "reports", icon: <FileText size={20} /> },
];

export function FloatingNav() {
  const { currentView, setCurrentView } = useFluxxStore();

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center">
        {/* Logo / Header */}
        <div className="text-fluxx-text font-mono font-bold tracking-widest mb-6">
          FLUXX
        </div>
        
        {/* Connecting Line (Optional aesthetic) */}
        <div className="w-[1px] h-6 bg-fluxx-muted/30 mb-6" />

        {/* Navigation Shell Container */}
        <nav className="bg-glass backdrop-blur-xl border border-glassBorder shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl p-3 flex flex-col gap-2 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(14,168,154,0.15)]">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={clsx(
                  "group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 w-full text-left",
                  isActive
                    ? "bg-white/80 shadow-sm text-fluxx-teal font-medium"
                    : "text-fluxx-muted hover:text-fluxx-text hover:bg-white/40"
                )}
              >
                {isActive && (
                  <div className="absolute left-2 w-1 h-6 bg-fluxx-teal rounded-full" />
                )}
                <div
                  className={clsx(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-105",
                    isActive ? "ml-1" : ""
                  )}
                >
                  {item.icon}
                </div>
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}

          <div className="w-full h-[1px] bg-fluxx-muted/20 my-2" />

          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-fluxx-muted hover:text-fluxx-text hover:bg-white/40 w-full text-left">
            <Settings size={20} />
            <span className="text-sm tracking-wide">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
