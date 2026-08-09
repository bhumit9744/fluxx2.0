"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FactoryInterior() {
  const arm1Ref = useRef<THREE.Group>(null);
  const arm2Ref = useRef<THREE.Group>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Robotic arm scanning motion
    if (arm1Ref.current) {
      arm1Ref.current.rotation.y = Math.sin(t * 1.2) * 0.4;
      arm1Ref.current.rotation.z = Math.cos(t * 1.5) * 0.2;
    }
    if (arm2Ref.current) {
      arm2Ref.current.rotation.y = -Math.sin(t * 1.4) * 0.4;
      arm2Ref.current.rotation.z = -Math.cos(t * 1.1) * 0.2;
    }
    // Pulsating plasma reactor core
    if (coreGlowRef.current) {
      const mat = coreGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + Math.sin(t * 4) * 0.5;
    }
  });

  return (
    <group position={[0, 0, 135]}>
      {/* 1. REFINERY HALL ARCHITECTURE (Z = -20 to +20 around 135) */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[24, 10, 40]} />
        <meshStandardMaterial
          color="#0B101B"
          metalness={0.7}
          roughness={0.5}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Industrial Floor with Grate Insets */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[23.8, 39.8]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 2. RICE HUSK CONVEYOR SYSTEM */}
      <group position={[-6, 0, 0]}>
        {/* Conveyor Bed */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[2, 0.4, 34]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} />
        </mesh>
        {/* Conveyor Legs */}
        {[-12, -4, 4, 12].map((z, i) => (
          <mesh key={i} position={[0, 0.4, z]}>
            <boxGeometry args={[1.8, 0.8, 0.2]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        ))}
        {/* Biomass Rice Husk Material on Belt */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[1.6, 0.1, 32]} />
          <meshStandardMaterial color="#92400E" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. PLASMA PYROLYSIS GASIFICATION REACTOR */}
      <group position={[6, 0, -4]}>
        {/* Outer Pressure Vessel */}
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[2.2, 2.5, 8, 24]} />
          <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Reactor Plasma Core Window */}
        <mesh ref={coreGlowRef} position={[0, 3.5, 2.2]}>
          <circleGeometry args={[1.0, 24]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.2}
          />
        </mesh>
        <pointLight position={[0, 3.5, 2.5]} color="#00F0FF" intensity={6} distance={15} />
      </group>

      {/* 4. NANO-UREA SYNTHESIS COLUMNS */}
      <group position={[6, 0, 8]}>
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 8, 20]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Green Bio-Chelation Fluid Sight Tube */}
        <mesh position={[0, 4, 1.55]}>
          <cylinderGeometry args={[0.15, 0.15, 6, 12]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={1.0}
          />
        </mesh>
      </group>

      {/* 5. GLOWING GREEN HYDROGEN & NANO MANIFOLD PIPELINES */}
      <group position={[0, 7.5, 0]}>
        {/* Overhead Hydrogen Pipe */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 38, 16]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Cyan Cryogenic Return Pipe */}
        <mesh position={[1.5, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 38, 16]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* 6. AUTOMATED ROBOTIC INSPECTION ARMS */}
      <group ref={arm1Ref} position={[-3, 2, -5]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.0, 0.5]} rotation={[0.6, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
      </group>

      <group ref={arm2Ref} position={[3, 2, 4]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.6, 12]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>
        <mesh position={[0, 2.0, -0.5]} rotation={[-0.6, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
