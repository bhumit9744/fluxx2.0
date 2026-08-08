import { create } from 'zustand';
import {
  NormalizedReading,
  ReplayStatus,
  EnvironmentalRiskIndex,
  IDWHeatmapData,
  AIAnalysisReport
} from '../types/environment';
import { apiService } from '../services/api';
import { replayService } from '../services/replay';
import { wsClient } from '../services/websocket';

export type AppMode = 'home' | 'login' | 'dashboard';
export type PrimarySection = 'overview' | 'environment' | 'intelligence' | 'reports' | 'flight-ops';
export type MapEngineType = 'google_3d' | 'maplibre_twin';
export type LayerType = 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'windSpeed';


import { FlightState } from '../types/flight';

export interface EnvironmentState {
  appMode: AppMode;
  activeSection: PrimarySection;
  currentReading: NormalizedReading;
  history: NormalizedReading[];
  allSamples: NormalizedReading[];
  replayStatus: ReplayStatus;
  eri: EnvironmentalRiskIndex;
  heatmapData: IDWHeatmapData | null;
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
  googleMapsApiKey: string;
  isGeneratingReport: boolean;
  reportData: AIAnalysisReport | null;


  // Flight Ops Simulation State
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

  setMapEngine: (engine: MapEngineType) => void;
  setGoogleMapsApiKey: (key: string) => void;
  setIsGeneratingReport: (loading: boolean) => void;
  setReportData: (data: AIAnalysisReport | null) => void;
  setFlightState: (partial: Partial<FlightState>) => void;
  dispatchVTOL: (targetLat: number, targetLng: number) => void;
  
  // Async Methods
  initStore: () => void;
  fetchSamples: () => Promise<void>;
  fetchHeatmap: (layer?: LayerType, upto?: number) => Promise<void>;
  fetchReport: () => Promise<AIAnalysisReport | null>;
  uploadAndIngestCSV: (file: File) => Promise<any>;
  startReplay: () => Promise<void>;
  pauseReplay: () => Promise<void>;
  resetReplay: () => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  seekSample: (sample: number) => Promise<void>;
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
  primary_pollutant: 'PM2.5',
  confidence: 87,
  factors: {
    pm25_surge: 61,
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
  appMode: 'home',
  activeSection: 'overview',
  currentReading: defaultReading,
  history: [defaultReading],
  allSamples: [],
  replayStatus: defaultStatus,
  eri: defaultERI,
  heatmapData: null,
  selectedLayer: 'pm25',
  showSensors: true,
  showHeatmap: true,
  showPath: true,
  showConfidence: false,
  showVTOL: true,
  is3DMode: true,
  presentationMode: false,
  theme: 'light',
  connected: false,
  mapEngine: 'google_3d',
  googleMapsApiKey: initialApiKey,
  isGeneratingReport: false,
  reportData: null,

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
  setMapEngine: (engine) => set({ mapEngine: engine }),
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

    get().fetchSamples();
    get().fetchHeatmap('pm25');
    get().fetchReport();
  },

  fetchSamples: async () => {
    try {
      const data = await apiService.getSamples();
      set({ allSamples: data.samples || [] });
    } catch (e) {
      console.warn('Failed to fetch samples:', e);
    }
  },

  fetchHeatmap: async (layer, upto) => {
    const activeLayer = layer || get().selectedLayer;
    const activeUpto = upto !== undefined ? upto : get().currentReading.sample;
    try {
      const data = await apiService.getHeatmap(activeLayer, activeUpto);
      set({ heatmapData: data });
    } catch (e) {
      console.warn('Failed to fetch heatmap:', e);
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
      // Re-fetch samples and heatmap with the new dataset
      const samplesRes = await apiService.getSamples();
      if (samplesRes.samples && samplesRes.samples.length > 0) {
        set({
          allSamples: samplesRes.samples,
          currentReading: samplesRes.samples[0]
        });
      }
      const heatmap = await apiService.getHeatmap(get().selectedLayer, undefined, 24);
      set({ heatmapData: heatmap });
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
  }
}));
