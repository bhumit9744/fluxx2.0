import React from 'react';
import { ForecastChart } from '../../../components/charts/ForecastChart';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { Plane, AlertTriangle, MapPin } from 'lucide-react';

export const IntelligenceView: React.FC = () => {
  const { eri, dispatchVTOL, reportData, setActiveSection } = useEnvironmentStore();

  const handleDispatch = () => {
    const repData = reportData as any;
    const lat = repData?.spatial_analysis?.hotspot_latitude || 19.054983;
    const lng = repData?.spatial_analysis?.hotspot_longitude || 73.066209;
    dispatchVTOL(lat, lng);
    setActiveSection('flight-ops');
  };

  const reasons = [
    { label: 'PM2.5 SURGE', val: 61 },
    { label: 'PM10 ELEVATION', val: 22 },
    { label: 'WIND STAGNATION', val: 11 },
    { label: 'HUMIDITY', val: 6 },
  ];

  return (
    <div className="space-y-5 pb-12 font-sans max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      
      {/* Console Header */}
      <div className="flex items-center justify-between panel p-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--fluxx-text)] tracking-tight">ENVIRONMENTAL INTELLIGENCE</h2>
          <div className="text-[11px] font-mono font-medium text-[var(--fluxx-muted)] mt-1 uppercase tracking-widest flex items-center space-x-2">
            <span>AI Diagnostic Console</span>
            <span>·</span>
            <span>ERI {eri.score}/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 min-h-0">
        
        {/* Left Column: Investigation Report */}
        <div className="md:col-span-2 space-y-5 h-full flex flex-col overflow-y-auto pr-2">
          
          {/* Anomaly Detection Box */}
          <div className="panel p-6 relative overflow-hidden shrink-0 !border-[var(--fluxx-critical)]/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--fluxx-critical)]" />
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[rgba(217,76,61,0.1)] text-[var(--fluxx-critical)] rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-[var(--fluxx-text)] tracking-tight">PM2.5 ANOMALY DETECTED</div>
                <div className="text-[11px] font-mono font-bold text-[var(--fluxx-critical)] tracking-widest uppercase mt-0.5">{eri.confidence}% CONFIDENCE</div>
              </div>
            </div>

            <p className="text-[13px] text-[var(--fluxx-text)] leading-relaxed pt-4 border-t border-[var(--fluxx-border)]">
              The AI engine has detected an abnormal particulate matter accumulation in Kharghar Sector 4. The accumulation pattern suggests a localized emission source exacerbated by meteorological stagnation.
            </p>
          </div>

          <div className="flex-1 min-h-[300px] panel p-1 overflow-hidden">
            <ForecastChart />
          </div>

        </div>

        {/* Right Column: Reasoning & Actions */}
        <div className="space-y-5 flex flex-col h-full overflow-y-auto pr-1">
          
          {/* ERI Card */}
          <div className="panel p-6 shrink-0">
            <div className="text-[10px] font-mono font-bold text-[var(--fluxx-text)] uppercase tracking-widest mb-4 border-b border-[var(--fluxx-border)] pb-2">
              ENVIRONMENTAL RISK
            </div>
            <div className="flex items-baseline space-x-2 pt-2">
              <div className="text-5xl font-mono font-black text-[var(--fluxx-text)]">{eri.score}</div>
              <div className="text-sm font-mono text-[var(--fluxx-muted)] font-bold">/ 100</div>
            </div>
            <div className={`mt-2 text-[11px] font-mono font-bold tracking-widest uppercase inline-block px-2 py-0.5 rounded-md ${
              eri.level === 'CRITICAL' ? 'bg-[rgba(217,76,61,0.1)] text-[var(--fluxx-critical)]' : 
              eri.level === 'HIGH' ? 'bg-[rgba(244,122,36,0.1)] text-[var(--fluxx-orange)]' : 
              'bg-[rgba(63,166,107,0.1)] text-[var(--fluxx-success)]'
            }`}>
              {eri.level} RISK
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="panel p-6 shrink-0">
            <div className="text-[10px] font-mono font-bold text-[var(--fluxx-text)] uppercase tracking-widest mb-5 border-b border-[var(--fluxx-border)] pb-2">
              WHY FLUXX FLAGGED THIS
            </div>
            <div className="space-y-4">
              {reasons.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase mb-1.5">
                    <span className="text-[var(--fluxx-text)]">{f.label}</span>
                    <span className="text-[var(--fluxx-muted)]">{f.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--fluxx-border)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${f.val}%`, 
                        background: i < 2 ? 'linear-gradient(to right, var(--fluxx-orange), var(--fluxx-coral))' : 'var(--fluxx-muted)' 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action */}
          <div className="panel p-6 shrink-0">
            <div className="text-[10px] font-mono font-bold text-[var(--fluxx-text)] uppercase tracking-widest mb-4 border-b border-[var(--fluxx-border)] pb-2">
              RECOMMENDED ACTION
            </div>
            
            <p className="text-[13px] text-[var(--fluxx-text)] leading-relaxed mb-6">
              Increase sampling density around the detected cluster in Kharghar Sector 4 to confirm peak readings and isolate emission sources.
            </p>

            <div className="space-y-3">
              <button 
                onClick={handleDispatch}
                className="w-full py-3 rounded-xl bg-linear-to-r from-[var(--fluxx-orange)] to-[var(--fluxx-coral)] text-white font-mono text-[11px] font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>DISPATCH VTOL</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
