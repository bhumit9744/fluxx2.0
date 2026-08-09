const API_BASE = 'http://localhost:8000/api/v1';

export const apiService = {
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  async getSamples() {
    const res = await fetch(`${API_BASE}/replay/samples`);
    if (!res.ok) throw new Error('Failed to fetch observations dataset');
    return res.json();
  },

  async getAvailableDatasets() {
    const res = await fetch(`${API_BASE}/ai/datasets`);
    if (!res.ok) throw new Error('Failed to list datasets');
    return res.json();
  },

  async switchDataset(filename: string) {
    const res = await fetch(`${API_BASE}/replay/dataset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    if (!res.ok) throw new Error('Failed to switch dataset');
    return res.json();
  },

  async getTelemetryHistory() {
    const res = await fetch(`${API_BASE}/telemetry/history`);
    if (!res.ok) throw new Error('Failed to fetch telemetry history');
    return res.json();
  },

  async getHeatmap(layer: string = 'pm25', upto?: number, gridSize: number = 75) {
    const url = upto 
      ? `${API_BASE}/heatmap?parameter=${layer}&upto=${upto}&grid_size=${gridSize}`
      : `${API_BASE}/heatmap?parameter=${layer}&grid_size=${gridSize}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch spatial heatmap');
    return res.json();
  },

  async getMapData() {
    const res = await fetch(`${API_BASE}/map/data`);
    if (!res.ok) throw new Error('Failed to fetch live map data');
    return res.json();
  },

  async getMapHeatmap(parameter: string = 'pm25') {
    const res = await fetch(`${API_BASE}/map/heatmap?parameter=${parameter}`);
    if (!res.ok) throw new Error('Failed to fetch parameter heatmap');
    return res.json();
  },

  async getAIAnalysis() {
    const res = await fetch(`${API_BASE}/ai/analysis`);
    if (!res.ok) throw new Error('Failed to fetch AI analysis');
    return res.json();
  },

  async getReportData() {
    const res = await fetch(`${API_BASE}/reports/data`);
    if (!res.ok) throw new Error('Failed to fetch report audit data');
    return res.json();
  },

  async processDataset() {
    const res = await fetch(`${API_BASE}/analysis/process`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to process and validate dataset');
    return res.json();
  },

  async runAnalysis(parameter: string = 'pm25') {
    const res = await fetch(`${API_BASE}/analysis/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameter })
    });
    if (!res.ok) throw new Error('Failed to execute environmental analysis');
    return res.json();
  },

  async generateReport(payload: any = {}) {
    const res = await fetch(`${API_BASE}/reports/generate`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to trigger report generation');
    return res.json();
  },

  async sendChatMessage(message: string, history: any[] = []) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) throw new Error('Failed to send chat message');
    return res.json();
  },

  async uploadCSVFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/reports/upload-csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to upload CSV' }));
      throw new Error(err.detail || 'Failed to upload and parse CSV dataset');
    }
    return res.json();
  },

  async getReports(params?: { search?: string; category?: string; sort_by?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/reports${qs}`);
    if (!res.ok) throw new Error('Failed to fetch reports library');
    return res.json();
  },

  async getReportById(id: string) {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch report ${id}`);
    return res.json();
  },

  async deleteReport(id: string) {
    const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete report ${id}`);
    return res.json();
  },

  getDownloadPdfUrl(reportId?: string) {
    return reportId ? `${API_BASE}/reports/${reportId}/html` : `${API_BASE}/reports/download`;
  }
};
