import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MapPin,
  FileText,
  TrendingUp,
  ShieldCheck,
  Check,
  Maximize2,
  Minimize2,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useEnvironmentStore } from '../../stores/environmentStore';

interface MetricItem {
  label: string;
  value: string;
}

interface ActionItem {
  type: string;
  coordinates?: { latitude: number; longitude: number };
  label?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  metrics?: MetricItem[];
  action?: ActionItem | null;
  timestamp: string;
}

export const ChatDrawer: React.FC = () => {
  const { setActiveSection, seekSample } = useEnvironmentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "I'm your **FLUXX Environmental Copilot**, grounded directly in the 50 Kharghar CSV observations and real-time IDW spatial field.\n\nAsk me anything about particulate peaks, spatial hotspots, or mitigation directives.",
      metrics: [
        { label: "LOCATION", value: "Kharghar, Navi Mumbai" },
        { label: "DATASET", value: "50 CSV observations" },
        { label: "SURVEY BASELINE", value: "42.3 µg/m³ PM2.5" }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const suggestedQuestions = [
    "What is the highest PM2.5 reading?",
    "Where is the hotspot?",
    "Is the environment improving?",
    "Summarize this survey",
    "What are the major risks?",
    "What is the NO₂ concentration?"
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const res = await apiService.sendChatMessage(textToSend);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.answer || res.reply || 'Analysis completed.',
        metrics: res.metrics,
        action: res.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Telemetry reasoning endpoint unavailable. Grounded facts: Kharghar Sector 4 PM2.5 peak is 63.1 µg/m³ with ERI 64/100.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: ActionItem) => {
    if (action.type === 'SHOW_ON_MAP') {
      setActiveSection('overview');
      // Seek replay to hotspot observation #16
      seekSample(16);
      setIsOpen(false);
    } else if (action.type === 'VIEW_REPORT') {
      setActiveSection('reports');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 1. Floating Glass Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-[#0EA89A]/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer font-sans group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0EA89A] to-[#3DD6C6] flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs tracking-wider text-slate-100 group-hover:text-white">
            ✦ FLUXX AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* 2. Expandable Glass Copilot Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 font-sans flex flex-col ${
            isExpanded
              ? 'inset-3 md:inset-8 rounded-3xl'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[410px] max-w-[calc(100vw-2rem)] h-[min(540px,calc(100vh-4.5rem))] rounded-3xl'
          } bg-slate-950/95 backdrop-blur-3xl border border-white/15 text-white shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.03] shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#0EA89A] to-[#3DD6C6] flex items-center justify-center text-slate-950 font-black shadow-md">
                ✦
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-wide flex items-center space-x-2">
                  <span>FLUXX AI</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#0EA89A]/20 text-[#3DD6C6] font-mono text-[9px] font-bold">
                    COPILOT
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Environmental Intelligence Copilot</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#0EA89A] text-white rounded-br-none shadow-md shadow-[#0EA89A]/20'
                      : 'bg-white/10 border border-white/10 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                  {/* Supporting Grounded Metric Cards */}
                  {m.metrics && m.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                      {m.metrics.map((met, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {met.label}
                          </span>
                          <span className="font-mono font-bold text-xs text-[#3DD6C6] block mt-0.5">
                            {met.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button (e.g. SHOW ON MAP / VIEW REPORT) */}
                  {m.action && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => handleAction(m.action!)}
                        className="w-full py-2 px-3 rounded-xl bg-[#0EA89A] hover:bg-[#0C8E82] text-white font-bold text-[11px] transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                      >
                        {m.action.type === 'SHOW_ON_MAP' ? (
                          <MapPin className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                        <span>{m.action.label || 'Execute Action'}</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-white/5 border border-white/5 max-w-[200px]">
                <Loader2 className="w-3.5 h-3.5 text-[#3DD6C6] animate-spin" />
                <span className="text-slate-400 text-xs font-mono">Analyzing telemetry...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Suggested
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 hover:text-white transition-all text-left cursor-pointer flex items-center space-x-1"
                >
                  <span>•</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-slate-950 flex items-center space-x-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask FLUXX about Kharghar survey..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#0EA89A] transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-2xl bg-[#0EA89A] hover:bg-[#0C8E82] disabled:opacity-40 text-white transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
