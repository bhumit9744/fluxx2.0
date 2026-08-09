import React from 'react';
import { AlertTriangle, MapPin, ArrowRight, Wind, Activity } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const AnomaliesDetection: React.FC = () => {
  const { seekSample, setActiveSection, dispatchVTOL, allSamples } = useEnvironmentStore();

  const total = allSamples?.length || 50;

  const anomalies = [
    {
      id: 'anom-1',
      title: 'PM2.5 spike',
      value: '63.1 µg/m³',
      confidence: 87,
      time: '12:40',
      sampleIdx: Math.floor(total * 0.52),
      location: 'Kharghar Sector 4 Cluster',
      lat: 19.054983,
      lng: 73.066209,
      severity: 'CRITICAL',
      icon: Activity
    },
    {
      id: 'anom-2',
      title: 'Wind stagnation',
      value: '1.2 m/s',
      confidence: 72,
      time: '12:35',
      sampleIdx: Math.floor(total * 0.48),
      location: 'Valley Basin Sector',
      lat: 19.048211,
      lng: 73.071142,
      severity: 'MODERATE',
      icon: Wind
    }
  ];

  const handleViewOnLiveMap = (lat: number, lng: number, sampleIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    seekSample(sampleIdx);
    dispatchVTOL(lat, lng);
    setActiveSection('live-map');
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs p-6 space-y-4 select-none font-sans flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FAF3EA] pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#2B211C] uppercase font-mono tracking-wider">
              Anomalies Detected
            </h3>
            <p className="text-[11px] font-mono text-[#8C827A]">
              Automated Spatial & Temporal Outliers
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold font-mono text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-md border border-[#FCA5A5]">
          2 FLAGGED
        </span>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {anomalies.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              onClick={() => seekSample(a.sampleIdx)}
              className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D7] hover:border-[#F47A24] transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                  <span className="text-xs font-black text-[#2B211C]">
                    {a.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-black text-[#DC2626]">
                  {a.value}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8C827A]">
                <span>{a.time} · {a.confidence}% confidence</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white border border-[#F3E6D7] text-[#2B211C]">
                  Sample #{a.sampleIdx}
                </span>
              </div>

              <div className="pt-2 border-t border-[#FAF3EA] flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] text-[#8C827A] truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#F47A24] shrink-0" />
                  <span className="truncate">{a.location}</span>
                </div>

                <button
                  onClick={(e) => handleViewOnLiveMap(a.lat, a.lng, a.sampleIdx, e)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#F47A24] hover:bg-[#E06815] text-white text-[11px] font-extrabold transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  <span>Live Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
