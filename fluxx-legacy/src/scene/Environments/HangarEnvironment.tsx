"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HangarEnvironmentProps {
  doorOpenProgress: number; // 0 (closed) to 1 (fully open)
  lightsIntensity?: number;
  isDark?: boolean;
}

export function HangarEnvironment({
  doorOpenProgress,
  lightsIntensity = 1,
  isDark = false,
}: HangarEnvironmentProps) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const strobeLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Sliding door animation
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = -4 - doorOpenProgress * 6.5;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = 4 + doorOpenProgress * 6.5;
    }
    // Hangar beacon strobe
    if (strobeLightRef.current) {
      strobeLightRef.current.intensity = (Math.sin(t * 6) > 0.6 ? 5 : 0.5) * lightsIntensity;
    }
  });

  const wallColor = isDark ? "#0A0F1A" : "#F1F5F9";
  const floorColor = isDark ? "#080C14" : "#E2E8F0";
  const frameColor = isDark ? "#1E293B" : "#64748B";
  const yellowHazard = "#F59E0B";

  return (
    <group position={[0, 0, 0]}>
      {/* 1. ARCHITECTURAL HANGAR SHELL */}
      {/* Back Wall with Aerocenter Signage */}
      <mesh position={[0, 4.5, -14]} receiveShadow>
        <planeGeometry args={[28, 13]} />
        <meshStandardMaterial
          color={wallColor}
          metalness={isDark ? 0.6 : 0.15}
          roughness={isDark ? 0.5 : 0.4}
        />
      </mesh>

      {/* FLUXX Hangar 01 Backwall Monogram */}
      <mesh position={[0, 7.5, -13.9]}>
        <planeGeometry args={[7, 1.2]} />
        <meshStandardMaterial
          color="#0284C7"
          emissive="#0284C7"
          emissiveIntensity={0.6 * lightsIntensity}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-13, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 13]} />
        <meshStandardMaterial color={wallColor} metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[13, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 13]} />
        <meshStandardMaterial color={wallColor} metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 11, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 30]} />
        <meshStandardMaterial color={isDark ? "#060A12" : "#CBD5E1"} roughness={0.7} />
      </mesh>

      {/* Polished Epoxy Floor with Grid Reflection */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 30]} />
        <meshStandardMaterial
          color={floorColor}
          metalness={isDark ? 0.7 : 0.3}
          roughness={isDark ? 0.18 : 0.22}
        />
      </mesh>

      {/* 2. REALISTIC STRUCTURAL STEEL CEILING TRUSSES */}
      {[-8, -2, 4, 10].map((z, idx) => (
        <group key={idx} position={[0, 10.2, z]}>
          {/* Main Cross Beam */}
          <mesh castShadow>
            <boxGeometry args={[26, 0.4, 0.4]} />
            <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Diagonal Struts */}
          {[-8, -4, 0, 4, 8].map((x, sIdx) => (
            <mesh key={sIdx} position={[x, -0.4, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.15, 1.2, 0.15]} />
              <meshStandardMaterial color={frameColor} metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 3. MOTORIZED REINFORCED BLAST DOORS */}
      <group position={[0, 0, 14]}>
        {/* Left Door */}
        <group ref={leftDoorRef} position={[-4, 4.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.2, 11, 0.5]} />
            <meshStandardMaterial color={frameColor} metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Hazard Safety Striping */}
          <mesh position={[3.3, 0, 0.26]}>
            <planeGeometry args={[0.35, 10.5]} />
            <meshStandardMaterial color={yellowHazard} emissive={yellowHazard} emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Right Door */}
        <group ref={rightDoorRef} position={[4, 4.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.2, 11, 0.5]} />
            <meshStandardMaterial color={frameColor} metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[-3.3, 0, 0.26]}>
            <planeGeometry args={[0.35, 10.5]} />
            <meshStandardMaterial color={yellowHazard} emissive={yellowHazard} emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 4. REALISTIC HANGAR GROUND EQUIPMENT & CHARGING STATIONS */}
      {/* Battery Swapping Rapid-Charge Station (Left Side) */}
      <group position={[-9.5, 1.2, -4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.4, 5]} />
          <meshStandardMaterial color={isDark ? "#1E293B" : "#F8FAFC"} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Green Charging Slot Indicators */}
        {[ -1.5, -0.5, 0.5, 1.5].map((z, i) => (
          <mesh key={i} position={[1.26, 0.2, z]}>
            <planeGeometry args={[0.1, 0.8]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>

      {/* Nitrogen & Fuel Cart (Right Side) */}
      <group position={[9.5, 0.8, -2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.4, 3]} />
          <meshStandardMaterial color="#0284C7" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.9, -0.6]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.6, 12]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0.6]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.6, 12]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
      </group>

      {/* 5. TAXIWAY CENTERLINE LED RUNWAY GUIDES */}
      <group position={[0, 0.02, 0]}>
        {[-10, -6, -2, 2, 6, 10, 14].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 2.4]} />
            <meshStandardMaterial
              color="#0284C7"
              emissive="#0284C7"
              emissiveIntensity={1.4 * lightsIntensity}
            />
          </mesh>
        ))}
      </group>

      {/* 6. OVERHEAD HIGH-BAY CLEANROOM FLOODLIGHTS */}
      <pointLight
        position={[0, 9, -5]}
        color={isDark ? "#00F0FF" : "#FFFFFF"}
        intensity={5 * lightsIntensity}
        distance={30}
      />
      <pointLight
        position={[0, 9, 5]}
        color={isDark ? "#00F0FF" : "#FFFFFF"}
        intensity={5 * lightsIntensity}
        distance={30}
      />

      {/* Door Strobe Alert */}
      <pointLight
        ref={strobeLightRef}
        position={[0, 10.2, 13.8]}
        color="#F59E0B"
        distance={22}
      />
    </group>
  );
}
