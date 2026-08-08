import React from 'react';
import { Compass } from 'lucide-react';

interface SurveyPathLayerProps {
  totalWaypoints: number;
  currentWaypoint: number;
}

export const SurveyPathLayer: React.FC<SurveyPathLayerProps> = ({
  totalWaypoints,
  currentWaypoint
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md flex items-center space-x-2 font-mono text-[11px] text-slate-600">
      <Compass className="w-3.5 h-3.5 text-[#0EA89A]" />
      <span>SURVEY VECTOR: {currentWaypoint} / {totalWaypoints} PTS</span>
    </div>
  );
};
