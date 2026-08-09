"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AIScanGridProps {
  active: boolean;
  sprayActive?: boolean;
  dronePos?: THREE.Vector3;
}

export function AIScanGrid({
  active,
  sprayActive = false,
  dronePos = new THREE.Vector3(0, 6, 290),
}: AIScanGridProps) {
  const scanLineRef = useRef<THREE.Mesh>(null);
  const targetBoxesRef = useRef<THREE.Group>(null);

  // Crop detection targets (bounding boxes)
  const targets = useMemo(
    () => [
      { pos: [-6, 0.4, 285], status: "CRITICAL", label: "NITROGEN CHLOROSIS (-42%)", color: "#EF4444" },
      { pos: [8, 0.4, 295], status: "WARNING", label: "MOISTURE STRESS (-18%)", color: "#F59E0B" },
      { pos: [-4, 0.4, 305], status: "OPTIMAL", label: "HIGH CANOPY DENSITY", color: "#10B981" },
      { pos: [5, 0.4, 335], status: "TREATED", label: "NANO-UREA APPLIED", color: "#00F0FF" },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Sweeping laser scan line
    if (scanLineRef.current) {
      scanLineRef.current.position.z = 280 + ((t * 18) % 35);
    }

    // Holographic target reticle pulse
    if (targetBoxesRef.current) {
      targetBoxesRef.current.position.y = Math.sin(t * 4) * 0.05;
    }
  });

  return (
    <group>
      {/* 1. HOLOGRAPHIC SCANNING PLANE (Z = 270 to 350) */}
      {active && (
        <group>
          {/* Sweeping Laser Line on Ground */}
          <mesh
            ref={scanLineRef}
            position={[0, 0.08, 290]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[45, 1.2]} />
            <meshBasicMaterial
              color="#00F0FF"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Holographic Wireframe Grid Overlay */}
          <mesh position={[0, 0.04, 305]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 70, 25, 35]} />
            <meshBasicMaterial
              color="#00F0FF"
              wireframe
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>

          {/* Downward Scanning Laser Frustum Beam from Drone */}
          <mesh position={[dronePos.x, dronePos.y / 2, dronePos.z]}>
            <coneGeometry args={[14, dronePos.y, 4, 1, true]} />
            <meshBasicMaterial
              color="#00F0FF"
              wireframe
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* 2. 3D AI TARGET BOUNDING BOXES */}
      <group ref={targetBoxesRef}>
        {targets.map((tgt, idx) => {
          // If spraying in Scene 12, turn critical items into green treated
          const isTreated = sprayActive && tgt.pos[2] > 320;
          const displayColor = isTreated ? "#10B981" : tgt.color;

          return (
            <group key={idx} position={tgt.pos as [number, number, number]}>
              {/* Bounding Box Wireframe */}
              <mesh>
                <boxGeometry args={[4, 0.6, 4]} />
                <meshBasicMaterial
                  color={displayColor}
                  wireframe
                  transparent
                  opacity={active || sprayActive ? 0.9 : 0}
                />
              </mesh>

              {/* Corner brackets */}
              <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
                <ringGeometry args={[1.2, 1.3, 4]} />
                <meshBasicMaterial
                  color={displayColor}
                  transparent
                  opacity={active || sprayActive ? 0.8 : 0}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. GROUND RESTORATION BLOOM (Z = 330 to 365) */}
      <mesh position={[0, 0.03, 345]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 35]} />
        <meshStandardMaterial
          color={sprayActive ? "#10B981" : "#047857"}
          emissive={sprayActive ? "#10B981" : "#000000"}
          emissiveIntensity={sprayActive ? 0.3 : 0}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}
