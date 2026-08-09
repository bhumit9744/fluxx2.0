import React, { useState } from 'react';
import { EarthMap } from '../../../components/map/EarthMap';
import { useEnvironmentStore } from '../../../stores/environmentStore';
import { Navigation, MapPin, Home, Layers, Radio, Camera } from 'lucide-react';
import { CameraFeed } from './CameraFeed';

export const FlightMap: React.FC = () => {
  const { flightState } = useEnvironmentStore();
  const [showCamera, setShowCamera] = useState(true);

  const waypoints = [
    { id: 1, label: 'WP1', lat: 19.0520, lng: 73.0620, completed: true },
    { id: 2, label: 'WP2', lat: 19.0540, lng: 73.0640, completed: true },
    { id: 3, label: 'WP3', lat: 19.0560, lng: 73.0670, completed: true },
    { id: 4, label: 'WP4', lat: 19.0550, lng: 73.0700, completed: true },
    { id: 5, label: 'WP5', lat: 19.0530, lng: 73.0690, completed: true },
    { id: 6, label: 'WP6', lat: 19.0510, lng: 73.0660, completed: true },
    { id: 7, label: 'WP7', lat: 19.0490, lng: 73.0630, completed: false },
    { id: 8, label: 'WP8', lat: 19.0480, lng: 73.0600, completed: false },
    { id: 9, label: 'WP9', lat: 19.0500, lng: 73.0580, completed: false }
  ];

  return (
    <div className="relative w-full h-[520px] rounded-3xl bg-[#2B211C] overflow-hidden border border-[#F3E6D7] shadow-md select-none font-sans">
      
      {/* Underlying 3D Earth Map View */}
      <div className="absolute inset-0 z-0">
        <EarthMap />
      </div>

      {/* Top Map HUD Bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Active Mission Tag */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-black text-[#2B211C] font-mono uppercase">
            KHARGHAR ENVIRONMENTAL SURVEY
          </span>
          <span className="text-xs text-[#8C827A]">·</span>
          <span className="text-xs font-mono font-bold text-[#F47A24]">
            WP 6 / 9 (64%)
          </span>
        </div>

        {/* Camera Toggle Button */}
        <button
          onClick={() => setShowCamera(!showCamera)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-xl border border-[#F3E6D7] shadow-xs text-xs font-bold text-[#2B211C] pointer-events-auto cursor-pointer transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-[#F47A24]" />
          <span>{showCamera ? 'Hide Camera' : 'Show Camera'}</span>
        </button>

      </div>

      {/* Floating Waypoint Legend / Path Overlay */}
      <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#F3E6D7] shadow-xs text-[11px] font-mono space-y-1.5 pointer-events-auto">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-0.5 bg-[#F47A24]" />
          <span className="font-bold text-[#2B211C]">Completed Survey Track (Solid)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-[#8C827A]" />
          <span className="text-[#8C827A]">Remaining Flight Plan (Dashed)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-[#FAF3EA]">
          <Home className="w-3 h-3 text-[#3FA66B]" />
          <span className="text-[#2B211C] font-bold">Base Home Point: Sector 7</span>
        </div>
      </div>

      {/* Floating Picture-in-Picture Camera Feed */}
      {showCamera && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <CameraFeed onClose={() => setShowCamera(false)} />
        </div>
      )}

    </div>
  );
};
