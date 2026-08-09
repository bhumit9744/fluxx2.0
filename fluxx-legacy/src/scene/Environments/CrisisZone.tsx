"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CrisisZone() {
  const smokeRef = useRef<THREE.Points>(null);

  // Volumetric smoke plumes rising from degraded fields
  const [smokePositions, smokeVelocities] = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = 85 + (Math.random() - 0.5) * 30; // Centered around Z = 85

      vel[i * 3] = (Math.random() - 0.5) * 0.3;
      vel[i * 3 + 1] = 0.8 + Math.random() * 1.2;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!smokeRef.current) return;
    const posAttr = smokeRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const count = 250;

    for (let i = 0; i < count; i++) {
      array[i * 3] += smokeVelocities[i * 3] * delta;
      array[i * 3 + 1] += smokeVelocities[i * 3 + 1] * delta;
      array[i * 3 + 2] += smokeVelocities[i * 3 + 2] * delta;

      // Reset when smoke dissipates high up
      if (array[i * 3 + 1] > 12) {
        array[i * 3 + 1] = 0.1;
        array[i * 3] = (Math.random() - 0.5) * 40;
        array[i * 3 + 2] = 85 + (Math.random() - 0.5) * 30;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. PARCHED CRACKED SOIL PATCH (Z = 70 to 105) */}
      <mesh position={[0, -0.05, 85]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 35]} />
        <meshStandardMaterial
          color="#3B2618" // Dry dusty burnt earth
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Dead / Withered Crop Rows */}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 85]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 32]} />
          <meshStandardMaterial color="#543D2B" roughness={1.0} />
        </mesh>
      ))}

      {/* 2. POLLUTED RUNOFF DRAINAGE CANAL */}
      <mesh position={[0, -0.08, 85]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 35]} />
        <meshStandardMaterial
          color="#2A241C" // Muddy chemical runoff
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* 3. DEAD BARREN TREES */}
      {[-18, -8, 8, 18].map((x, i) => (
        <group key={i} position={[x, 0, 75 + i * 6]}>
          {/* Trunk */}
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 4, 6]} />
            <meshStandardMaterial color="#1C130D" roughness={1.0} />
          </mesh>
          {/* Bare Twisted Branches */}
          <mesh position={[0.4, 3.2, 0]} rotation={[0, 0, -0.6]}>
            <cylinderGeometry args={[0.08, 0.12, 1.8, 5]} />
            <meshStandardMaterial color="#1C130D" />
          </mesh>
          <mesh position={[-0.4, 2.8, 0]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.08, 0.12, 1.5, 5]} />
            <meshStandardMaterial color="#1C130D" />
          </mesh>
        </group>
      ))}

      {/* 4. RED WARNING HAZARD BEACONS */}
      {[-12, 12].map((x, i) => (
        <group key={i} position={[x, 0, 85]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.7, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={1.2}
            />
          </mesh>
          <pointLight color="#EF4444" intensity={4} distance={15} />
        </group>
      ))}

      {/* 5. VOLUMETRIC CHEMICAL SMOKE PARTICLES */}
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[smokePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          color="#78716C"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
