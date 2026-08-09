export type WebSocketCallback = (data: any) => void;

class WebSocketClient {
  private url: string = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/live';
  private ws: WebSocket | null = null;
  private listeners: Set<WebSocketCallback> = new Set();
  private reconnectTimeout: any = null;

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WS Connection established');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((callback) => callback(data));
        } catch (e) {
          console.error('Error parsing WS event:', e);
        }
      };

      this.ws.onclose = () => {
        this.reconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      this.reconnect();
    }
  }

  subscribe(callback: WebSocketCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private reconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 3000);
  }
}

export const wsClient = new WebSocketClient();
