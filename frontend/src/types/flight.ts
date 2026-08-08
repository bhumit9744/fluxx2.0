export type FlightStatus = "READY" | "AIRBORNE" | "LANDING" | "HOLD";
export type FlightMode = "AUTO" | "HOLD" | "RTL" | "LAND";
export type MissionStage = "TAKEOFF" | "TRANSIT" | "SENSOR SWEEP" | "HOTSPOT SURVEY" | "RETURN" | "LAND";

export interface DroneInfo {
  id: string;
  status: FlightStatus;
  battery: number;
}

export interface FlightState {
  droneId: string;
  status: FlightStatus;
  mode: FlightMode;
  altitude: number; // meters
  airspeed: number; // m/s
  battery: number; // percentage
  signal: number; // percentage
  latitude: number;
  longitude: number;
  heading: number; // degrees
  pitch: number; // degrees
  roll: number; // degrees
  satellites: number;
  missionProgress: number; // percentage 0-100
  missionStage: MissionStage;
  targetLatitude: number | null;
  targetLongitude: number | null;
}
