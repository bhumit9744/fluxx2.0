const API_BASE = 'http://localhost:8000/api';

export interface ChatMetric {
  label: string;
  value: string;
}

export interface ChatAction {
  type: 'SHOW_ON_MAP' | 'VIEW_REPORT' | 'ANALYZE_HOTSPOT' | 'VIEW_COMPARISON' | 'GENERATE_REPORT' | string;
  label?: string;
  latitude?: number;
  longitude?: number;
  sample_index?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  reply: string;
  metrics?: ChatMetric[];
  action?: ChatAction | null;
  suggested_follow_ups?: string[];
  source?: string;
  context_summary?: {
    observations: number;
    eri: number;
    hotspot_peak: number;
  };
}

export const aiService = {
  async sendChat(
    message: string,
    messages: ChatHistoryMessage[] = [],
    context?: { observation_index?: number; selected_parameter?: string }
  ): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        messages,
        context
      })
    });

    if (!res.ok) {
      throw new Error(`AI Copilot API responded with status ${res.status}`);
    }

    return res.json();
  },

  async getEnvironmentalContext() {
    const res = await fetch(`${API_BASE}/ai/context`);
    if (!res.ok) throw new Error('Failed to fetch environmental context');
    return res.json();
  }
};
