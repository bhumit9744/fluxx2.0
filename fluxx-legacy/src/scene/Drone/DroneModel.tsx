"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SprayEmitters } from "./SprayEmitters";

interface DroneModelProps {
  tiltAngle?: number; // 0 = forward flight, Math.PI/2 = VTOL hover
  rotorSpeed?: number; // 0 to 1
  explodedProgress?: number; // 0 (assembled) to 1 (fully exploded)
  sprayActive?: boolean;
  onSelectPart?: (partId: string) => void;
  selectedPartId?: string | null;
  isDark?: boolean;
}

export function DroneModel({
  tiltAngle = Math.PI / 2,
  rotorSpeed = 0,
  explodedProgress = 0,
  sprayActive = false,
  onSelectPart,
  selectedPartId,
  isDark = false,
}: DroneModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const gpsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Propeller spinning
    const spinDelta = rotorSpeed * delta * 45;
    rotorsRef.current.forEach((r, idx) => {
      if (!r) return;
      const dir = idx % 2 === 0 ? 1 : -1;
      r.rotation.y += spinDelta * dir;
    });

    // GPS Head subtle rotation
    if (gpsRef.current && rotorSpeed > 0.1) {
      gpsRef.current.rotation.y += delta * 2;
    }

    // Micro aerodynamic floating vibration
    if (groupRef.current && rotorSpeed > 0.1 && explodedProgress < 0.1) {
      groupRef.current.position.y = Math.sin(t * 8) * 0.02 * rotorSpeed;
      groupRef.current.rotation.z = Math.sin(t * 3) * 0.01 * rotorSpeed;
    }
  });

  const exp = explodedProgress;

  const armConfigs = [
    { name: "Front-Left",  angle: Math.PI * 0.25,  color: "#F8FAFC", legColor: "#FFFFFF", idx: 0 },
    { name: "Front-Right", angle: Math.PI * 0.75,  color: "#F8FAFC", legColor: "#FFFFFF", idx: 1 },
    { name: "Rear-Left",   angle: -Math.PI * 0.25, color: "#DC2626", legColor: "#B91C1C", idx: 2 },
    { name: "Rear-Right",  angle: -Math.PI * 0.75, color: "#DC2626", legColor: "#B91C1C", idx: 3 },
  ];

  return (
    <group ref={groupRef}>
      {/* 1. CENTRAL CARBON CHASSIS PLATES & FLIGHT CONTROLLER */}
      <group
        position={[0, exp * 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPart?.("airframe");
        }}
      >
        {/* Top Carbon Frame Plate */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Bottom Carbon Frame Plate */}
        <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Sandwiched Flight Controller Board */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.32, 0.05, 0.32]} />
          <meshStandardMaterial color="#065F46" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Status Indicator Light */}
        <mesh position={[0, 0.091, 0.25]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshStandardMaterial color="#00E7B3" emissive="#00E7B3" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 2. TOP MOUNTED WHITE LIPO BATTERY WITH BLACK STRAP */}
      <group
        position={[0, 0.16 + exp * 0.5, 0.05 + exp * 0.4]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPart?.("battery");
        }}
      >
        {/* White Battery Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.22, 0.75]} />
          <meshStandardMaterial
            color={selectedPartId === "battery" ? "#10B981" : "#F8FAFC"}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
        {/* Red & Blue Spec Decals */}
        <group position={[0, 0.111, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh position={[-0.08, 0.1, 0.001]}>
            <planeGeometry args={[0.12, 0.35]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <mesh position={[0.08, -0.1, 0.001]}>
            <planeGeometry args={[0.12, 0.35]} />
            <meshBasicMaterial color="#2563EB" />
          </mesh>
        </group>
        {/* Black Velcro Strap */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.24, 0.12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. ELEVATED GPS MAST WITH WHITE DISC PUCK & RED RING LOGO */}
      <group
        position={[0, 0.16 + exp * 0.6, 0.28]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPart?.("lidar");
        }}
      >
        {/* Black Carbon Mast Pole */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.48, 16]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        {/* White GPS Disc Puck */}
        <group ref={gpsRef} position={[0, 0.51, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          {/* Red Ring Logo on Puck */}
          <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.07, 0.105, 32]} />
            <meshBasicMaterial color="#DC2626" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* 4. 4× F450 QUADCOPTER ARMS (2 WHITE FRONT, 2 RED REAR) */}
      {armConfigs.map((cfg) => {
        const armLength = 1.05;
        const dist = armLength * (1 + exp * 0.4);
        const ax = Math.cos(cfg.angle) * dist;
        const az = Math.sin(cfg.angle) * dist;

        return (
          <group
            key={cfg.name}
            position={[ax, 0, az]}
            rotation={[0, -cfg.angle + Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart?.("rotor");
            }}
          >
            {/* Top Beam */}
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.08, 0.03, armLength]} />
              <meshStandardMaterial color={cfg.color} roughness={0.25} metalness={0.2} />
            </mesh>
            {/* Bottom Beam */}
            <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.08, 0.03, armLength]} />
              <meshStandardMaterial color={cfg.color} roughness={0.25} metalness={0.2} />
            </mesh>
            {/* Lattice Cutouts */}
            {[-0.3, -0.1, 0.1, 0.3].map((zPos, i) => (
              <mesh key={i} position={[0, 0, zPos]} castShadow>
                <boxGeometry args={[0.065, 0.07, 0.035]} />
                <meshStandardMaterial color={cfg.color} roughness={0.3} />
              </mesh>
            ))}
            {/* Outer Drop Landing Foot */}
            <group position={[0, -0.22, armLength * 0.42]}>
              <mesh castShadow>
                <coneGeometry args={[0.045, 0.32, 16]} />
                <meshStandardMaterial color={cfg.legColor} roughness={0.3} />
              </mesh>
            </group>
            {/* Outrunner Motor with Silver Prop Bullet Cap */}
            <group position={[0, 0.08, armLength * 0.44]}>
              <mesh position={[0, 0.015, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
                <meshStandardMaterial color="#B91C1C" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.06, 0]} castShadow>
                <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
                <meshStandardMaterial color="#1E293B" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.115, 0]} castShadow>
                <coneGeometry args={[0.035, 0.06, 20]} />
                <meshStandardMaterial color="#F1F5F9" metalness={0.95} roughness={0.1} />
              </mesh>
              {/* Spinning 2-Blade Propeller */}
              <group
                ref={(el) => {
                  if (el) rotorsRef.current[cfg.idx] = el;
                }}
                position={[0, 0.095, 0]}
              >
                <mesh castShadow>
                  <boxGeometry args={[0.76, 0.012, 0.065]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} />
                </mesh>
              </group>
            </group>
          </group>
        );
      })}

      {/* 5. GIMBAL CAMERA & SPRAY SYSTEM UNDERNEATH */}
      <group
        position={[0, -0.15 - exp * 0.4, 0.3 + exp * 0.4]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPart?.("camera");
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
      </group>

      <SprayEmitters active={sprayActive} />
    </group>
  );
}
