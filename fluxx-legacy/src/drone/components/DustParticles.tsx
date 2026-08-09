"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DustParticlesProps {
  count?: number;
  isDark?: boolean;
}

export function DustParticles({ count = 120, isDark = true }: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions, speeds, and scales for dust specks
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 8; // X
      pos[i * 3 + 1] = Math.random() * 5 - 1.5;   // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // Z

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = Math.random() * 0.004 + 0.001;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return [pos, spd];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      let x = arr[i * 3 + 0] + speeds[i * 3 + 0] + Math.sin(t * 0.5 + i) * 0.0008;
      let y = arr[i * 3 + 1] + speeds[i * 3 + 1];
      let z = arr[i * 3 + 2] + speeds[i * 3 + 2] + Math.cos(t * 0.5 + i) * 0.0008;

      // Wrap around boundary box
      if (y > 3.5) y = -1.5;
      if (x > 4) x = -4;
      if (x < -4) x = 4;
      if (z > 4) z = -4;
      if (z < -4) z = 4;

      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  const particleColor = isDark ? "#38BDF8" : "#0284C7";

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={particleColor}
        transparent
        opacity={isDark ? 0.45 : 0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
