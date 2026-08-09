import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#F3E6D7] text-[#2B211C] max-w-[280px] shadow-2xs font-sans select-none">
      <div className="w-5 h-5 rounded-full bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center">
        <Sparkles className="w-3 h-3 animate-spin" />
      </div>
      <div className="flex items-center space-x-1.5 text-xs font-mono">
        <span className="font-semibold text-[#8C827A]">Synthesizing telemetry</span>
        <span className="flex space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F47A24] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F47A24] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#F47A24] animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  );
};
