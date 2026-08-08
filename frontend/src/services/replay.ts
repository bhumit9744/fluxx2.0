const API_BASE = 'http://localhost:8000/api';

export const replayService = {
  async start() {
    return fetch(`${API_BASE}/replay/start`, { method: 'POST' }).then(r => r.json());
  },

  async pause() {
    return fetch(`${API_BASE}/replay/pause`, { method: 'POST' }).then(r => r.json());
  },

  async reset() {
    return fetch(`${API_BASE}/replay/reset`, { method: 'POST' }).then(r => r.json());
  },

  async setSpeed(speed: number) {
    return fetch(`${API_BASE}/replay/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed })
    }).then(r => r.json());
  },

  async seek(sample: number) {
    return fetch(`${API_BASE}/replay/seek`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sample })
    }).then(r => r.json());
  }
};
