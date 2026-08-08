import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label = 'Preparing dataset...',
  color = '#F47A24'
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-[12px] font-bold">
        <span className="text-[#6B5E55] flex items-center space-x-2">
          {clamped < 100 && (
            <span className="w-2 h-2 rounded-full bg-[#F47A24] animate-ping" />
          )}
          <span>{label}</span>
        </span>
        <span className="text-[#2B211C] font-mono">{clamped}%</span>
      </div>

      <div className="w-full h-3 rounded-full bg-[#FAF3EA] border border-[#F3E6D7] p-0.5 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out shadow-xs"
          style={{ 
            width: `${clamped}%`,
            background: clamped === 100 
              ? '#3FA66B' 
              : `linear-gradient(90deg, #F47A24 0%, #FF9F5A 100%)`
          }}
        />
      </div>
    </div>
  );
};
