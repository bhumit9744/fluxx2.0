"use client";

import { useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DynamicLightingProps {
  progress: number; // 0 to 1
  isDark?: boolean;
}

export function DynamicLighting({ progress, isDark = false }: DynamicLightingProps) {
  const { scene } = useThree();

  // Compute interpolated lighting colors & intensities based on progress & theme
  const lighting = useMemo(() => {
    if (isDark) {
      // Dark Theme Configuration
      let sunColor = "#FFF8E7";
      let sunIntensity = 2.5;
      let ambientColor = "#1E293B";
      let ambientIntensity = 0.8;
      const sunPos: [number, number, number] = [30, 40, 20];
      let fogColor = "#05070A";

      if (progress < 0.2) {
        sunColor = "#00F0FF";
        sunIntensity = 1.8;
        ambientColor = "#0A0E17";
        ambientIntensity = 0.5;
        fogColor = "#0A0E17";
      } else if (progress < 0.38) {
        sunColor = "#FEF08A";
        sunIntensity = 3.0;
        ambientColor = "#064E3B";
        ambientIntensity = 0.9;
        fogColor = "#06281E";
      } else if (progress < 0.52) {
        sunColor = "#F59E0B";
        sunIntensity = 2.0;
        ambientColor = "#111827";
        ambientIntensity = 0.6;
        fogColor = "#111827";
      } else if (progress < 0.75) {
        sunColor = "#00F0FF";
        sunIntensity = 1.6;
        ambientColor = "#022C22";
        ambientIntensity = 0.4;
        fogColor = "#021A15";
      } else if (progress < 0.88) {
        sunColor = "#FFFFFF";
        sunIntensity = 3.5;
        ambientColor = "#020617";
        ambientIntensity = 0.2;
        fogColor = "#020617";
      } else {
        sunColor = "#F97316";
        sunIntensity = 3.2;
        ambientColor = "#451A03";
        ambientIntensity = 0.7;
        fogColor = "#2A1005";
      }

      return { sunColor, sunIntensity, ambientColor, ambientIntensity, sunPos, fogColor };
    } else {
      // Crisp Light Theme Configuration (Clean Daylight Apple / Aerospace Aesthetic)
      let sunColor = "#FFFBEB";
      let sunIntensity = 3.5;
      let ambientColor = "#F1F5F9";
      let ambientIntensity = 1.4;
      const sunPos: [number, number, number] = [35, 45, 25];
      let fogColor = "#E2E8F0";

      if (progress < 0.2) {
        // Pristine Architectural Hangar (Clean White & Soft Blue Daylight)
        sunColor = "#FFFFFF";
        sunIntensity = 3.2;
        ambientColor = "#E2E8F0";
        ambientIntensity = 1.5;
        fogColor = "#E2E8F0";
      } else if (progress < 0.38) {
        // Bright Morning Open Farmland
        sunColor = "#FEF9C3";
        sunIntensity = 3.8;
        ambientColor = "#DCFCE7";
        ambientIntensity = 1.4;
        fogColor = "#E0F2FE";
      } else if (progress < 0.52) {
        // Modern Cleanroom Biomass Refinery
        sunColor = "#FEF3C7";
        sunIntensity = 3.0;
        ambientColor = "#F1F5F9";
        ambientIntensity = 1.3;
        fogColor = "#E2E8F0";
      } else if (progress < 0.75) {
        // AI Multispectral Scanning Over Fields
        sunColor = "#E0F2FE";
        sunIntensity = 3.4;
        ambientColor = "#ECFDF5";
        ambientIntensity = 1.4;
        fogColor = "#E0F2FE";
      } else if (progress < 0.88) {
        // Planetary View (Atmospheric Blue)
        sunColor = "#FFFFFF";
        sunIntensity = 4.2;
        ambientColor = "#E0E7FF";
        ambientIntensity = 1.1;
        fogColor = "#CBD5E1";
      } else {
        // Golden Magic Hour Sunset
        sunColor = "#FDBA74";
        sunIntensity = 3.6;
        ambientColor = "#FFEDD5";
        ambientIntensity = 1.3;
        fogColor = "#FED7AA";
      }

      return { sunColor, sunIntensity, ambientColor, ambientIntensity, sunPos, fogColor };
    }
  }, [progress, isDark]);

  // Dynamically update Three.js scene fog and background for seamless sky blending
  useEffect(() => {
    scene.fog = new THREE.FogExp2(lighting.fogColor, isDark ? 0.004 : 0.0025);
    scene.background = new THREE.Color(lighting.fogColor);
  }, [scene, lighting.fogColor, isDark]);

  return (
    <group>
      {/* Ambient Fill */}
      <ambientLight
        color={lighting.ambientColor}
        intensity={lighting.ambientIntensity}
      />

      {/* Main Directional Sun Light */}
      <directionalLight
        position={lighting.sunPos}
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Hemisphere Light for Realistic Sky & Ground Bounce */}
      <hemisphereLight
        args={[
          isDark ? "#00F0FF" : "#BAE6FD",
          isDark ? "#064E3B" : "#86EFAC",
          isDark ? 0.4 : 0.7,
        ]}
      />
    </group>
  );
}
