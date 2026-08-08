import React from 'react';

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
    <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] shrink-0 font-sans">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
        Suggested Follow-ups
      </span>
      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:text-white disabled:opacity-40 transition-all text-left cursor-pointer flex items-center space-x-1"
          >
            <span className="text-[#0EA89A] font-bold">•</span>
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
