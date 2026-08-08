import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/10 border border-white/10 text-slate-300 max-w-[260px] animate-pulse">
      <div className="w-5 h-5 rounded-full bg-[#0EA89A]/30 flex items-center justify-center text-[#3DD6C6]">
        <Sparkles className="w-3 h-3 animate-spin" />
      </div>
      <div className="flex items-center space-x-1.5 text-xs font-mono">
        <span>Reasoning over CSV</span>
        <span className="flex space-x-1">
          <span className="w-1 h-1 rounded-full bg-[#3DD6C6] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 rounded-full bg-[#3DD6C6] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 rounded-full bg-[#3DD6C6] animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  );
};
