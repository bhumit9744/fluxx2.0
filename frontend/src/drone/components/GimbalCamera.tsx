"use client";

import { useRef } from "react";
import * as THREE from "three";

interface GimbalCameraProps {
  pitch?: number; // radians
  isDark?: boolean;
}

export function GimbalCamera({ pitch = 0, isDark = false }: GimbalCameraProps) {
  return (
    <group position={[0, -0.16, 0.9]}>
      {/* Gimbal Yaw Base Mount */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.04, 20]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Gimbal U-Arm Bracket */}
      <group position={[0, 0.03, 0]}>
        <mesh position={[-0.1, -0.04, 0]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.03]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
        <mesh position={[0.1, -0.04, 0]} castShadow>
          <boxGeometry args={[0.02, 0.12, 0.03]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
      </group>

      {/* 3-Axis Stabilized Camera Ball (Pitches on X-axis) */}
      <group position={[0, -0.04, 0]} rotation={[pitch, 0, 0]}>
        {/* Main Camera Sphere Shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.095, 24, 24]} />
          <meshStandardMaterial
            color={isDark ? "#0F172A" : "#1E293B"}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Primary 48MP Optical Lens (Top) */}
        <mesh position={[0, 0.02, 0.088]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 20]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        {/* Lens Glass Reflection Rim */}
        <mesh position={[0, 0.02, 0.098]}>
          <ringGeometry args={[0.02, 0.032, 20]} />
          <meshStandardMaterial
            color="#00B8FF"
            emissive="#00B8FF"
            emissiveIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Secondary FLIR Thermal / NDVI Sensor (Bottom) */}
        <mesh position={[0, -0.04, 0.084]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
          <meshStandardMaterial
            color="#00E7B3"
            emissive="#00E7B3"
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
}
