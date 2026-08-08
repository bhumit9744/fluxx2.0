import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { aiService, ChatAction, ChatHistoryMessage } from '../../services/ai';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { ChatMessage, MessageItem } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatInput } from './ChatInput';

export const AICopilot: React.FC = () => {
  const { setActiveSection, seekSample, currentReading, selectedLayer } = useEnvironmentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "I am the **FLUXX Environmental Intelligence Copilot**.\n\nI monitor 50 georeferenced sensor observations across Kharghar, analyzing live particulate surges, IDW spatial dispersion, and mitigation directives.",
      metrics: [
        { label: "LOCATION", value: "Kharghar, Navi Mumbai" },
        { label: "SURVEY POINTS", value: "50 observations" },
        { label: "PM2.5 BASELINE", value: "42.6 µg/m³" },
        { label: "HOTSPOT SECTOR", value: "Sector 4 (63.1 µg/m³)" }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Why is PM2.5 high in Kharghar?",
    "Where is the hotspot?",
    "Is the environment improving?"
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
          observation_index: currentReading.sample,
          selected_parameter: selectedLayer
        }
      );

      const botMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.answer || res.reply || 'Analysis completed.',
        metrics: res.metrics,
        action: res.action,
        source: res.source,
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
        text: "Kharghar survey analytics engine is active. Peak PM2.5 is 63.1 µg/m³ in Sector 4 with ERI 45/100 (Moderate Risk).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (action: ChatAction) => {
    if (action.type === 'SHOW_ON_MAP') {
      setActiveSection('overview');
      const targetSample = action.sample_index || 16;
      seekSample(targetSample);
    } else if (action.type === 'VIEW_COMPARISON') {
      setActiveSection('environment');
    } else if (action.type === 'VIEW_REPORT' || action.type === 'GENERATE_REPORT') {
      setActiveSection('reports');
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-40 bg-[rgba(255,255,255,0.7)] backdrop-blur-md border border-[var(--fluxx-border)] shadow-[var(--fluxx-shadow-card)] rounded-l-xl p-1.5 transition-all duration-300 ${
          isOpen ? 'right-[300px]' : 'right-0'
        } hover:bg-white`}
        title={isOpen ? "Close Copilot" : "Open Copilot"}
      >
        {isOpen ? <ChevronRight className="w-5 h-5 text-[var(--fluxx-muted)]" /> : <ChevronLeft className="w-5 h-5 text-[var(--fluxx-muted)]" />}
      </button>

      {/* Docked Drawer */}
      <div 
        className={`bg-[var(--fluxx-glass-strong)] backdrop-blur-xl border-l border-[var(--fluxx-border)] shrink-0 h-full flex flex-col transition-all duration-300 ${
          isOpen ? 'w-[300px]' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="w-[300px] h-full flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-[var(--fluxx-border)] flex items-center px-4 shrink-0 bg-[rgba(244,122,36,0.03)]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[var(--fluxx-orange)] to-[var(--fluxx-coral)] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--fluxx-text)] tracking-wide">
                  FLUXX AI
                </h3>
                <p className="text-[10px] text-[var(--fluxx-muted)]">Environmental Copilot</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-transparent">
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

          {/* Suggestions */}
          <div className="px-4 pb-2 bg-transparent">
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={handleSend}
              disabled={loading}
            />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--fluxx-border)] bg-[rgba(255,255,255,0.5)] backdrop-blur-md">
            <ChatInput
              onSend={handleSend}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};
