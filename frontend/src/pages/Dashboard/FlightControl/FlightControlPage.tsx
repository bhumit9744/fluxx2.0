import React, { useEffect } from 'react';
import { VehicleHeader } from './VehicleHeader';
import { FlightMap } from './FlightMap';
import { VehicleTelemetry } from './VehicleTelemetry';
import { ArtificialHorizon } from './ArtificialHorizon';
import { FlightStatus } from './FlightStatus';
import { MissionProgress } from './MissionProgress';
import { EnvironmentalPayload } from './EnvironmentalPayload';
import { FlightCommandBar } from './FlightCommandBar';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const FlightControlPage: React.FC = () => {
  const { flightState, setFlightState } = useEnvironmentStore();

  // Active Simulation Loop for GCS Telemetry
  useEffect(() => {
    if (flightState.status !== 'AIRBORNE') return;

    const interval = setInterval(() => {
      setFlightState({
        altitude: flightState.altitude < 42 ? flightState.altitude + 0.5 : 42 + (Math.random() - 0.5) * 0.4,
        airspeed: flightState.mode === 'HOLD' ? 0 : 12.4 + (Math.random() - 0.5) * 0.8,
        battery: Math.max(10, flightState.battery - 0.005),
        roll: (Math.random() - 0.5) * 4,
        pitch: 1.5 + (Math.random() - 0.5) * 1.5,
        heading: (flightState.heading + (Math.random() - 0.5) * 1) % 360,
        missionProgress: Math.min(100, (flightState.missionProgress || 64) + 0.1)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [flightState, setFlightState]);

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto select-none">
      
      {/* 1. Top Vehicle Header */}
      <VehicleHeader />

      {/* 2. Primary 3D Earth Map + Telemetry Instruments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: 3D Flight Map with HUD and Camera PIP */}
        <div className="lg:col-span-2">
          <FlightMap />
        </div>

        {/* Right 1 Col: Telemetry and Artificial Horizon */}
        <div className="space-y-6">
          <VehicleTelemetry />
          <ArtificialHorizon />
        </div>

      </div>

      {/* 3. Middle Flight State & Payloads Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FlightStatus />
        <MissionProgress />
        <EnvironmentalPayload />
      </div>

      {/* 4. Bottom Command Bar */}
      <FlightCommandBar />

    </div>
  );
};
export default FlightControlPage;
