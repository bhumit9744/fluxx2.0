import React from 'react';
import { Sparkles, User, Check, Copy } from 'lucide-react';
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
  grounded?: boolean;
  dataset?: string | null;
}

interface ChatMessageProps {
  message: MessageItem;
  onExecuteAction: (action: ChatAction) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExecuteAction }) => {
  const isUser = message.sender === 'user';
  const actionsList = message.actions || (message.action ? [message.action] : []);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 font-sans select-none`}>
      
      {/* Sender Pill */}
      <div className="flex items-center space-x-1.5 px-1">
        {isUser ? (
          <>
            <span className="text-[10px] font-mono font-bold text-[#8C827A] uppercase tracking-wider">You</span>
            <div className="w-4 h-4 rounded-full bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center">
              <User className="w-2.5 h-2.5" />
            </div>
          </>
        ) : (
          <>
            <div className="w-4 h-4 rounded-full bg-linear-to-tr from-[#F47A24] to-[#FF9F5A] flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#F47A24] uppercase tracking-wider">FLUXX COPILOT</span>
          </>
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-linear-to-r from-[#F47A24] to-[#E06815] text-white rounded-tr-xs shadow-xs font-medium'
            : 'bg-white/95 backdrop-blur-xl border border-[#F3E6D7] text-[#2B211C] rounded-tl-xs shadow-xs'
        }`}
      >
        <div className="whitespace-pre-line text-xs font-normal space-y-1.5">
          {message.text}
        </div>

        {/* Quantitative Metrics Rail */}
        {message.metrics && message.metrics.length > 0 && (
          <MetricRail metrics={message.metrics} />
        )}

        {/* Action Buttons */}
        {actionsList.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[#F3E6D7] flex flex-wrap gap-2">
            {actionsList.map((act, idx) => (
              <AIActionButton 
                key={idx} 
                action={act} 
                onClick={onExecuteAction} 
              />
            ))}
          </div>
        )}

        {/* Grounded Indicator */}
        {message.grounded && message.dataset && (
          <div className="mt-2 pt-2 border-t border-[#F3E6D7] flex items-center space-x-1.5 text-[10px] font-mono text-[#3FA66B]">
            <Check className="w-3 h-3" />
            <span>Grounded in {message.dataset}</span>
          </div>
        )}
      </div>

      {/* Footer Timestamp, Source & Copy */}
      <div className="flex items-center space-x-2 px-1 text-[9.5px] font-mono text-[#8C827A]">
        <span>{message.timestamp}</span>
        {message.source && <span>· {message.source}</span>}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="hover:text-[#2B211C] p-0.5 rounded cursor-pointer transition-colors"
            title="Copy message"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-[#16A34A]" /> : <Copy className="w-2.5 h-2.5" />}
          </button>
        )}
      </div>

    </div>
  );
};
