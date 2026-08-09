"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { DroneGLTFModel } from "./DroneGLTFModel";
import { BatteryModule } from "./components/BatteryModule";
import { FlightComputer } from "./components/FlightComputer";
import { LidarSensor } from "./components/LidarSensor";
import { GimbalCamera } from "./components/GimbalCamera";
import { FluidTank } from "./components/FluidTank";
import { SprayNozzles } from "./components/SprayNozzles";
import { HologramProjector } from "./components/HologramProjector";
import { DimensionLines } from "./components/DimensionLines";
import { PowerFlowLines } from "./components/PowerFlowLines";

interface DroneMasterProps {
  activeChapterId?: number;
  tiltAngle: number; // 0 to Math.PI/2
  rotorSpeed: number; // 0 to 1
  batterySlide: number; // 0 to 1
  flightComputerElevate: number; // 0 to 1
  cameraPitch: number;
  lidarSpin: number;
  tankTransparency: number;
  sprayActive: boolean;
  explodedProgress: number; // 0 to 1
  powerFlowActive: boolean;
  hologramActive: boolean;
  dimensionLinesActive: boolean;
  wingsFolded: number; // 0 to 1
  isDark?: boolean;
  useCustomGLTF?: boolean;
}

export function DroneMaster({
  activeChapterId = 1,
  tiltAngle,
  rotorSpeed,
  batterySlide,
  flightComputerElevate,
  cameraPitch,
  lidarSpin,
  tankTransparency,
  sprayActive,
  explodedProgress,
  powerFlowActive,
  hologramActive,
  dimensionLinesActive,
  wingsFolded,
  isDark = false,
  useCustomGLTF = false,
}: DroneMasterProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const [hasGLTFFile, setHasGLTFFile] = useState(false);

  useEffect(() => {
    // Check if Drone_FLUXX_Brand_V3.glb exists in public folder
    fetch("/models/Drone_FLUXX_Brand_V3.glb", { method: "HEAD" })
      .then((res) => {
        if (res.ok) setHasGLTFFile(true);
      })
      .catch(() => {});
  }, []);

  // Spin 4 propellers
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Hover float
    if (rootGroupRef.current && explodedProgress < 0.2) {
      rootGroupRef.current.position.y = Math.sin(t * 2.2) * 0.03;
      rootGroupRef.current.rotation.z = Math.sin(t * 1.5) * 0.012;
      rootGroupRef.current.rotation.x = Math.cos(t * 1.8) * 0.008;
    }

    // Spin 4 quadcopter motors
    if (rotorSpeed > 0.01) {
      rotorsRef.current.forEach((r, idx) => {
        if (!r) return;
        const dir = idx % 2 === 0 ? 1 : -1;
        r.rotation.y += delta * rotorSpeed * 48 * dir;
      });
    }
  });

  const exp = explodedProgress;

  // Quadcopter Arm Definitions (45 degree X-frame layout)
  // Front-Left & Front-Right are WHITE; Rear-Left & Rear-Right are RED
  const armConfigs = [
    { name: "Front-Left Arm",  angle: Math.PI * 0.25,  color: "#FFFFFF", legColor: "#FFFFFF", isFront: true,  idx: 0 },
    { name: "Front-Right Arm", angle: Math.PI * 0.75,  color: "#FFFFFF", legColor: "#FFFFFF", isFront: true,  idx: 1 },
    { name: "Rear-Left Arm",   angle: -Math.PI * 0.25, color: "#DC2626", legColor: "#B91C1C", isFront: false, idx: 2 },
    { name: "Rear-Right Arm",  angle: -Math.PI * 0.75, color: "#DC2626", legColor: "#B91C1C", isFront: false, idx: 3 },
  ];

  if (hasGLTFFile || useCustomGLTF) {
    return (
      <group ref={rootGroupRef}>
        <DroneGLTFModel
          modelPath="/models/Drone_FLUXX_Brand_V3.glb"
          activeChapterId={activeChapterId}
          explodedProgress={explodedProgress}
          batterySlide={batterySlide}
          flightComputerElevate={flightComputerElevate}
          rotorSpeed={rotorSpeed}
          lidarSpin={lidarSpin}
        />
        {sprayActive && <SprayNozzles isActive={sprayActive} />}
        {hologramActive && <HologramProjector isActive={hologramActive} />}
        {dimensionLinesActive && <DimensionLines isActive={dimensionLinesActive} />}
        {powerFlowActive && <PowerFlowLines isActive={powerFlowActive} />}
      </group>
    );
  }

  return (
    <group ref={rootGroupRef}>
      {/* ========================================================================= */}
      {/* 1. CENTRAL CARBON FIBER CHASSIS PLATES & FLIGHT CONTROLLER                 */}
      {/* ========================================================================= */}
      <group position={[0, exp * 0.2, 0]}>
        {/* Central Top Carbon Plate */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial
            color="#0B0F19"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Central Bottom Carbon Plate */}
        <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.02, 0.75]} />
          <meshStandardMaterial
            color="#0B0F19"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Sandwiched Flight Controller PCB Board */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.32, 0.05, 0.32]} />
          <meshStandardMaterial color="#065F46" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Status LED Ring on Center Board */}
        <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.08, 24]} />
          <meshStandardMaterial
            color="#00E7B3"
            emissive="#00E7B3"
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* Silver Hex Bolts securing arms to frame plates */}
        {[-0.2, 0.2].map((x) =>
          [-0.28, 0.28].map((z, bIdx) => (
            <group key={`bolt-${x}-${z}-${bIdx}`}>
              <mesh position={[x, 0.092, z]}>
                <cylinderGeometry args={[0.014, 0.014, 0.012, 12]} />
                <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.05} />
              </mesh>
              <mesh position={[x, -0.092, z]}>
                <cylinderGeometry args={[0.014, 0.014, 0.012, 12]} />
                <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.05} />
              </mesh>
            </group>
          ))
        )}

        {/* 3D Label Callout during Exploded Mode */}
        {exp > 0.4 && (
          <Html position={[0, 0.15, 0]} center distanceFactor={8}>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-mono text-[10px] font-bold border border-slate-700 shadow-xl whitespace-nowrap">
              Central Carbon Frame & PDB
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 2. SUB-COMPONENTS: BATTERY (TOP), GPS MAST, CAMERA & TANK                  */}
      {/* ========================================================================= */}
      {/* White LiPo Battery Mounted on Top Plate */}
      <BatteryModule
        slideProgress={batterySlide + exp * 0.5}
        isDark={isDark}
      />

      {/* Flight Computer / Internal Avionics */}
      <FlightComputer
        elevateProgress={flightComputerElevate + exp * 0.8}
        powerFlowActive={powerFlowActive}
        isDark={isDark}
      />

      {/* Elevated GPS Mast Antenna with Red Ring Logo */}
      <group position={[0, exp * 0.6, 0]}>
        <LidarSensor spinSpeed={lidarSpin} />
      </group>

      {/* Multispectral Gimbal Camera Mounted Underneath */}
      <group position={[0, -0.15 - exp * 0.4, 0.3 + exp * 0.4]}>
        <GimbalCamera pitch={cameraPitch} isDark={isDark} />
      </group>

      {/* Nano-Urea Liquid Tank & Spray System Underneath */}
      <group position={[0, -0.22 - exp * 0.3, -0.1]}>
        <FluidTank
          transparency={tankTransparency}
          isDark={isDark}
        />
      </group>

      <SprayNozzles isActive={sprayActive} />

      {/* ========================================================================= */}
      {/* 3. 4× F450 QUADCOPTER ARMS (2 WHITE FRONT ARMS, 2 RED REAR ARMS)          */}
      {/* ========================================================================= */}
      {armConfigs.map((cfg) => {
        const armLength = 1.05;
        const dist = armLength * (1 + exp * 0.4);
        const ax = Math.cos(cfg.angle) * dist;
        const az = Math.sin(cfg.angle) * dist;

        return (
          <group key={cfg.name} position={[ax, 0, az]} rotation={[0, -cfg.angle + Math.PI / 2, 0]}>
            {/* Main Molded Arm (Lattice Truss with Cutouts) */}
            <group position={[0, 0, 0]}>
              {/* Inner Carbon Core Beam (Provides high-contrast outline to white/red outer shell) */}
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.04, 0.05, armLength * 0.95]} />
                <meshStandardMaterial color="#090D16" roughness={0.4} metalness={0.8} />
              </mesh>

              {/* Top Main Beam Outer Shell */}
              <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.085, 0.03, armLength]} />
                <meshStandardMaterial
                  color={cfg.color}
                  roughness={0.15}
                  metalness={0.1}
                />
              </mesh>

              {/* Bottom Main Beam Outer Shell */}
              <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.085, 0.03, armLength]} />
                <meshStandardMaterial
                  color={cfg.color}
                  roughness={0.15}
                  metalness={0.1}
                />
              </mesh>

              {/* Lattice Truss Cross Ribs (Weight reduction windows) */}
              {[-0.3, -0.1, 0.1, 0.3].map((zPos, ribIdx) => (
                <mesh key={ribIdx} position={[0, 0, zPos]} castShadow>
                  <boxGeometry args={[0.07, 0.07, 0.038]} />
                  <meshStandardMaterial
                    color={cfg.color}
                    roughness={0.2}
                    metalness={0.1}
                  />
                </mesh>
              ))}

              {/* ESC Module & Wiring Mounted Under Arm */}
              <group position={[0, -0.065, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.06, 0.02, 0.22]} />
                  <meshStandardMaterial color="#020617" roughness={0.5} />
                </mesh>
                {/* Black Zip Ties Holding ESC to Arm */}
                {[-0.08, 0.08].map((zZip, zIdx) => (
                  <mesh key={zIdx} position={[0, 0.03, zZip]}>
                    <torusGeometry args={[0.05, 0.006, 8, 16]} />
                    <meshStandardMaterial color="#0B0F19" roughness={0.9} />
                  </mesh>
                ))}
              </group>

              {/* Outer Tip Landing Leg (Drop Foot) */}
              <group position={[0, -0.22, armLength * 0.42]}>
                <mesh castShadow>
                  <coneGeometry args={[0.045, 0.32, 16]} />
                  <meshStandardMaterial
                    color={cfg.legColor}
                    roughness={0.2}
                    metalness={0.1}
                  />
                </mesh>
                {/* Rubber Landing Pad Tip */}
                <mesh position={[0, -0.16, 0]}>
                  <cylinderGeometry args={[0.02, 0.025, 0.04, 12]} />
                  <meshStandardMaterial color="#0B0F19" roughness={0.9} />
                </mesh>
              </group>

              {/* ================================================================ */}
              {/* OUTRUNNER BRUSHLESS MOTOR & SILVER BULLET CAP PROP NUT          */}
              {/* ================================================================ */}
              <group position={[0, 0.08, armLength * 0.44]}>
                {/* Motor Stator Base Flange (Anodized Red) */}
                <mesh position={[0, 0.015, 0]} castShadow>
                  <cylinderGeometry args={[0.085, 0.085, 0.03, 24]} />
                  <meshStandardMaterial color="#DC2626" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Copper Stator Coils Visible Inside Motor Windows */}
                <mesh position={[0, 0.04, 0]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.035, 16]} />
                  <meshStandardMaterial color="#B45309" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Motor Bell Housing (Black Metal with Cooling Slots) */}
                <mesh position={[0, 0.06, 0]} castShadow>
                  <cylinderGeometry args={[0.078, 0.078, 0.06, 24]} />
                  <meshStandardMaterial color="#0B0F19" metalness={0.95} roughness={0.15} />
                </mesh>

                {/* High-Shine Metallic Silver Propeller Bullet Nut Cap */}
                <mesh position={[0, 0.115, 0]} castShadow>
                  <coneGeometry args={[0.038, 0.065, 24]} />
                  <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.04} />
                </mesh>

                {/* 2-Blade Aerodynamic Propeller Assembly */}
                <group
                  ref={(el) => {
                    if (el) rotorsRef.current[cfg.idx] = el;
                  }}
                  position={[0, 0.095, 0]}
                >
                  <mesh castShadow>
                    <boxGeometry args={[0.78, 0.012, 0.065]} />
                    <meshStandardMaterial color="#090D16" roughness={0.3} metalness={0.4} />
                  </mesh>
                  {/* Prop Hub Nut */}
                  <mesh position={[0, 0.01, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
                    <meshStandardMaterial color="#F1F5F9" metalness={0.95} />
                  </mesh>
                </group>

                {/* 3D Label Callout during Exploded Mode */}
                {exp > 0.4 && cfg.idx === 0 && (
                  <Html position={[0, 0.25, 0]} center distanceFactor={8}>
                    <div className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold shadow-lg whitespace-nowrap">
                      Brushless Motor & Silver Bullet Cap
                    </div>
                  </Html>
                )}
              </group>
            </group>
          </group>
        );
      })}

      {/* ========================================================================= */}
      {/* 4. DYNAMIC EFFECTS: POWER FLOW, HOLOGRAM & DIMENSIONS                    */}
      {/* ========================================================================= */}
      <PowerFlowLines isActive={powerFlowActive} />
      <HologramProjector isActive={hologramActive} />
      <DimensionLines isActive={dimensionLinesActive} />
    </group>
  );
}
