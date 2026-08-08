import React from 'react';
import { getRiskColor } from '../../utils/calculations';

interface RiskRingProps {
  score: number;
  level?: string;
  size?: number;
}

export const RiskRing: React.FC<RiskRingProps> = ({
  score = 64,
  level = 'MODERATE',
  size = 180
}) => {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const risk = getRiskColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(20, 40, 50, 0.08)"
          strokeWidth="12"
          fill="transparent"
        />

        {/* Dynamic Risk Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={risk.color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Label Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-display font-black text-slate-900 tracking-tight">
          {score}
        </span>
        <span className="text-[11px] font-mono text-slate-400 font-semibold">
          / 100
        </span>
        <span
          className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
          style={{
            color: risk.color,
            backgroundColor: risk.bg,
            border: `1px solid ${risk.border}`
          }}
        >
          {level}
        </span>
      </div>
    </div>
  );
};
