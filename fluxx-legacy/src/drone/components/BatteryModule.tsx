"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface BatteryModuleProps {
  slideProgress: number; // 0 (docked inside) to 1 (fully ejected & elevated)
  isDark?: boolean;
}

export function BatteryModule({ slideProgress, isDark = false }: BatteryModuleProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(t * 4) * 0.3;
    }
  });

  // Position: sits right on the top central plate, slides up/back when inspecting battery
  const posX = 0;
  const posY = 0.16 + slideProgress * 0.45;
  const posZ = 0.05 + slideProgress * 0.6;
  const rotX = slideProgress * 0.25;

  return (
    <group position={[posX, posY, posZ]} rotation={[rotX, 0, 0]}>
      {/* 1. White LiPo Pack Casing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.22, 0.75]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Red & Blue Specification Label on Top */}
      <group position={[0, 0.111, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.32, 0.62]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Red stripe label accent */}
        <mesh position={[-0.08, 0.1, 0.001]}>
          <planeGeometry args={[0.12, 0.35]} />
          <meshBasicMaterial color="#DC2626" />
        </mesh>
        {/* Blue stripe label accent */}
        <mesh position={[0.08, -0.1, 0.001]}>
          <planeGeometry args={[0.12, 0.35]} />
          <meshBasicMaterial color="#2563EB" />
        </mesh>
      </group>

      {/* 3. Black Velcro Strap Wrapped Around Battery */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.24, 0.12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Plastic Strap Buckle */}
        <mesh position={[0.215, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.1, 0.14]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Heavy-Gauge Silicone Power Leads (Red & Black Wires) */}
      <group position={[0, 0.04, -0.38]}>
        {/* Red positive wire curve */}
        <mesh position={[-0.08, 0.04, -0.08]} rotation={[0.4, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
        {/* Black negative wire curve */}
        <mesh position={[0.08, 0.04, -0.08]} rotation={[0.4, -0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} />
        </mesh>
        {/* High-Amperage Yellow XT60 Connector Plug */}
        <mesh position={[0, 0.1, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.12, 0.08, 0.16]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Battery Status Micro LED */}
      <mesh ref={glowRef} position={[0, 0.112, 0.32]}>
        <planeGeometry args={[0.18, 0.025]} />
        <meshStandardMaterial
          color="#00E7B3"
          emissive="#00E7B3"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* 3D Label Callout during Inspection / Slide */}
      {slideProgress > 0.3 && (
        <Html position={[0, 0.22, 0]} center distanceFactor={7}>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-950/90 text-[#00E7B3] font-mono text-[10px] font-bold border border-[#00E7B3]/40 shadow-xl whitespace-nowrap">
            White LiPo Battery Pack & Velcro Strap
          </div>
        </Html>
      )}
    </group>
  );
}
