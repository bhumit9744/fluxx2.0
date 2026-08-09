"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PowerFlowLinesProps {
  isActive?: boolean;
}

export function PowerFlowLines({ isActive = false }: PowerFlowLinesProps) {
  const pulsesRef = useRef<THREE.Points>(null);

  // Generate 64 energy packet particles travelling along wiring channels
  const { paths, particleGeo } = useMemo(() => {
    const lines = [
      // Battery to CPU
      [new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0.2, -0.15)],
      // Battery to Left Front Motor
      [
        new THREE.Vector3(0, 0, 0.2),
        new THREE.Vector3(-0.6, 0.05, 0),
        new THREE.Vector3(-1.6, 0.1, 0.6),
      ],
      // Battery to Right Front Motor
      [
        new THREE.Vector3(0, 0, 0.2),
        new THREE.Vector3(0.6, 0.05, 0),
        new THREE.Vector3(1.6, 0.1, 0.6),
      ],
      // Battery to Left Rear Motor
      [
        new THREE.Vector3(0, 0, 0.2),
        new THREE.Vector3(-0.6, 0.05, -0.4),
        new THREE.Vector3(-1.6, 0.1, -0.8),
      ],
      // Battery to Right Rear Motor
      [
        new THREE.Vector3(0, 0, 0.2),
        new THREE.Vector3(0.6, 0.05, -0.4),
        new THREE.Vector3(1.6, 0.1, -0.8),
      ],
    ];

    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    return { paths: lines, particleGeo: geo };
  }, []);

  useFrame((state) => {
    if (!isActive || !pulsesRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = pulsesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < 60; i++) {
      const pathIdx = i % paths.length;
      const path = paths[pathIdx];
      const speed = 1.2;
      const progress = ((t * speed + i * 0.15) % 1);

      if (path.length === 2) {
        const pt = new THREE.Vector3().lerpVectors(path[0], path[1], progress);
        pos[i * 3] = pt.x;
        pos[i * 3 + 1] = pt.y;
        pos[i * 3 + 2] = pt.z;
      } else if (path.length === 3) {
        let pt: THREE.Vector3;
        if (progress < 0.5) {
          pt = new THREE.Vector3().lerpVectors(path[0], path[1], progress * 2);
        } else {
          pt = new THREE.Vector3().lerpVectors(path[1], path[2], (progress - 0.5) * 2);
        }
        pos[i * 3] = pt.x;
        pos[i * 3 + 1] = pt.y;
        pos[i * 3 + 2] = pt.z;
      }
    }

    pulsesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!isActive) return null;

  return (
    <group>
      {/* Animated Synaptic Energy Pulses */}
      <points ref={pulsesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.06}
          color="#00E7B3"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
