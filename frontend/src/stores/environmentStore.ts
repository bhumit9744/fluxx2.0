import { create } from 'zustand';
import {
  NormalizedReading,
  ReplayStatus,
  EnvironmentalRiskIndex,
  IDWHeatmapData,
  AIAnalysisReport
} from '../types/environment';
import { apiService } from '../services/api';
import { calculateIDW } from '../utils/idwCalculator';
import { replayService } from '../services/replay';
import { wsClient } from '../services/websocket';
import { FlightState } from '../types/flight';
import { calculateMetrics, getDefaultMetrics, DashboardMetrics } from '../utils/calculateMetrics';

export type AppMode = 'home' | 'login' | 'dashboard';
export type PrimarySection = 'overview' | 'environment' | 'analyse' | 'reports' | 'live-map' | 'intelligence' | 'flight-ops';
export type MapEngineType = 'google_3d' | 'maplibre_twin';
export type LayerType = 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'windSpeed';
export type MapTheme = 'satellite' | 'dark' | 'light';

export interface ReportItem {
  id: string;
  title: string;
  type: 'survey' | 'analysis' | 'compliance' | 'incident' | string;
  location: string;
  createdAt: string;
  created_at?: string;
  dataset: {
    filename: string;
    observations: number;
    startTime: string;
    endTime: string;
  };
  observations: number;
  metrics: {
    pm25?: number;
    pm10?: number;
    co2?: number;
    temperature?: number;
    humidity?: number;
    wind?: number;
  };
  pm25?: number;
  eri?: number;
  risk: {
    score: number;
    level: string;
  };
  risk_level?: string;
  summary: string;
  findings?: string[];
  pros?: string[];
  cons?: string[];
  recommendations?: any[];
  fullReport?: any;
  pdfUrl?: string;
}

export interface EnvironmentState {
  appMode: AppMode;
  activeSection: PrimarySection;
  currentReading: NormalizedReading;
  history: NormalizedReading[];
  allSamples: NormalizedReading[];
  replayStatus: ReplayStatus;
  eri: EnvironmentalRiskIndex | null;
  heatmapData: IDWHeatmapData | null;
  liveMapData: any | null;
  selectedLayer: LayerType;
  showSensors: boolean;
  showHeatmap: boolean;
  showPath: boolean;
  showConfidence: boolean;
  showVTOL: boolean;
  is3DMode: boolean;
  presentationMode: boolean;
  connected: boolean;
  mapEngine: MapEngineType;
  mapTheme: MapTheme;
  googleMapsApiKey: string;
  isGeneratingReport: boolean;
  reportData: AIAnalysisReport | null;
  aiChatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  isAiProcessing: boolean;

  // Dashboard Unified State
  dashboardData: DashboardMetrics;
  timeFilter: '6H' | '12H' | '24H' | '7D' | '30D';
  isUploadModalOpen: boolean;
  availableDatasets: string[];
  activeDataset: string;

  // Reports Section State
  reportsList: ReportItem[];
  selectedReportDetail: ReportItem | null;
  isReportsLoading: boolean;
  reportsSearchQuery: string;
  reportsCategoryFilter: string;
  reportsSortBy: string;
  isReportPreviewOpen: boolean;

  // Analysis 3-Step Workflow State
  workflow: {
    currentStep: 'process' | 'analysis' | 'report' | 'complete';
    processing: {
      status: 'idle' | 'processing' | 'complete' | 'error';
      progress: number;
      details?: any;
      error?: string;
    };
    analysis: {
      status: 'idle' | 'processing' | 'complete' | 'error';
      progress: number;
      result?: any;
      error?: string;
    };
    report: {
      status: 'idle' | 'generating' | 'complete' | 'error';
      progress: number;
      url?: string;
      reportData?: any;
      error?: string;
    };
  };

  // Hardware & Spatial Settings
  flightState: FlightState;

  // Actions
  setAppMode: (appMode: AppMode) => void;
  setActiveSection: (activeSection: PrimarySection) => void;
  setSelectedLayer: (selectedLayer: LayerType) => void;
  setShowSensors: (show: boolean) => void;
  setShowHeatmap: (show: boolean) => void;
  setShowPath: (show: boolean) => void;
  setShowConfidence: (show: boolean) => void;
  setShowVTOL: (show: boolean) => void;
  setIs3DMode: (mode: boolean) => void;
  setPresentationMode: (mode: boolean) => void;
  setTimeFilter: (filter: '6H' | '12H' | '24H' | '7D' | '30D') => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  setDashboardData: (data: DashboardMetrics) => void;
  recalculateDashboard: () => void;

