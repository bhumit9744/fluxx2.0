"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HologramProjectorProps {
  isActive?: boolean;
}

export function HologramProjector({ isActive = false }: HologramProjectorProps) {
  const diskRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!isActive) return;
    const t = state.clock.getElapsedTime();
    if (diskRef.current) {
      diskRef.current.rotation.y = t * 0.2;
    }
    if (scanLineRef.current) {
      scanLineRef.current.position.z = Math.sin(t * 1.5) * 1.4;
    }
  });

  if (!isActive) return null;

  return (
    <group position={[0, -1.2, 0]}>
      {/* Downward Projector Light Cone from Drone to Hologram */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 2.2, 1.2, 32, 1, true]} />
        <meshBasicMaterial
          color="#00B8FF"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Rotating Holographic Disk Base */}
      <group ref={diskRef}>
        {/* Holographic Radar Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.85, 64]} />
          <meshBasicMaterial
            color="#00E7B3"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.23, 48]} />
          <meshBasicMaterial
            color="#00B8FF"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 3D Holographic Terrain Wireframe Grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[3.2, 3.2, 16, 16]} />
          <meshBasicMaterial
            color="#00B8FF"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Target AI Weed Detection Boxes (Glowing Amber/Red Markers) */}
        {[
          [-0.6, 0.05, 0.4],
          [0.8, 0.05, -0.5],
          [-0.3, 0.05, -0.7],
          [0.4, 0.05, 0.6],
        ].map((pos, idx) => (
          <group key={idx} position={[pos[0], pos[1], pos[2]]}>
            <mesh>
              <boxGeometry args={[0.2, 0.08, 0.2]} />
              <meshBasicMaterial color="#F59E0B" wireframe />
            </mesh>
            <mesh position={[0, 0.06, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.04, 0.08, 8]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Sweeping Laser Scan Line */}
      <mesh ref={scanLineRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 0.04]} />
        <meshBasicMaterial
          color="#00E7B3"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
