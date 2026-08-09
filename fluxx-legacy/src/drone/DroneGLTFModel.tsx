"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface DroneGLTFModelProps {
  modelPath?: string;
  activeChapterId?: number;
  explodedProgress?: number;
  batterySlide?: number;
  flightComputerElevate?: number;
  rotorSpeed?: number;
  lidarSpin?: number;
}

export function DroneGLTFModel({
  modelPath = "/models/Drone_FLUXX_Brand_V3.glb",
  activeChapterId = 1,
  explodedProgress = 0,
  batterySlide = 0,
  flightComputerElevate = 0,
  rotorSpeed = 0,
  lidarSpin = 0,
}: DroneGLTFModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  // High-End Aerospace & Automotive PBR Physical Materials (Apple / DJI Tier)
  const materials = useMemo(() => {
    return {
      // Deep Gloss Carbon Fiber Chassis with high-shine Clearcoat
      carbonChassis: new THREE.MeshPhysicalMaterial({
        color: "#0B0F19",
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
        envMapIntensity: 1.8,
      }),
      // Front Arms: High-Gloss Automotive Pearl White
      frontArmWhite: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        metalness: 0.15,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 0.95,
        envMapIntensity: 2.0,
      }),
      // Rear Arms: Anodized Metallic Flame Red
      rearArmRed: new THREE.MeshPhysicalMaterial({
        color: "#DC2626",
        metalness: 0.88,
        roughness: 0.12,
        clearcoat: 0.95,
        clearcoatRoughness: 0.06,
        reflectivity: 0.9,
        envMapIntensity: 1.9,
      }),
      // Motor Bell: Anodized Ruby Red
      motorRed: new THREE.MeshPhysicalMaterial({
        color: "#EF4444",
        metalness: 0.95,
        roughness: 0.08,
        clearcoat: 0.8,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.2,
      }),
      // Prop Nut / Bullet Cap: Mirror Polished Chrome
      chromeCap: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        metalness: 0.98,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        envMapIntensity: 2.5,
      }),
      // Propellers: High-Modulus 3K Carbon Fiber Blades
      propBlack: new THREE.MeshPhysicalMaterial({
        color: "#070A10",
        metalness: 0.6,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.5,
      }),
      // Graphene Battery: Satin Solid White with Micro-Sheen
      batteryWhite: new THREE.MeshPhysicalMaterial({
        color: "#F8FAFC",
        metalness: 0.15,
        roughness: 0.15,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.6,
      }),
      // Battery Accent / BMS Decal: Electric Cyan
      batteryCyanDecal: new THREE.MeshPhysicalMaterial({
        color: "#00B8FF",
        metalness: 0.85,
        roughness: 0.1,
        emissive: "#00B8FF",
        emissiveIntensity: 0.35,
        clearcoat: 1.0,
        envMapIntensity: 2.0,
      }),
      // GPS Puck: Ceramic White
      gpsDisc: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.8,
      }),
      // GPS Ring Accent: Flame Red
      gpsRingLogo: new THREE.MeshPhysicalMaterial({
        color: "#EF4444",
        metalness: 0.9,
        roughness: 0.08,
        clearcoat: 0.8,
        envMapIntensity: 2.0,
      }),
      // 4K Gimbal Optical Lens: Multi-coated Optical Cyan Glass
      cameraLensCyan: new THREE.MeshPhysicalMaterial({
        color: "#00B8FF",
        metalness: 0.9,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        transmission: 0.6,
        ior: 1.52,
        emissive: "#00B8FF",
        emissiveIntensity: 0.4,
        envMapIntensity: 2.5,
      }),
      // Spray Tank: Translucent Emerald Glass
      tankEmerald: new THREE.MeshPhysicalMaterial({
        color: "#00E7B3",
        metalness: 0.05,
        roughness: 0.08,
        transmission: 0.75,
        thickness: 0.6,
        transparent: true,
        opacity: 0.88,
        ior: 1.48,
        clearcoat: 1.0,
        envMapIntensity: 2.2,
      }),
      // 360 LiDAR: Anodized Cobalt Dome
      lidarNeonBlue: new THREE.MeshPhysicalMaterial({
        color: "#3B82F6",
        metalness: 0.9,
        roughness: 0.08,
        clearcoat: 0.9,
        emissive: "#3B82F6",
        emissiveIntensity: 0.3,
        envMapIntensity: 2.0,
      }),
      // Silver Chrome Aerospace Fasteners
      silverBolt: new THREE.MeshPhysicalMaterial({
        color: "#F1F5F9",
        metalness: 0.98,
        roughness: 0.03,
        clearcoat: 1.0,
        envMapIntensity: 2.4,
      }),
      // Dimmed / De-emphasized Background Material for Focus Mode
      dimmedPart: new THREE.MeshPhysicalMaterial({
        color: "#1E293B",
        metalness: 0.2,
        roughness: 0.6,
        transparent: true,
        opacity: 0.28,
      }),
    };
  }, []);

  // Determine which component type is focused based on active chapter
  const focusedComponent = useMemo(() => {
    switch (activeChapterId) {
      case 2:
        return "airframe";
      case 3:
        return "motors";
      case 4:
        return "battery";
      case 5:
        return "flight_controller";
      case 6:
        return "gps";
      case 7:
        return "camera";
      case 8:
        return "lidar";
      case 9:
        return "spray";
      default:
        return "all"; // In Hero, Specs, Exploded, CTA -> all parts 100% active
    }
  }, [activeChapterId]);

  // Traverse and apply PBR materials with Selective Focus Highlighting
  useMemo(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();
        const isDimMode = focusedComponent !== "all";

        // 1. Motor Bell & Bullet Nuts
        if (name.includes("bullet") || name.includes("nut") || name.includes("cap")) {
          child.material = isDimMode && focusedComponent !== "motors" ? materials.dimmedPart : materials.chromeCap;
        } else if (name.includes("motor") || name.includes("stator")) {
          child.material = isDimMode && focusedComponent !== "motors" ? materials.dimmedPart : materials.motorRed;
        }
        // 2. Propeller Blades
        else if (name.includes("prop") || name.includes("rotor") || name.includes("blade")) {
          child.material = isDimMode && focusedComponent !== "motors" ? materials.dimmedPart : materials.propBlack;
        }
        // 3. Front White Arms & Rear Red Arms
        else if (name.includes("arm")) {
          const isFront = name.includes("front") || name.includes("1") || name.includes("2") || name.includes("fl") || name.includes("fr");
          if (isDimMode && focusedComponent !== "airframe") {
            child.material = materials.dimmedPart;
          } else {
            child.material = isFront ? materials.frontArmWhite : materials.rearArmRed;
          }
        }
        // 4. Graphene Battery & BMS Strap
        else if (name.includes("battery") || name.includes("pack") || name.includes("power")) {
          if (isDimMode && focusedComponent !== "battery") {
            child.material = materials.dimmedPart;
          } else {
            child.material = name.includes("strap") || name.includes("logo") ? materials.batteryCyanDecal : materials.batteryWhite;
          }
        }
        // 5. GPS Puck & Mast
        else if (name.includes("gps") || name.includes("puck") || name.includes("antenna")) {
          if (isDimMode && focusedComponent !== "gps") {
            child.material = materials.dimmedPart;
          } else {
            child.material = name.includes("ring") || name.includes("logo") ? materials.gpsRingLogo : materials.gpsDisc;
          }
        }
        // 6. LiDAR & 4K Vision Gimbal Camera
        else if (name.includes("lidar")) {
          child.material = isDimMode && focusedComponent !== "lidar" ? materials.dimmedPart : materials.lidarNeonBlue;
        } else if (name.includes("camera") || name.includes("lens") || name.includes("gimbal")) {
          if (isDimMode && focusedComponent !== "camera") {
            child.material = materials.dimmedPart;
          } else {
            child.material = name.includes("lens") ? materials.cameraLensCyan : materials.carbonChassis;
          }
        }
        // 7. Spray Tank
        else if (name.includes("tank") || name.includes("fluid") || name.includes("urea")) {
          child.material = isDimMode && focusedComponent !== "spray" ? materials.dimmedPart : materials.tankEmerald;
        }
        // 8. Screws & Bolts
        else if (name.includes("bolt") || name.includes("screw") || name.includes("fastener")) {
          child.material = isDimMode && focusedComponent !== "airframe" ? materials.dimmedPart : materials.silverBolt;
        }
        // 9. Carbon Fiber Main Frame Plates
        else if (!child.material || child.material.name === "" || name.includes("frame") || name.includes("plate") || name.includes("body")) {
          child.material = isDimMode && focusedComponent !== "airframe" ? materials.dimmedPart : materials.carbonChassis;
        }
      }
    });
  }, [scene, materials, focusedComponent]);

  useFrame((state, delta) => {
    if (!scene) return;

    // Mechanical spring/overshoot easing calculation for battery slide
    // p: 0 -> 0.8: slides out to 1.12 (overshoot); 0.8 -> 1.0: relaxes back to 1.0 (tactile lock)
    let tactileBatterySlide = batterySlide;
    if (batterySlide > 0.01) {
      if (batterySlide < 0.75) {
        tactileBatterySlide = (batterySlide / 0.75) * 1.12;
      } else {
        const easeReturn = (batterySlide - 0.75) / 0.25;
        tactileBatterySlide = 1.12 - easeReturn * 0.12;
      }
    }

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();

        // Propellers / Rotors spin with realistic acceleration
        if ((name.includes("prop") || name.includes("rotor")) && rotorSpeed > 0) {
          child.rotation.y += delta * rotorSpeed * 44;
        }

        // LiDAR spin
        if (name.includes("lidar") && lidarSpin > 0) {
          child.rotation.y += delta * (lidarSpin + 1) * 5;
        }

        // Battery slide animation with tactile mechanical lock
        if (name.includes("battery")) {
          child.position.z = tactileBatterySlide * 0.45;
        }

        // Flight Computer elevate
        if (name.includes("flight") || name.includes("pcb") || name.includes("avionics")) {
          child.position.y = flightComputerElevate * 0.55;
        }

        // Master Exploded View Separation (Only triggered during full exploded chapter)
        if (explodedProgress > 0) {
          if (name.includes("top") || name.includes("gps") || name.includes("lidar")) {
            child.position.y = explodedProgress * 0.65;
          } else if (name.includes("bottom") || name.includes("tank") || name.includes("gimbal")) {
            child.position.y = -explodedProgress * 0.65;
          } else if (name.includes("left")) {
            child.position.x = -explodedProgress * 0.85;
          } else if (name.includes("right")) {
            child.position.x = explodedProgress * 0.85;
          }
        }
      }
    });
  });

  return (
    <group ref={modelRef} scale={[4.5, 4.5, 4.5]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload GLB
try {
  useGLTF.preload("/models/Drone_FLUXX_Brand_V3.glb");
} catch {
  // Graceful preload fallback
}
