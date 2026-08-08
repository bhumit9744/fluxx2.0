import React from 'react';
import { useEnvironmentStore } from '../../stores/environmentStore';
import { Camera } from 'lucide-react';

export const CameraFeed: React.FC = () => {
  const { flightState } = useEnvironmentStore();

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-xl space-y-2 overflow-hidden relative">
      <div className="flex items-center space-x-2 px-2 pt-1">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <div className="text-[9px] font-bold text-slate-300 tracking-widest font-mono uppercase">SIMULATED OPTICAL FEED</div>
      </div>
      
      <div className="w-full aspect-video bg-slate-800 rounded-xl overflow-hidden relative border border-slate-700 flex items-center justify-center">
        {/* Mock Video Feed Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <Camera className="w-8 h-8 text-slate-600 opacity-50" />
        
        {/* OSD Overlay */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start text-[10px] font-mono font-bold text-green-400 drop-shadow-md">
            <div>REC • 1080p</div>
            <div>{flightState.altitude.toFixed(0)}m ALT</div>
          </div>
          
          {/* Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50">
             <div className="w-8 h-[1px] bg-green-400 absolute" />
             <div className="h-8 w-[1px] bg-green-400 absolute" />
          </div>

          <div className="flex justify-between items-end text-[10px] font-mono font-bold text-green-400 drop-shadow-md">
            <div>{flightState.latitude.toFixed(5)}<br/>{flightState.longitude.toFixed(5)}</div>
            <div>{flightState.heading.toFixed(0)}° HDG</div>
          </div>
        </div>
      </div>
    </div>
  );
};
