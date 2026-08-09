"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function HelipadSunset() {
  const beaconLightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Runway approach beacon pulse
    if (beaconLightsRef.current) {
      beaconLightsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.5 + Math.sin(t * 5 + i * 0.8) * 0.5;
        }
      });
    }
  });

  return (
    <group position={[0, 0, 715]}>
      {/* 1. OCTAGONAL HELIPAD PLATFORM */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.5, 0.2, 8]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Helipad Perimeter Glow Ring */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.4, 6.7, 32]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Center Landing "H" & Inner Ring */}
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.4, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* "H" Crossbars */}
      <mesh position={[-1.2, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 3.2]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.2, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 3.2]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 0.4]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
      </mesh>

      {/* 2. RUNWAY PERIMETER STROBE LIGHTS */}
      <group ref={beaconLightsRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i * Math.PI) / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(ang) * 7.2, 0.25, Math.sin(ang) * 7.2]}
            >
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color="#00F0FF"
                emissive="#00F0FF"
                emissiveIntensity={1.0}
              />
            </mesh>
          );
        })}
      </group>

      {/* 3. WARM SUNSET ILLUMINATION */}
      <pointLight position={[0, 6, -10]} color="#F59E0B" intensity={8} distance={35} />
    </group>
  );
}
