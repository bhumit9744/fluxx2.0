export interface Location {
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface SensorData {
  pm25: number;
  pm10: number;
  co2: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  voc?: number;
}

export interface NormalizedReading {
  sample: number;
  total_samples: number;
  timestamp: string;
  source: string;
  mode: string;
  location: Location;
  sensors: SensorData;
}

export interface EnvironmentalRiskIndex {
  score: number;
  level: string;
  primary_pollutant: string;
  confidence?: number;
  factors?: {
    pm25_surge: number;
    pm10_elevation: number;
    wind_stagnation: number;
    humidity: number;
  };
  recommendation: string;
  timestamp: string;
}

export interface ReplayStatus {
  playing: boolean;
  status: 'PLAYING' | 'PAUSED' | 'SEEKING';
  speed: number;
  currentSample: number;
  totalSamples: number;
  timestamp: string;
  source: string;
  mode: string;
}

export interface AnomalyEvent {
  id?: string;
  type: string;
  confidence: number;
  predicted_duration: string;
  status: string;
  hotspot_coordinates: {
    latitude: number;
    longitude: number;
    peak_pm25: number;
  };
  why_flagged: string[];
}

export interface IDWGridCell {
  lat: number;
  lng: number;
  value: number;
}

export interface IDWHeatmapData {
  parameter?: string;
  unit: string;
  average?: number;
  min?: number;
  max?: number;
  grid?: IDWGridCell[];
  hotspot?: {
    lat: number;
    lng: number;
    value: number;
  };
  bounds: {
    min_lat?: number;
    max_lat?: number;
    min_lng?: number;
    max_lng?: number;
    center_lat?: number;
    center_lng?: number;
  };
  stats?: {
    min: number;
    max: number;
    avg: number;
    median?: number;
    observations_count?: number;
  };
  grid_cells?: any[];
}

export interface AIAnalysisReport {
  report: {
    id: string;
    title: string;
    location: string;
    generated_at: string;
    window: string;
  };
  summary: {
    eri: number;
    risk: string;
    confidence: number;
    primary_driver: string;
  };
  metrics: Record<string, {
    current: number;
    avg: number;
    min: number;
    max: number;
    unit: string;
    status: string;
  }>;
  spatial: {
    hotspot: {
      sector: string;
      latitude: number;
      longitude: number;
      peak_value: number;
      sample_index: number;
      parameter: string;
    };
    heatmap: any;
    sensor_count: number;
  };
  trends: {
    pm25: any;
    pm10: any;
  };
  ai: {
    anomaly: any[];
    factors: Array<{name: string, value: number}>;
    interpretation: string;
    recommendations: any[];
  };
  pros: string[];
  cons: string[];
  methodology: {
    dataset: string;
    observations: number;
    parameters: string;
    spatial_method: string;
    limitations: string;
  };
}
