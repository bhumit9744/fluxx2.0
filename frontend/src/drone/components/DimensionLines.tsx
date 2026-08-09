"use client";

import { Html } from "@react-three/drei";
import * as THREE from "three";

interface DimensionLinesProps {
  isActive?: boolean;
}

export function DimensionLines({ isActive = false }: DimensionLinesProps) {
  if (!isActive) return null;

  const lineColor = "#00B8FF";

  return (
    <group>
      {/* 1. WINGSPAN CALIPER LINE (3,400 mm) */}
      <group position={[0, 0.45, -0.1]}>
        {/* Main Horizontal Span Bar */}
        <mesh>
          <boxGeometry args={[3.4, 0.008, 0.008]} />
          <meshBasicMaterial color={lineColor} />
        </mesh>
        {/* Left End Tick */}
        <mesh position={[-1.7, -0.1, 0]}>
          <boxGeometry args={[0.008, 0.25, 0.008]} />
          <meshBasicMaterial color={lineColor} />
        </mesh>
        {/* Right End Tick */}
        <mesh position={[1.7, -0.1, 0]}>
          <boxGeometry args={[0.008, 0.25, 0.008]} />
          <meshBasicMaterial color={lineColor} />
        </mesh>
        {/* Label Badge */}
        <Html position={[0, 0.12, 0]} center distanceFactor={6}>
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 text-[#00B8FF] border border-[#00B8FF]/40 font-mono text-[10px] font-bold tracking-wider whitespace-nowrap shadow-lg">
            WINGSPAN: 3,400 mm
          </div>
        </Html>
      </group>

      {/* 2. FUSELAGE LENGTH CALIPER (2,150 mm) */}
      <group position={[-1.9, 0, 0]}>
        {/* Longitudinal Bar */}
        <mesh>
          <boxGeometry args={[0.008, 0.008, 2.15]} />
          <meshBasicMaterial color="#00E7B3" />
        </mesh>
        {/* Nose Tick */}
        <mesh position={[0.1, 0, 1.075]}>
          <boxGeometry args={[0.25, 0.008, 0.008]} />
          <meshBasicMaterial color="#00E7B3" />
        </mesh>
        {/* Tail Tick */}
        <mesh position={[0.1, 0, -1.075]}>
          <boxGeometry args={[0.25, 0.008, 0.008]} />
          <meshBasicMaterial color="#00E7B3" />
        </mesh>
        {/* Label Badge */}
        <Html position={[-0.15, 0, 0]} center distanceFactor={6}>
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 text-[#00E7B3] border border-[#00E7B3]/40 font-mono text-[10px] font-bold tracking-wider whitespace-nowrap shadow-lg">
            LENGTH: 2,150 mm
          </div>
        </Html>
      </group>

      {/* 3. AIRFRAME HEIGHT CALIPER (680 mm) */}
      <group position={[1.9, 0, 0]}>
        {/* Vertical Bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.008, 0.68, 0.008]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* Top Tick */}
        <mesh position={[-0.1, 0.34, 0]}>
          <boxGeometry args={[0.25, 0.008, 0.008]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* Bottom Tick */}
        <mesh position={[-0.1, -0.34, 0]}>
          <boxGeometry args={[0.25, 0.008, 0.008]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* Label Badge */}
        <Html position={[0.15, 0, 0]} center distanceFactor={6}>
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 text-[#F59E0B] border border-[#F59E0B]/40 font-mono text-[10px] font-bold tracking-wider whitespace-nowrap shadow-lg">
            HEIGHT: 680 mm
          </div>
        </Html>
      </group>
    </group>
  );
}
