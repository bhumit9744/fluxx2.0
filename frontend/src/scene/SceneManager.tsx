"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getInterpolatedTrajectory } from "@/lib/splinePaths";
import { DroneModel } from "./Drone/DroneModel";
import { HangarEnvironment } from "./Environments/HangarEnvironment";
import { LandscapeWorld } from "./Environments/LandscapeWorld";
import { CrisisZone } from "./Environments/CrisisZone";
import { FactoryInterior } from "./Environments/FactoryInterior";
import { AIScanGrid } from "./Environments/AIScanGrid";
import { EarthGlobe } from "./Environments/EarthGlobe";
import { HelipadSunset } from "./Environments/HelipadSunset";
import { AtmosphereParticles } from "./Environments/AtmosphereParticles";
import { DynamicLighting } from "./Effects/DynamicLighting";

interface SceneManagerProps {
  progress: number;
  onSelectPart?: (partId: string) => void;
  selectedPartId?: string | null;
  manualRotateActive?: boolean;
  isDark?: boolean;
}

export function SceneManager({
  progress,
  onSelectPart,
  selectedPartId,
  manualRotateActive = false,
  isDark = false,
}: SceneManagerProps) {
  const { camera } = useThree();

  const droneGroupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Current interpolated physics state
  const currentDronePos = useRef(new THREE.Vector3());
  const currentCameraPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  // Mouse Parallax Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const traj = getInterpolatedTrajectory(progress);

    // 1. Mouse Parallax Smoothing
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    // 2. Camera-Hero Positioning (Leads the motion)
    const targetCam = traj.cameraPos.clone();
    targetCam.x += mouseRef.current.x * 0.8;
    targetCam.y -= mouseRef.current.y * 0.5;

    currentCameraPos.current.lerp(targetCam, 0.1);
    camera.position.copy(currentCameraPos.current);

    const targetLook = traj.cameraLookAt.clone();
    targetLook.x += mouseRef.current.x * 0.4;
    currentLookAt.current.lerp(targetLook, 0.1);
    camera.lookAt(currentLookAt.current);

    // 3. Realistic Aircraft Flight Physics & Inertial Damping
    if (droneGroupRef.current) {
      // Smooth inertial position follow
      currentDronePos.current.lerp(traj.dronePos, 0.12);

      // Wind turbulence micro-jitter (reacts to flight speed)
      const turbulence = traj.rotorSpeed > 0.3 ? Math.sin(t * 12) * 0.015 : 0;
      const windDriftX = Math.cos(t * 3) * 0.02 * (traj.rotorSpeed || 0.1);

      droneGroupRef.current.position.set(
        currentDronePos.current.x + windDriftX,
        currentDronePos.current.y + turbulence,
        currentDronePos.current.z
      );

      if (!manualRotateActive) {
        // Compute dynamic banking (Roll angle based on lateral movement & pitch)
        const targetRot = traj.droneRot.clone();
        // Add subtle yaw/roll reactive compensation
        targetRot.z += -mouseRef.current.x * 0.08;
        droneGroupRef.current.rotation.set(targetRot.x, targetRot.y, targetRot.z);
      }
    }
  });

  const traj = getInterpolatedTrajectory(progress);

  // Blast door opens during startup & takeoff (progress 0.10 to 0.22)
  const doorProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.12));

  return (
    <group>
      {/* 1. MOVIE-QUALITY DYNAMIC LIGHTING */}
      <DynamicLighting progress={progress} isDark={isDark} />

      {/* 2. ATMOSPHERIC PARTICLES & WIND SPEED STREAKS */}
      <AtmosphereParticles
        droneSpeed={traj.rotorSpeed * 90}
        cameraPos={traj.cameraPos}
      />

      {/* 3. SEAMLESS SINGLE-WORLD ENVIRONMENTS */}
      {/* Hangar & Startup Area */}
      <HangarEnvironment
        doorOpenProgress={doorProgress}
        lightsIntensity={progress < 0.25 ? 1 : 0.2}
        isDark={isDark}
      />

      {/* Vast Agricultural Landscape, Mountains, River & Turbines */}
      <LandscapeWorld isDark={isDark} />

      {/* Crisis Zone (Environmental degradation storytelling) */}
      <CrisisZone />

      {/* Circular Biomass Refinery Interior */}
      <FactoryInterior />

      {/* AI Multispectral Scan Grid & Precision Spray Ground Recovery */}
      <AIScanGrid
        active={traj.scanActive}
        sprayActive={traj.sprayActive}
        dronePos={traj.dronePos}
      />

      {/* Stratospheric Planetary Earth & Connected Fleet Arcs */}
      <EarthGlobe />

      {/* Sunset Helipad Landing Platform */}
      <HelipadSunset />

      {/* 4. AIRCRAFT HERO: VTOL DRONE MODEL */}
      <group ref={droneGroupRef}>
        <DroneModel
          tiltAngle={traj.tiltAngle}
          rotorSpeed={traj.rotorSpeed}
          explodedProgress={traj.explodedProgress}
          sprayActive={traj.sprayActive}
          onSelectPart={onSelectPart}
          selectedPartId={selectedPartId}
          isDark={isDark}
        />
      </group>
    </group>
  );
}
