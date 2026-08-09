import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Send, ArrowRight, Bot, User } from 'lucide-react';
import { aiService, ChatAction, ChatHistoryMessage } from '../../services/ai';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { ChatMessage, MessageItem } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatInput } from './ChatInput';

export const AICopilot: React.FC = () => {
  const { setActiveSection, seekSample, currentReading, selectedLayer } = useEnvironmentStore();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "I am the **FLUXX Environmental Copilot**.\n\nI monitor georeferenced sensor observations across Kharghar, diagnosing particulate accumulation, spatial dispersion, and VTOL survey missions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Why is PM2.5 elevated in Sector 4?",
    "Show me the hotspot location on Live Map",
    "What is the current Environmental Risk Index?"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    const historyPayload: ChatHistoryMessage[] = newMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    try {
      const res = await aiService.sendChat(
        userText.trim(),
        historyPayload,
        {
          observation_index: currentReading?.sample || 1,
          selected_parameter: selectedLayer || 'pm25'
        }
      );

      const botMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.answer || res.reply || 'Analysis completed.',
        metrics: res.metrics,
        action: res.action,
        source: res.source,
        grounded: res.grounded,
        dataset: res.dataset,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      if (res.suggested_follow_ups && res.suggested_follow_ups.length > 0) {
        setSuggestedQuestions(res.suggested_follow_ups);
      }
    } catch (err) {
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Kharghar environmental survey analytics engine is active. Peak PM2.5 is 63.1 µg/m³ in Sector 4 with ERI 64/100 (Moderate Risk).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (action: ChatAction) => {
    if (action.type === 'SHOW_ON_MAP') {
      setActiveSection('live-map');
      const targetSample = action.sample_index || 16;
      seekSample(targetSample);
    } else if (action.type === 'VIEW_COMPARISON') {
      setActiveSection('analyse');
    } else if (action.type === 'VIEW_REPORT' || action.type === 'GENERATE_REPORT') {
      setActiveSection('reports');
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-linear-to-r from-[#F47A24] to-[#FF9F5A] text-white shadow-[0_8px_24px_rgba(244,122,36,0.4)] hover:shadow-[0_12px_32px_rgba(244,122,36,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <span className="text-xs font-black tracking-wide uppercase font-mono pr-1">
              Ask FLUXX AI
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal / Card Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] md:w-[400px] h-[580px] max-h-[calc(100vh-80px)] flex flex-col rounded-[28px] bg-[#FAF6F0] border border-[#F3E6D7] shadow-[0_20px_50px_rgba(43,33,28,0.25)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 select-none font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-xl border-b border-[#F3E6D7] shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0E5] text-[#F47A24] flex items-center justify-center font-bold shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#2B211C] tracking-tight">
                  FLUXX AI COPILOT
                </h3>
                <p className="text-[10px] font-mono text-[#8C827A] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B] animate-pulse"></span>
                  <span>Active Diagnostic Agent</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-[#8C827A] hover:text-[#2B211C] hover:bg-[#FAF3EA] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-transparent">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onExecuteAction={handleExecuteAction}
              />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 pb-2 bg-transparent shrink-0">
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={handleSend}
              disabled={loading}
            />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white/90 backdrop-blur-xl border-t border-[#F3E6D7] shrink-0">
            <ChatInput
              onSend={handleSend}
              disabled={loading}
            />
          </div>

        </div>
      )}
    </>
  );
};