  // Reports Actions
  fetchReports: () => Promise<void>;
  fetchReportById: (id: string) => Promise<ReportItem | null>;
  deleteReport: (id: string) => Promise<void>;
  generateAndSaveReport: (payload?: any) => Promise<string | null>;
  setReportsSearchQuery: (query: string) => void;
  setReportsCategoryFilter: (category: string) => void;
  setReportsSortBy: (sortBy: string) => void;
  setReportPreviewOpen: (open: boolean) => void;
  setSelectedReportDetail: (report: ReportItem | null) => void;

  setWorkflowStep: (step: 'process' | 'analysis' | 'report' | 'complete') => void;
  updateWorkflowState: (partial: Partial<EnvironmentState['workflow']>) => void;
  resetWorkflow: () => void;

  setMapEngine: (engine: MapEngineType) => void;
  setMapTheme: (theme: MapTheme) => void;
  setGoogleMapsApiKey: (key: string) => void;
  setIsGeneratingReport: (loading: boolean) => void;
  setReportData: (data: AIAnalysisReport | null) => void;
  setFlightState: (partial: Partial<FlightState>) => void;
  dispatchVTOL: (targetLat: number, targetLng: number) => void;
  
  // Async Methods
  initStore: () => void;
  fetchDashboard: () => Promise<void>;
  fetchSamples: () => Promise<void>;
  fetchHeatmap: (layer?: LayerType, upto?: number) => Promise<void>;
  fetchLiveMapData: () => Promise<void>;
  fetchReport: () => Promise<AIAnalysisReport | null>;
  uploadAndIngestCSV: (file: File) => Promise<any>;
  startReplay: () => Promise<void>;
  pauseReplay: () => Promise<void>;
  resetReplay: () => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  seekSample: (sample: number) => Promise<void>;
  
  fetchDatasets: () => Promise<void>;
  switchActiveDataset: (filename: string) => Promise<void>;
}

const defaultReading: NormalizedReading = {
  sample: 1,
  total_samples: 50,
  timestamp: '2026-08-08T06:00:00Z',
  source: 'kharghar_csv',
  mode: 'replay',
  location: {
    latitude: 19.05028,
    longitude: 73.06907,
    elevation: 15.0
  },
  sensors: {
    pm25: 48.5,
    pm10: 77.3,
    co2: 558.8,
    temperature: 28.1,
    humidity: 80.1,
    windSpeed: 2.6,
    windDirection: 240.0
  }
};

const defaultERI: EnvironmentalRiskIndex = {
  score: 64,
  level: 'MODERATE',
  primary_pollutant: 'PM2.5 Surge',
  factors: {
    pm25_surge: 64,
    pm10_elevation: 22,
    wind_stagnation: 11,
    humidity: 6
  },
  recommendation: 'Localized PM2.5 elevation detected. Maintain survey sampling around hotspot.',
  timestamp: '2026-08-08T06:00:00Z'
};

const defaultStatus: ReplayStatus = {
  playing: false,
  status: 'PAUSED',
  speed: 1.0,
  currentSample: 1,
  totalSamples: 50,
  timestamp: '2026-08-08T06:00:00Z',
  source: 'kharghar_csv',
  mode: 'replay'
};

