import { create } from "zustand";

export type ViewState = "overview" | "environment" | "missions" | "intelligence" | "reports";

export interface TelemetryData {
  pm25: number;
  pm10: number;
  co2: number;
  temperature: number;
  humidity: number;
  wind: number;
  timestamp?: string;
  source?: string;
}

export interface DroneStatus {
  altitude: number;
  speed: number;
  battery: number;
  coverage: number;
  status: "idle" | "airborne" | "returning" | "charging";
}

export interface IntelligenceEvent {
  id: string;
  type: string;
  confidence: number;
  description: string;
  factors: Record<string, number>;
  active: boolean;
}

interface FluxxState {
  // Navigation State
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;

  // Backend Sync State
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  dataSource: "Live Simulator" | "Live Hardware" | "Offline";
  setDataSource: (source: "Live Simulator" | "Live Hardware" | "Offline") => void;

  // Real-time Data
  telemetry: TelemetryData;
  updateTelemetry: (data: Partial<TelemetryData>) => void;

  // Drone State
  droneStatus: DroneStatus;
  updateDroneStatus: (data: Partial<DroneStatus>) => void;

  // Intelligence Events
  activeEvent: IntelligenceEvent | null;
  setActiveEvent: (event: IntelligenceEvent | null) => void;

  // Overall ERI
  eriScore: number;
  setEriScore: (score: number) => void;
}

export const useFluxxStore = create<FluxxState>((set) => ({
  currentView: "overview",
  setCurrentView: (view) => set({ currentView: view }),

  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  dataSource: "Offline",
  setDataSource: (source) => set({ dataSource: source }),

  telemetry: {
    pm25: 48.5,
    pm10: 77.3,
    co2: 559,
    temperature: 28.1,
    humidity: 80.1,
    wind: 2.6,
  },
  updateTelemetry: (data) =>
    set((state) => ({ telemetry: { ...state.telemetry, ...data } })),

  droneStatus: {
    altitude: 42,
    speed: 12.4,
    battery: 82,
    coverage: 64,
    status: "airborne",
  },
  updateDroneStatus: (data) =>
    set((state) => ({ droneStatus: { ...state.droneStatus, ...data } })),

  activeEvent: {
    id: "evt_1",
    type: "PM2.5 anomaly detected",
    confidence: 87,
    description: "Unusual spike in particulate matter",
    factors: {
      "PM2.5": 61,
      "PM10": 22,
      "Wind": 11,
      "Humidity": 6,
    },
    active: true,
  },
  setActiveEvent: (event) => set({ activeEvent: event }),

  eriScore: 64,
  setEriScore: (score) => set({ eriScore: score }),
}));
