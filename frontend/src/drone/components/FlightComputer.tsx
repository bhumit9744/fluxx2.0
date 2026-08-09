"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlightComputerProps {
  elevateProgress: number; // 0 (hidden inside) to 1 (risen above fuselage)
  powerFlowActive?: boolean;
  isDark?: boolean;
}

export function FlightComputer({
  elevateProgress,
  powerFlowActive = false,
  isDark = false,
}: FlightComputerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Procedural Neural Data Particles around CPU
  const particleGeo = useMemo(() => {
    const count = 48;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.35;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = -t * 0.5;
    }
  });

  const posY = 0.14 + elevateProgress * 0.55;
  const chipColor = "#00B8FF";
  const boardColor = isDark ? "#0A1128" : "#1E293B";

  return (
    <group position={[0, posY, -0.15]}>
      {/* Main Aluminum Heatsink Base */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.08, 0.38]} />
        <meshStandardMaterial
          color={boardColor}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Triple-Redundant SOC Dies (3 Glowing Silicon Chips) */}
      <group position={[0, 0.045, 0]}>
        {[-0.09, 0, 0.09].map((x, i) => (
          <mesh key={i} position={[x, 0, (i % 2 === 0 ? 0.04 : -0.04)]}>
            <boxGeometry args={[0.07, 0.015, 0.07]} />
            <meshStandardMaterial
              color={chipColor}
              emissive={chipColor}
              emissiveIntensity={1.2}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* RTK Multi-Band Antenna Dome */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pulsing Neural Data Halo (Visible when elevated or active) */}
      {elevateProgress > 0.1 && (
        <group>
          <points ref={pointsRef} geometry={particleGeo}>
            <pointsMaterial
              size={0.03}
              color={chipColor}
              transparent
              opacity={Math.min(1, elevateProgress * 1.5)}
            />
          </points>

          {/* Concentric SLAM Compute Rings */}
          <group ref={ringRef} position={[0, 0.08, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.23, 32]} />
              <meshBasicMaterial
                color="#00E7B3"
                transparent
                opacity={elevateProgress * 0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.32, 0.33, 32]} />
              <meshBasicMaterial
                color="#00B8FF"
                transparent
                opacity={elevateProgress * 0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