const initialApiKey = (typeof window !== 'undefined' && localStorage.getItem('fluxx_gmaps_key')) 
  || import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
  || 'AIzaSyDY1spcnvs42sKq9JT0lzcUPmgjKbUAfGI';

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  appMode: 'dashboard',
  activeSection: 'overview',
  currentReading: defaultReading,
  history: [defaultReading],
  allSamples: [],
  replayStatus: defaultStatus,
  eri: defaultERI,
  heatmapData: null,
  liveMapData: null,
  selectedLayer: 'pm25',
  showSensors: true,
  showHeatmap: true,
  showPath: false,
  showConfidence: false,
  showVTOL: true,
  is3DMode: true,
  presentationMode: false,
  connected: false,
  mapEngine: 'google_3d',
  mapTheme: 'satellite',
  googleMapsApiKey: initialApiKey,
  isGeneratingReport: false,
  reportData: null,
  aiChatHistory: [],
  isAiProcessing: false,

  // Dashboard Unified State
  dashboardData: getDefaultMetrics('kharghar_dataset.csv'),
  timeFilter: '24H',
  isUploadModalOpen: false,
  availableDatasets: [],
  activeDataset: 'fluxx_kharghar_300_observations.csv',

  // Reports Section Initial State
  reportsList: [],
  selectedReportDetail: null,
  isReportsLoading: false,
  reportsSearchQuery: '',
  reportsCategoryFilter: 'All',
  reportsSortBy: 'newest',
  isReportPreviewOpen: false,

  workflow: {
    currentStep: 'process',
    processing: {
      status: 'idle',
      progress: 0,
      details: null,
      error: undefined
    },
    analysis: {
      status: 'idle',
      progress: 0,
      result: null,
      error: undefined
    },
    report: {
      status: 'idle',
      progress: 0,
      url: undefined,
      reportData: null,
      error: undefined
    }
  },

  flightState: {
    droneId: 'VTOL-001',
    status: 'READY',
    mode: 'HOLD',
    altitude: 0,
    airspeed: 0,
    battery: 98,
    signal: 100,
    latitude: 19.043,
    longitude: 73.068,
    heading: 0,
    pitch: 0,
    roll: 0,
    satellites: 12,
    missionProgress: 0,
    missionStage: 'TAKEOFF',
    targetLatitude: null,
    targetLongitude: null,
  },

  setAppMode: (appMode) => set({ appMode }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setSelectedLayer: (selectedLayer) => {
    set({ selectedLayer });
    get().fetchHeatmap(selectedLayer);
  },
  setShowSensors: (showSensors) => set({ showSensors }),
  setShowHeatmap: (showHeatmap) => set({ showHeatmap }),
  setShowPath: (showPath) => set({ showPath }),
  setShowConfidence: (showConfidence) => set({ showConfidence }),
  setShowVTOL: (show) => set({ showVTOL: show }),
  setIs3DMode: (mode) => set({ is3DMode: mode }),
  setPresentationMode: (mode) => set({ presentationMode: mode }),
  setTimeFilter: (filter) => {
    set({ timeFilter: filter });
    get().recalculateDashboard();
  },
  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),
  setDashboardData: (dashboardData) => set({ dashboardData }),
  recalculateDashboard: () => {
    const samples = get().allSamples;
    const filename = get().replayStatus.source || 'kharghar_dataset.csv';
    const filter = get().timeFilter;
    const calculated = calculateMetrics(samples, filename, filter);
    set({ dashboardData: calculated });
  },

  setWorkflowStep: (step) => set((state) => ({ workflow: { ...state.workflow, currentStep: step } })),
  updateWorkflowState: (partial) => set((state) => ({ workflow: { ...state.workflow, ...partial } })),
  resetWorkflow: () => set({
    workflow: {
      currentStep: 'process',
      processing: { status: 'idle', progress: 0, details: null, error: undefined },
      analysis: { status: 'idle', progress: 0, result: null, error: undefined },
      report: { status: 'idle', progress: 0, url: undefined, reportData: null, error: undefined }
    }
  }),

  // Reports Actions
  setReportsSearchQuery: (reportsSearchQuery) => {
    set({ reportsSearchQuery });
  },
  setReportsCategoryFilter: (reportsCategoryFilter) => {
    set({ reportsCategoryFilter });
  },
  setReportsSortBy: (reportsSortBy) => {
    set({ reportsSortBy });
  },
  setReportPreviewOpen: (isReportPreviewOpen) => {
    set({ isReportPreviewOpen });
  },
  setSelectedReportDetail: (selectedReportDetail) => {
    set({ selectedReportDetail });
  },

  fetchReports: async () => {
    set({ isReportsLoading: true });
    try {
      const search = get().reportsSearchQuery;
      const category = get().reportsCategoryFilter;
      const sortBy = get().reportsSortBy;
      const res = await apiService.getReports({ search, category, sort_by: sortBy });
      if (res && res.reports) {
        set({ reportsList: res.reports, isReportsLoading: false });
      } else {
        set({ isReportsLoading: false });
      }
    } catch (e) {
      console.warn('Failed to fetch reports list:', e);
      set({ isReportsLoading: false });
    }
  },

  fetchReportById: async (id: string) => {
    try {
      const res = await apiService.getReportById(id);
      if (res && res.report) {
        set({ selectedReportDetail: res.report, isReportPreviewOpen: true });
        return res.report;
      }
      return null;
    } catch (e) {
      console.error('Failed to fetch report by id:', e);
      return null;
    }
  },

  deleteReport: async (id: string) => {
    try {
      await apiService.deleteReport(id);
      set((state) => ({
        reportsList: state.reportsList.filter((r) => r.id !== id),
        selectedReportDetail: state.selectedReportDetail?.id === id ? null : state.selectedReportDetail
      }));
    } catch (e) {
      console.error('Failed to delete report:', e);
    }
  },

  generateAndSaveReport: async (payload?: any) => {
    try {
      const res = await apiService.generateReport();
      await get().fetchReports();
      return res.reportId || null;
    } catch (e) {
      console.error('Failed to generate and save report:', e);
      return null;
    }
  },

  setMapEngine: (engine) => set({ mapEngine: engine }),
  setMapTheme: (theme) => set({ mapTheme: theme }),
  setGoogleMapsApiKey: (key) => {
    localStorage.setItem('fluxx_gmaps_key', key);
    set({ googleMapsApiKey: key });
  },
  setIsGeneratingReport: (isGeneratingReport) => set({ isGeneratingReport }),
  setReportData: (reportData) => set({ reportData }),
  setFlightState: (partial) => set((state) => ({ 
    flightState: { ...state.flightState, ...partial } 
  })),

  dispatchVTOL: (targetLat, targetLng) => {
    set((state) => ({
      activeSection: 'flight-ops',
      flightState: {
        ...state.flightState,
        status: 'AIRBORNE',
        mode: 'AUTO',
        missionStage: 'TRANSIT',
        targetLatitude: targetLat,
        targetLongitude: targetLng,
      }
    }));
  },

  initStore: () => {
    wsClient.connect();
    wsClient.subscribe((data) => {
      if (data.type === 'TELEMETRY_UPDATE' || data.type === 'INITIAL_STATE') {
        const reading = data.reading as NormalizedReading;
        const eri = data.eri as EnvironmentalRiskIndex;
        const status = data.status as ReplayStatus;

        set((state) => ({
          currentReading: reading,
          eri: eri || state.eri,
          replayStatus: status || state.replayStatus,
          history: [...state.history, reading].slice(-50),
          connected: true
        }));
      }
    });

    get().fetchDashboard();
    get().fetchSamples();
    get().fetchHeatmap('pm25');
    get().fetchLiveMapData();
    get().fetchReport();
    get().fetchReports();
    get().fetchDatasets();
  },

  fetchDashboard: async () => {
    try {
      const data = await apiService.getDashboardSummary();
      if (data && data.metrics) {
        set({ dashboardData: data });
      }
    } catch (e) {
      console.warn('Failed to fetch dashboard summary, recalculating locally:', e);
      get().recalculateDashboard();
    }
  },

  fetchSamples: async () => {
    try {
      const data = await apiService.getSamples();
      const samples = data.samples || [];
      set({ allSamples: samples });
      get().recalculateDashboard();
    } catch (e) {
      console.warn('Failed to fetch samples:', e);
    }
  },

  fetchHeatmap: async (layer, upto) => {
    try {
      const activeLayer = layer || get().selectedLayer;
      const samples = get().allSamples;
      
      // Compute IDW matrix entirely on frontend
      const idwResult = calculateIDW(samples, activeLayer, 100, 2.0);
      
      if (idwResult) {
        set({ heatmapData: idwResult });
      }
    } catch (e) {
      console.error('Failed to calculate spatial heatmap locally:', e);
    }
  },

  fetchLiveMapData: async () => {
    try {
      const data = await apiService.getMapData();
      set({ liveMapData: data });
    } catch (e) {
      console.warn('Failed to fetch live map data:', e);
    }
  },

  fetchReport: async () => {
    try {
      const data = await apiService.getReportData();
      set({ reportData: data });
      return data;
    } catch (e) {
      console.warn('Failed to fetch report data:', e);
      return null;
    }
  },

  uploadAndIngestCSV: async (file: File) => {
    try {
      const res = await apiService.uploadCSVFile(file);
      if (res.report) {
        set({ reportData: res.report });
      }
      // Re-fetch samples, heatmap and map data with the new dataset
      const samplesRes = await apiService.getSamples();
      if (samplesRes.samples && samplesRes.samples.length > 0) {
        set({
          allSamples: samplesRes.samples,
          currentReading: samplesRes.samples[0]
        });
      }
      const heatmap = await apiService.getHeatmap(get().selectedLayer, undefined, 75);
      set({ heatmapData: heatmap });
      await get().fetchDashboard();
      await get().fetchLiveMapData();
      await get().fetchReports();
      get().resetWorkflow();
      return res;
    } catch (e) {
      console.error('Failed to upload and ingest CSV:', e);
      throw e;
    }
  },

  startReplay: async () => {
    try {
      await replayService.start();
    } catch (e) {}
  },

  pauseReplay: async () => {
    try {
      await replayService.pause();
    } catch (e) {}
  },

  resetReplay: async () => {
    try {
      await replayService.reset();
    } catch (e) {}
  },

  setSpeed: async (speed) => {
    try {
      await replayService.setSpeed(speed);
    } catch (e) {}
  },

  seekSample: async (sample) => {
    try {
      await replayService.seek(sample);
    } catch (e) {}
  },
  
  fetchDatasets: async () => {
    try {
      const res = await apiService.getAvailableDatasets();
      if (res && res.files) {
        set({ availableDatasets: res.files });
      }
    } catch (e) {
      console.error('Failed to fetch datasets:', e);
    }
  },

  switchActiveDataset: async (filename: string) => {
    try {
      await apiService.switchDataset(filename);
      set({ activeDataset: filename });
      
      // Refetch all dependent state
      await get().fetchSamples();
      await get().fetchDashboard();
      await get().fetchLiveMapData();
      await get().fetchHeatmap(get().selectedLayer);
    } catch (e) {
      console.error('Failed to switch dataset:', e);
    }
  }
}));
