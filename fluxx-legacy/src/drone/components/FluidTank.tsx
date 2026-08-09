"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FluidTankProps {
  transparency?: number; // 0 (opaque carbon) to 1 (translucent glass revealing liquid)
  isDark?: boolean;
}

export function FluidTank({ transparency = 0, isDark = false }: FluidTankProps) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  // Procedural Micro-Bubbles
  const bubbleGeo = useMemo(() => {
    const count = 36;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.45;
      pos[i * 3 + 1] = -0.15 + Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (liquidRef.current) {
      // Gentle slosh wave motion
      liquidRef.current.rotation.z = Math.sin(t * 2.5) * 0.05;
      liquidRef.current.rotation.x = Math.cos(t * 2.0) * 0.04;
    }
    if (bubblesRef.current) {
      const positions = bubblesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.0015;
        if (positions[i] > 0.05) positions[i] = -0.2;
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const tankColor = isDark ? "#0A1128" : "#1E293B";
  const liquidColor = "#00E7B3";

  return (
    <group position={[0, -0.12, 0]}>
      {/* Outer Tank Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.28, 0.85]} />
        <meshPhysicalMaterial
          color={tankColor}
          metalness={0.2}
          roughness={0.1}
          transmission={transparency * 0.85} // Glass transmission
          thickness={0.5}
          transparent
          opacity={1 - transparency * 0.3}
        />
      </mesh>

      {/* Internal Bio-Active Nano-Urea Fluid (Illuminated) */}
      <group position={[0, -0.04, 0]}>
        <mesh ref={liquidRef}>
          <boxGeometry args={[0.52, 0.18, 0.78]} />
          <meshStandardMaterial
            color={liquidColor}
            emissive={liquidColor}
            emissiveIntensity={0.6 + transparency * 0.4}
            transparent
            opacity={Math.max(0.2, transparency)}
            roughness={0.1}
          />
        </mesh>

        {/* Micro-Bubbles Active Stream */}
        {transparency > 0.3 && (
          <points ref={bubblesRef} geometry={bubbleGeo}>
            <pointsMaterial
              size={0.02}
              color="#FFFFFF"
              transparent
              opacity={transparency * 0.8}
            />
          </points>
        )}
      </group>

      {/* Titanium Fluid Delivery Manifold */}
      <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
