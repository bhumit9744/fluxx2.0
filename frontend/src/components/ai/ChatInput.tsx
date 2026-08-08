import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Ask FLUXX about Kharghar survey..."
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
      className="p-3 border-t border-white/10 bg-slate-950 flex items-center space-x-2 shrink-0 font-sans"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#0EA89A] transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-2.5 rounded-2xl bg-[#0EA89A] hover:bg-[#0C8E82] disabled:opacity-40 text-white transition-all cursor-pointer shadow-md flex items-center justify-center"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
