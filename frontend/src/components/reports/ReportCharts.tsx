import React from 'react';
import { NormalizedReading } from '../../types/environment';

interface SparklineProps {
  data: NormalizedReading[];
  parameter: 'pm25' | 'pm10' | 'co2' | 'temperature' | 'humidity' | 'windSpeed';
  color: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  parameter, 
  color, 
  width = 600, 
  height = 140, 
  strokeWidth = 2 
}) => {
  if (!data || data.length === 0) return null;

  // Reduce points for cleaner line if there are many samples
  const stride = Math.max(1, Math.floor(data.length / 50));
  const points = data.filter((_, i) => i % stride === 0);

  const values = points.map(d => Number(d.sensors[parameter]) || 0);
  
  // Calculate bounds with some padding
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const padding = range * 0.1;
  const graphMin = Math.max(0, min - padding);
  const graphMax = max + padding;
  
  // Create path
  let pathD = '';
  points.forEach((p, i) => {
    const val = Number(p.sensors[parameter]) || 0;
    const x = (i / (points.length - 1)) * width;
    
    // Y is inverted in SVG (0 is top)
    const y = height - (((val - graphMin) / (graphMax - graphMin)) * height);
    
    if (i === 0) {
      pathD += `M ${x} ${y} `;
    } else {
      pathD += `L ${x} ${y} `;
    }
  });

  return (
    <div className="w-full relative pl-8 pr-2" style={{ height }}>
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pl-8 pr-2 flex flex-col justify-between pointer-events-none">
        <div className="w-full border-t border-dashed border-slate-200" />
        <div className="w-full border-t border-dashed border-slate-200" />
        <div className="w-full border-t border-dashed border-slate-200" />
        <div className="w-full border-t border-slate-300" />
      </div>
      
      {/* Y-Axis Labels */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] font-mono text-slate-400 py-1 items-end w-6">
        <span>{graphMax.toFixed(0)}</span>
        <span>{((graphMax + graphMin) / 2).toFixed(0)}</span>
        <span>{graphMin.toFixed(0)}</span>
      </div>

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="relative z-10 overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Glow effect */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 4}
          strokeOpacity={0.1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
