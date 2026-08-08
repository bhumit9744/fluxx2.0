import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RecommendationProps {
  text?: string;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  text = 'Increase sampling frequency around Sector 4 coordinates. Initiate municipal dust suppression protocol.'
}) => {
  return (
    <div className="p-5 rounded-3xl bg-[#DDF6F2]/80 border border-teal-200 shadow-sm backdrop-blur-xl space-y-2">
      <div className="flex items-center space-x-2 text-teal-900 font-mono font-bold text-xs">
        <ShieldCheck className="w-4 h-4 text-[#0EA89A]" />
        <span>RECOMMENDED ACTION</span>
      </div>

      <p className="text-xs font-mono text-teal-950 font-medium leading-relaxed">
        {text}
      </p>
    </div>
  );
};
