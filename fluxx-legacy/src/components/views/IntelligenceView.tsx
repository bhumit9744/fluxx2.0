import React from "react";
import { useFluxxStore } from "@/store/useFluxxStore";

export function IntelligenceView() {
  const { eriScore, activeEvent } = useFluxxStore();

  return (
    <div className="w-full h-full p-8 pl-32 flex flex-col gap-8 max-w-5xl mx-auto">
      
      <header>
        <h2 className="text-2xl font-light text-fluxx-text tracking-wide uppercase">Environmental Intelligence</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ERI Context */}
        <div className="bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-[6rem] font-light leading-none text-fluxx-text mb-2">
              {eriScore}
              <span className="text-2xl text-fluxx-muted font-normal">/100</span>
            </div>
            <div className="px-6 py-2 bg-fluxx-warning/10 text-fluxx-warning rounded-full font-semibold tracking-widest text-sm">
              MODERATE RISK
            </div>
          </div>

          <div className="w-full h-[1px] bg-fluxx-muted/20" />

          <div>
            <h3 className="text-sm font-semibold text-fluxx-muted tracking-widest uppercase mb-6">Why FLUXX flagged this</h3>
            
            <div className="flex flex-col gap-4">
              {activeEvent?.factors ? (
                Object.entries(activeEvent.factors).map(([key, value]) => (
                  <FactorBar key={key} label={key} percentage={value} />
                ))
              ) : (
                <p className="text-fluxx-muted text-sm">No anomalous factors contributing to risk.</p>
              )}
            </div>
          </div>
        </div>

        {/* Active Event Log */}
        <div className="bg-glass backdrop-blur-xl border border-glassBorder shadow-sm rounded-[2rem] p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold text-fluxx-muted tracking-widest uppercase">Active Event</h3>

          {activeEvent && activeEvent.active ? (
            <div className="flex-1 flex flex-col">
              <div className="mb-8">
                <h4 className="text-2xl font-medium text-fluxx-critical leading-tight mb-2">
                  {activeEvent.type}
                </h4>
                <p className="text-fluxx-muted font-medium text-lg">
                  {activeEvent.confidence}% confidence
                </p>
                <p className="text-fluxx-text mt-4 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>
              
              <div className="mt-auto flex gap-4">
                <button className="flex-1 bg-white border border-glassBorder text-fluxx-text px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  VIEW ON MAP
                </button>
                <button className="flex-1 bg-fluxx-text text-white px-4 py-3 rounded-xl font-medium hover:bg-fluxx-text/90 transition-colors">
                  CREATE MISSION
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-fluxx-muted">
              No active events
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function FactorBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-fluxx-text">{label}</div>
      <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-white">
        <div 
          className="h-full bg-fluxx-warning transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-right text-sm font-mono text-fluxx-muted">{percentage}%</div>
    </div>
  );
}
