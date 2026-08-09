"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereParticlesProps {
  droneSpeed?: number;
  cameraPos?: THREE.Vector3;
}

export function AtmosphereParticles({
  droneSpeed = 50,
  cameraPos = new THREE.Vector3(0, 0, 0),
}: AtmosphereParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 450;

  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      off[i * 3] = (Math.random() - 0.5) * 40;
      off[i * 3 + 1] = (Math.random() - 0.5) * 20;
      off[i * 3 + 2] = (Math.random() - 0.5) * 50;

      pos[i * 3] = off[i * 3];
      pos[i * 3 + 1] = off[i * 3 + 1];
      pos[i * 3 + 2] = off[i * 3 + 2];
    }
    return [pos, off];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const speedFactor = Math.max(10, droneSpeed) * delta * 1.5;

    for (let i = 0; i < count; i++) {
      // Wind speed streaks backwards along Z relative to camera
      array[i * 3 + 2] -= speedFactor;

      // Keep particles localized in a volume around the moving camera
      if (array[i * 3 + 2] < cameraPos.z - 25) {
        array[i * 3] = cameraPos.x + (Math.random() - 0.5) * 40;
        array[i * 3 + 1] = cameraPos.y + (Math.random() - 0.5) * 20;
        array[i * 3 + 2] = cameraPos.z + 25;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#00F0FF"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
