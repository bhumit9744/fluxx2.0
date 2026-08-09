import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onSelect,
  disabled = false
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-1.5 font-sans select-none">
      <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-[#8C827A] uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-[#F47A24]" />
        <span>Suggested Prompts</span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-xl bg-[#FFF9F2] hover:bg-[#FFF0E5] border border-[#F3E6D7] hover:border-[#F47A24]/40 text-[11px] font-medium text-[#2B211C] hover:text-[#F47A24] disabled:opacity-40 transition-all text-left cursor-pointer shadow-2xs flex items-center space-x-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F47A24]" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
