"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SprayEmittersProps {
  active: boolean;
  intensity?: number;
}

export function SprayEmitters({ active, intensity = 1 }: SprayEmittersProps) {
  const count = 600;
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle positions, velocities, and lifespans
  const [positions, velocities, life] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const lif = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Start from one of 4 nozzle locations under the wings
      const nozzleSide = (i % 4) - 1.5; // -1.5, -0.5, 0.5, 1.5
      pos[i * 3] = nozzleSide * 0.9;
      pos[i * 3 + 1] = -0.3;
      pos[i * 3 + 2] = -0.2;

      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = -2.5 - Math.random() * 2.0; // Downward spray velocity
      vel[i * 3 + 2] = -1.0 - Math.random() * 1.5; // Backwards wake

      lif[i] = Math.random(); // staggered initial life
    }
    return [pos, vel, lif];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      if (!active) {
        // Hide particles away when inactive
        array[i * 3 + 1] = -9999;
        continue;
      }

      life[i] += delta * 1.8 * intensity;

      if (life[i] >= 1.0) {
        // Reset particle to nozzle
        life[i] = 0;
        const nozzleSide = (i % 4) - 1.5;
        array[i * 3] = nozzleSide * 0.9 + (Math.random() - 0.5) * 0.1;
        array[i * 3 + 1] = -0.3;
        array[i * 3 + 2] = -0.2 + (Math.random() - 0.5) * 0.1;
      } else {
        // Move particle downward and expand mist cone
        array[i * 3] += velocities[i * 3] * delta;
        array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        array[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#10B981"
        transparent
        opacity={active ? 0.85 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
