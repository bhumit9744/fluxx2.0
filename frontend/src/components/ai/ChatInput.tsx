import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Ask FLUXX AI about telemetry & insights..."
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 font-sans select-none"
    >
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-3.5 pr-9 py-2.5 rounded-2xl bg-[#FAF3EA] border border-[#F3E6D7] text-xs font-medium text-[#2B211C] placeholder-[#8C827A] focus:outline-none focus:border-[#F47A24] focus:ring-2 focus:ring-[#F47A24]/10 transition-all disabled:opacity-50"
        />
        <Sparkles className="absolute right-3 w-3.5 h-3.5 text-[#F47A24]/60 pointer-events-none" />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-9 h-9 rounded-2xl bg-linear-to-tr from-[#F47A24] to-[#FF9F5A] hover:opacity-95 disabled:opacity-40 text-white transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0 active:scale-95"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
