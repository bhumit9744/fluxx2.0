import React from 'react';
import { AlertCircle, Zap } from 'lucide-react';

interface AnomalyCardProps {
  confidence?: number;
  message?: string;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({
  confidence = 87,
  message = 'PM2.5 anomaly detected at Kharghar Sector 4 coordinates.'
}) => {
  return (
    <div className="p-5 rounded-3xl bg-[#FEF3C7]/80 border border-amber-300 shadow-sm backdrop-blur-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-900 font-mono font-bold text-xs">
          <Zap className="w-4 h-4 text-amber-600 fill-current" />
          <span>ACTIVE EVENT</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
          {confidence}% CONFIDENCE
        </span>
      </div>

      <p className="text-xs font-mono text-amber-950 font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
};
