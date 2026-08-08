import React, { useEffect, useState } from 'react';
import { EarthMap } from '../../../components/map/EarthMap';
import { DroneFleet } from '../../../components/flight/DroneFleet';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { Plane, Battery, Signal, Navigation2 } from 'lucide-react';

export const FlightOpsView: React.FC = () => {
  const { flightState, setFlightState } = useEnvironmentStore();

  // Simulation Loop
  useEffect(() => {
    if (flightState.status !== 'AIRBORNE') return;

    const interval = setInterval(() => {
      setFlightState({
        altitude: flightState.altitude < 42 ? flightState.altitude + 0.8 : 42 + (Math.random() - 0.5) * 0.5,
        airspeed: flightState.mode === 'HOLD' ? 0 : 12.4 + (Math.random() - 0.5) * 1.2,
        battery: Math.max(0, flightState.battery - 0.01),
        roll: (Math.random() - 0.5) * 5,
        pitch: (Math.random() - 0.5) * 2,
        heading: (flightState.heading + (Math.random() - 0.5) * 2) % 360,
      });

      // Simple routing to hotspot logic
      if (flightState.targetLatitude && flightState.targetLongitude && flightState.mode === 'AUTO') {
        const latDiff = flightState.targetLatitude - flightState.latitude;
        const lngDiff = flightState.targetLongitude - flightState.longitude;
        const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        if (dist > 0.0001) {
          setFlightState({
            latitude: flightState.latitude + latDiff * 0.05,
            longitude: flightState.longitude + lngDiff * 0.05,
            missionProgress: Math.min(100, flightState.missionProgress + 0.5),
            missionStage: flightState.missionProgress > 80 ? 'HOTSPOT SURVEY' : 'TRANSIT'
          });
        } else {
          setFlightState({ mode: 'HOLD', missionStage: 'HOTSPOT SURVEY' });
        }
      }

    }, 500);

    return () => clearInterval(interval);
  }, [flightState]);

  return (
    <div className="w-full h-[calc(100vh-100px)] font-sans flex flex-col space-y-5 pb-4">
      
      {/* Top Header Rail */}
      <div className="flex items-center justify-between panel p-5">
        <div>
          <h2 className="text-xl font-bold text-[var(--fluxx-text)] tracking-tight">FLIGHT OPS</h2>
          <div className="text-[11px] font-mono font-medium text-[var(--fluxx-muted)] mt-1 uppercase tracking-widest flex items-center space-x-2">
            <span>Enterprise GCS</span>
            <span>·</span>
            <span className="flex items-center text-[var(--fluxx-success)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--fluxx-success)] mr-1.5 animate-pulse"></span>Link Established</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-5 min-h-[400px]">
        
        {/* Left: Fleet */}
        <div className="w-72 flex-shrink-0 panel flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--fluxx-border)] bg-[var(--fluxx-glass-light)]">
            <span className="text-xs font-bold text-[var(--fluxx-text)] uppercase tracking-wider">FLEET STATUS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="p-3 border border-[var(--fluxx-orange)] bg-[rgba(244,122,36,0.1)] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Plane className="w-4 h-4 text-[var(--fluxx-orange)]" />
                <div>
                  <div className="text-xs font-bold text-[var(--fluxx-text)]">VTOL-001</div>
                  <div className="text-[10px] font-mono text-[var(--fluxx-orange)] uppercase tracking-widest mt-0.5">AIRBORNE</div>
                </div>
              </div>
            </div>
            <div className="p-3 border border-[var(--fluxx-border)] rounded-xl flex items-center justify-between opacity-60 bg-[rgba(255,255,255,0.3)]">
              <div className="flex items-center space-x-3">
                <Plane className="w-4 h-4 text-[var(--fluxx-muted)]" />
                <div>
                  <div className="text-xs font-bold text-[var(--fluxx-text)]">VTOL-002</div>
                  <div className="text-[10px] font-mono text-[var(--fluxx-muted)] uppercase tracking-widest mt-0.5">READY</div>
                </div>
              </div>
            </div>
            <div className="p-3 border border-[var(--fluxx-border)] rounded-xl flex items-center justify-between opacity-60 bg-[rgba(255,255,255,0.3)]">
              <div className="flex items-center space-x-3">
                <Plane className="w-4 h-4 text-[var(--fluxx-muted)]" />
                <div>
                  <div className="text-xs font-bold text-[var(--fluxx-text)]">VTOL-003</div>
                  <div className="text-[10px] font-mono text-[var(--fluxx-muted)] uppercase tracking-widest mt-0.5">CHARGING</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: 3D Earth */}
        <div className="flex-1 relative panel overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <EarthMap />
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="h-12 bg-[var(--fluxx-glass-strong)] backdrop-blur-md border-t border-[var(--fluxx-border)] text-[var(--fluxx-text)] flex items-center justify-around px-6 shrink-0 font-mono text-[11px] font-bold tracking-widest">
            <div className="flex items-center space-x-2">
              <Navigation2 className="w-3.5 h-3.5 text-[var(--fluxx-muted)]" />
              <span>ALT {flightState.altitude.toFixed(1)}m</span>
            </div>
            <div className="w-px h-4 bg-[var(--fluxx-border)]" />
            <div className="flex items-center space-x-2">
              <span className="text-[var(--fluxx-muted)]">SPD</span>
              <span>{flightState.airspeed.toFixed(1)} m/s</span>
            </div>
            <div className="w-px h-4 bg-[var(--fluxx-border)]" />
            <div className="flex items-center space-x-2">
              <Battery className="w-3.5 h-3.5 text-[var(--fluxx-orange)]" />
              <span>BAT {flightState.battery.toFixed(0)}%</span>
            </div>
            <div className="w-px h-4 bg-[var(--fluxx-border)]" />
            <div className="flex items-center space-x-2">
              <span className="text-[var(--fluxx-muted)]">GPS</span>
              <span className="text-[var(--fluxx-success)]">12 SAT</span>
            </div>
            <div className="w-px h-4 bg-[var(--fluxx-border)]" />
            <div className="flex items-center space-x-2">
              <Signal className="w-3.5 h-3.5 text-[var(--fluxx-success)]" />
              <span>LINK 98%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
