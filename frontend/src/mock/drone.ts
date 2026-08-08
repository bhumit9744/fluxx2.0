export interface DroneTelemetry {
  droneId: string;
  status: 'AIRBORNE' | 'CHARGING' | 'RETURN_TO_BASE' | 'STANDBY';
  altitude: number; // meters
  battery: number;  // percentage
  speed: number;    // m/s
  flightTimeMinutes: number;
  satelliteFix: number;
  firmware: string;
}

export const mockDroneStatus: DroneTelemetry = {
  droneId: 'VTOL-001',
  status: 'AIRBORNE',
  altitude: 42.0,
  battery: 82,
  speed: 12.4,
  flightTimeMinutes: 34,
  satelliteFix: 18,
  firmware: 'FLX-AUTOPILOT-v3.4'
};
