import React from 'react';
import { EarthMap } from '../../../components/map/EarthMap';
import { TelemetryRail } from '../../../components/metrics/TelemetryRail';
import { Recommendation } from '../../../components/intelligence/Recommendation';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { TrendingUp, TrendingDown, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { eri, setActiveSection } = useEnvironmentStore();

  return (
    <div className="space-y-5 pb-16 font-sans">
      
      {/* Executive Command Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--fluxx-text)] tracking-tight">ENVIRONMENTAL COMMAND CENTER</h2>
          <div className="text-[11px] font-mono font-medium text-[var(--fluxx-muted)] mt-1 uppercase tracking-widest flex items-center space-x-2">
            <span>Kharghar, Navi Mumbai</span>
            <span>·</span>
            <span className="flex items-center text-[var(--fluxx-orange)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--fluxx-orange)] mr-1.5 animate-pulse"></span>Live Survey Active</span>
          </div>
        </div>
      </div>

      {/* KPI Solid Cards (PM2.5, PM10, CO2, ERI) */}
      <div>
        <TelemetryRail />
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start h-[520px]">
        
        {/* 3D Environment Map Main Stage */}
        <div className="xl:col-span-2 relative h-full panel overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--fluxx-border)] bg-[var(--fluxx-glass-light)]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[var(--fluxx-muted)]" />
              <span className="text-xs font-bold text-[var(--fluxx-text)] uppercase tracking-wider">3D EARTH SPATIAL VIEW</span>
            </div>
            <button onClick={() => setActiveSection('environment')} className="text-[10px] font-mono text-[var(--fluxx-orange)] font-bold uppercase tracking-widest hover:text-[var(--fluxx-coral)] transition-colors">
              Full Screen
            </button>
          </div>
          <div className="flex-1 relative">
            <EarthMap isOverview={true} />
          </div>
        </div>

        {/* Right Context Panel */}
        <div className="space-y-5 h-full flex flex-col">
          
          {/* Solid Environmental Insights Card */}
          <div className="panel p-5">
            <div className="flex items-center justify-between border-b border-[var(--fluxx-border)] pb-3">
              <span className="text-xs font-bold text-[var(--fluxx-text)] uppercase tracking-wider">
                ENVIRONMENTAL RISK
              </span>
            </div>

            <div className="pt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-mono font-black text-[var(--fluxx-text)]">{eri.score}</span>
                <span className={`px-2.5 py-1 rounded-[6px] font-mono text-[10px] font-bold uppercase tracking-widest ${
                  eri.score > 70 ? 'bg-[rgba(217,76,61,0.1)] text-[var(--fluxx-critical)]' : 
                  eri.score > 40 ? 'bg-[rgba(244,122,36,0.1)] text-[var(--fluxx-orange)]' : 
                  'bg-[rgba(63,166,107,0.1)] text-[var(--fluxx-success)]'
                }`}>
                  {eri.level}
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-[var(--fluxx-critical)]" />
                <span className="text-[10px] font-mono text-[var(--fluxx-muted)] font-bold uppercase">8.2% ABOVE BASELINE</span>
              </div>
            </div>

            <p className="text-[13px] text-[var(--fluxx-muted)] leading-relaxed pt-4">
              Kharghar Sector 4 atmospheric trapping due to low surface wind velocity (2.6 m/s) and high relative humidity.
            </p>
          </div>

          {/* Active Event Card */}
          <div className="panel p-5 relative overflow-hidden flex-1 !border-[var(--fluxx-critical)]/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--fluxx-critical)]" />
            <div className="flex items-center space-x-2 border-b border-[var(--fluxx-border)] pb-3">
              <AlertCircle className="w-4 h-4 text-[var(--fluxx-critical)]" />
              <span className="text-xs font-bold text-[var(--fluxx-critical)] uppercase tracking-wider">
                ACTIVE EVENT
              </span>
            </div>
            <div className="pt-4 space-y-4">
              <div>
                <div className="text-lg font-bold text-[var(--fluxx-text)]">PM2.5 Anomaly Detected</div>
                <div className="text-[11px] font-mono text-[var(--fluxx-muted)] uppercase tracking-widest mt-1">87% CONFIDENCE</div>
              </div>
              
              <div className="text-[13px] text-[var(--fluxx-text)] bg-[rgba(255,255,255,0.3)] p-3 rounded-lg border border-[var(--fluxx-border)]">
                Immediate attention advised for elevated levels. Peak concentration of 63.1 µg/m³ detected at Sector 4 coordinates.
              </div>
              
              <Recommendation />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
