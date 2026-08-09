"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface LidarSensorProps {
  spinSpeed?: number;
  isActive?: boolean;
}

export function LidarSensor({ spinSpeed = 0.5, isActive = false }: LidarSensorProps) {
  const puckRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (puckRef.current && spinSpeed > 0.01) {
      puckRef.current.rotation.y += delta * (spinSpeed * 6 + 1);
    }
  });

  return (
    <group position={[0, 0.16, 0.28]}>
      {/* 1. Base Mount Collar on Center Top Plate */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.04, 16]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Vertical Black Carbon Fiber Mast Pole */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.48, 16]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3. Black Coiled Wire Spiral Wrapped Around the Mast Pole */}
      <group position={[0, 0.05, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 0.9;
          const y = i * 0.035;
          const radius = 0.028;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.009, 8, 8]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* 4. Elevated White GPS Disc Puck Antenna */}
      <group ref={puckRef} position={[0, 0.51, 0]}>
        {/* Top Metallic Cap Joint */}
        <mesh position={[0, -0.03, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.022, 0.03, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Main White Disc Puck */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Domed Puck Roof */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <sphereGeometry args={[0.155, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Red Circular Ring Logo on Top Puck Surface */}
        <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.105, 32]} />
          <meshBasicMaterial color="#DC2626" side={THREE.DoubleSide} />
        </mesh>

        {/* Center Orange/Amber GPS Status Indicator */}
        <mesh position={[0, 0.043, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.005, 16]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* 3D Label Callout during Lidar/GPS chapter */}
        {spinSpeed > 1.0 && (
          <Html position={[0, 0.15, 0]} center distanceFactor={7}>
            <div className="px-2.5 py-1 rounded-lg bg-sky-950/90 text-[#00B8FF] font-mono text-[10px] font-bold border border-[#00B8FF]/40 shadow-xl whitespace-nowrap">
              Elevated GPS Puck Antenna & Coiled Cable Mast
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
