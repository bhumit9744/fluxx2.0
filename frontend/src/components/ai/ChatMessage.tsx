import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { MetricRail } from './MetricRail';
import { AIActionButton } from './AIActionButton';
import { ChatMetric, ChatAction } from '../../services/ai';

export interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  metrics?: ChatMetric[];
  action?: ChatAction | null;
  actions?: ChatAction[];
  timestamp: string;
  source?: string;
}

interface ChatMessageProps {
  message: MessageItem;
  onExecuteAction: (action: ChatAction) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExecuteAction }) => {
  const isUser = message.sender === 'user';
  const actionsList = message.actions || (message.action ? [message.action] : []);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
      {/* Sender Header Pill */}
      <div className="flex items-center space-x-1.5 px-1">
        {isUser ? (
          <>
            <span className="text-[10px] font-bold text-[var(--fluxx-muted)] uppercase tracking-wider">You</span>
            <div className="w-3.5 h-3.5 rounded-full bg-[rgba(244,122,36,0.1)] flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-[var(--fluxx-orange)]" />
            </div>
          </>
        ) : (
          <>
            <div className="w-3.5 h-3.5 rounded-full bg-linear-to-tr from-[var(--fluxx-orange)] to-[var(--fluxx-coral)] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[var(--fluxx-orange)] uppercase tracking-wider">FLUXX AI</span>
          </>
        )}
      </div>

      {/* Message Bubble Card */}
      <div
        className={`max-w-[92%] p-3.5 rounded-2xl text-xs font-sans leading-relaxed ${
          isUser
            ? 'bg-[var(--fluxx-orange)] text-white rounded-tr-none shadow-xs'
            : 'bg-[var(--fluxx-glass-light)] backdrop-blur-md border border-[var(--fluxx-border)] text-[var(--fluxx-text)] rounded-tl-none shadow-2xs'
        }`}
      >
        <div className="whitespace-pre-line text-xs font-normal space-y-1.5">
          {message.text}
        </div>

        {/* Structured Quantitative Metrics Rail */}
        {message.metrics && message.metrics.length > 0 && (
          <MetricRail metrics={message.metrics} />
        )}

        {/* Interactive Action Trigger Buttons */}
        {actionsList.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
            {actionsList.map((act, idx) => (
              <AIActionButton 
                key={idx} 
                action={act} 
                onClick={onExecuteAction} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Timestamp & Model Source */}
      <div className="flex items-center space-x-2 px-1 text-[9px] text-slate-400">
        <span>{message.timestamp}</span>
        {message.source && (
          <span className="font-mono text-slate-400">· {message.source}</span>
        )}
      </div>
    </div>
  );
};
