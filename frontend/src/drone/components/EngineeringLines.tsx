"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface EngineeringLinesProps {
  chapterId: number;
  batterySlide: number;
  flightComputerElevate: number;
  isDark?: boolean;
}

export function EngineeringLines({
  chapterId,
  batterySlide,
  flightComputerElevate,
  isDark = true,
}: EngineeringLinesProps) {
  const reticleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reticleRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 6) * 0.15;
      reticleRef.current.scale.set(scale, scale, scale);
    }
  });

  const getCalloutData = () => {
    switch (chapterId) {
      case 2: // 01. Carbon Fiber Airframe (White)
        return {
          target: [0, 0.08, 0] as [number, number, number],
          elbow: [0.65, 0.45, 0] as [number, number, number],
          label: "01. Carbon Fiber Airframe",
          detail: "Monocoque Body • Carbon Fiber Shell • Reinforced Frame",
          color: "#FFFFFF",
        };
      case 3: // 02. Propulsion System (Emerald Green)
        return {
          target: [0.75, 0.12, 0.75] as [number, number, number],
          elbow: [1.35, 0.55, 0.75] as [number, number, number],
          label: "02. Propulsion System",
          detail: "4 Vector Brushless Motors • Carbon Fiber Propellers • ESC Cooling",
          color: "#00E7B3",
        };
      case 4: // 03. Power System (Electric Blue)
        return {
          target: [0, 0.16 + batterySlide * 0.45, 0.05 + batterySlide * 0.6] as [number, number, number],
          elbow: [-0.75, 0.6 + batterySlide * 0.45, 0.05] as [number, number, number],
          label: "04. Power System",
          detail: "Graphene Battery • Smart BMS • Power Distribution Board",
          color: "#00B8FF",
        };
      case 5: // 04. VTOL Flight Controller (Purple)
        return {
          target: [0, 0.15 + flightComputerElevate * 0.8, 0.3] as [number, number, number],
          elbow: [0.75, 0.65 + flightComputerElevate * 0.8, 0.3] as [number, number, number],
          label: "03. VTOL Flight Controller",
          detail: "Flight Computer • Dual IMU • Fail-safe Stabilization",
          color: "#A855F7",
        };
      case 6: // 05. Navigation Suite (Cyan)
        return {
          target: [0, 0.67, 0.28] as [number, number, number],
          elbow: [0.75, 0.95, 0.28] as [number, number, number],
          label: "05. Navigation Suite",
          detail: "RTK GPS Antenna • Dual Compass • Barometer Altitude Lock",
          color: "#06B6D4",
        };
      case 7: // 06. AI Vision System (Orange)
        return {
          target: [0, -0.18, 0.3] as [number, number, number],
          elbow: [-0.65, -0.45, 0.3] as [number, number, number],
          label: "06. AI Vision System",
          detail: "RGB 4K • Thermal FLIR • NDVI Leaf Health Scanner",
          color: "#F97316",
        };
      case 8: // 07. LiDAR Module (Neon Blue)
        return {
          target: [0, 0.67, 0.28] as [number, number, number],
          elbow: [-0.75, 0.95, 0.28] as [number, number, number],
          label: "07. LiDAR Module",
          detail: "360° Solid-State LiDAR • Terrain Mapping • Wireframe Scan",
          color: "#3B82F6",
        };
      case 9: // 08. Spray Module (Green)
        return {
          target: [0, -0.22, -0.1] as [number, number, number],
          elbow: [-0.75, -0.55, -0.1] as [number, number, number],
          label: "08. Spray Module",
          detail: "12L Nano-Urea Tank • Spray Pump • Electrostatic Nozzles",
          color: "#10B981",
        };
      case 10: // 09. Communication System (Sky Blue)
        return {
          target: [0, 0, 0] as [number, number, number],
          elbow: [0.7, 0.3, -0.2] as [number, number, number],
          label: "09. Communication System",
          detail: "5G Module • LoRa Telemetry • Ground Station Link",
          color: "#38BDF8",
        };
      case 11: // 10. Autonomous AI (Violet)
        return {
          target: [0, 0.4, 0] as [number, number, number],
          elbow: [-0.8, 0.8, 0] as [number, number, number],
          label: "10. Autonomous AI",
          detail: "Mission Planning • Path Optimization • Crop Target Selection",
          color: "#8B5CF6",
        };
      case 12: // 11. Engineering Specifications (White)
        return {
          target: [0, 0.2, 0] as [number, number, number],
          elbow: [0.8, 0.5, 0] as [number, number, number],
          label: "11. Engineering Specifications",
          detail: "Wingspan 3.4m • MTOW 72kg • 180min Endurance",
          color: "#F8FAFC",
        };
      case 13: // 12. Complete Exploded View ⭐ (Mixed Accent Gold)
        return {
          target: [0, 0.5, 0] as [number, number, number],
          elbow: [1.1, 1.1, 0] as [number, number, number],
          label: "12. COMPLETE EXPLODED VIEW ⭐",
          detail: "Full Subsystem Disassembly & Kinematic Separation",
          color: "#F59E0B",
        };
      default:
        return null;
    }
  };

  const data = getCalloutData();
  if (!data) return null;

  return (
    <group>
      {/* 1. Component Reticle Anchor Dot */}
      <mesh ref={reticleRef} position={data.target}>
        <ringGeometry args={[0.025, 0.04, 24]} />
        <meshBasicMaterial color={data.color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={data.target}>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshBasicMaterial color={data.color} />
      </mesh>

      {/* 2. Thin Glowing Engineering Line Segment */}
      <Line
        points={[data.target, data.elbow]}
        color={data.color}
        lineWidth={1.5}
        transparent
        opacity={0.8}
      />

      {/* 3. Elbow Target Dot */}
      <mesh position={data.elbow}>
        <sphereGeometry args={[0.01, 12, 12]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
    </group>
  );
}
