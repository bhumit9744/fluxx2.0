"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SprayNozzlesProps {
  isActive?: boolean;
}

export function SprayNozzles({ isActive = false }: SprayNozzlesProps) {
  const mistRef = useRef<THREE.Points>(null);

  // 120 Dynamic Spray Mist Droplets
  const { positions, velocities } = useMemo(() => {
    const count = 140;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    const nozzlePositions = [
      [-1.4, -0.2, -0.1],
      [-0.7, -0.2, -0.1],
      [0.7, -0.2, -0.1],
      [1.4, -0.2, -0.1],
    ];

    for (let i = 0; i < count; i++) {
      const nozzle = nozzlePositions[i % 4];
      pos[i * 3] = nozzle[0] + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = nozzle[1] - Math.random() * 0.8;
      pos[i * 3 + 2] = nozzle[2] + (Math.random() - 0.5) * 0.1;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -0.025 - Math.random() * 0.02;
      vel[i * 3 + 2] = -0.01 - Math.random() * 0.01;
    }

    return { positions: pos, velocities: vel };
  }, []);

  const mistGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!isActive || !mistRef.current) return;
    const pos = mistRef.current.geometry.attributes.position.array as Float32Array;

    const nozzlePositions = [
      [-1.4, -0.2, -0.1],
      [-0.7, -0.2, -0.1],
      [0.7, -0.2, -0.1],
      [1.4, -0.2, -0.1],
    ];

    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset droplet when it falls too low
      if (pos[i * 3 + 1] < -1.4) {
        const nozzle = nozzlePositions[i % 4];
        pos[i * 3] = nozzle[0] + (Math.random() - 0.5) * 0.08;
        pos[i * 3 + 1] = nozzle[1];
        pos[i * 3 + 2] = nozzle[2] + (Math.random() - 0.5) * 0.08;
      }
    }
    mistRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const nozzleOffsets = [-1.4, -0.7, 0.7, 1.4];

  return (
    <group>
      {/* 4 Micro-Atomizer Brass Nozzle Assemblies */}
      {nozzleOffsets.map((x, i) => (
        <group key={i} position={[x, -0.15, -0.1]} rotation={[0.2, 0, 0]}>
          {/* Mounting Bracket */}
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Atomizer Tip */}
          <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.025, 0.04, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Mist Particles (Charged Electrostatic Droplets) */}
      {isActive && (
        <points ref={mistRef} geometry={mistGeometry}>
          <pointsMaterial
            size={0.04}
            color="#00E7B3"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}
