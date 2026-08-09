"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { getProductState } from "@/lib/productTimeline";
import { CameraRig } from "@/animation/CameraRig";
import { DroneMaster } from "@/drone/DroneMaster";
import { DustParticles } from "@/drone/components/DustParticles";
import { EngineeringLines } from "@/drone/components/EngineeringLines";
import * as THREE from "three";

interface ProductCanvasProps {
  progress: number;
  isDark?: boolean;
}

export function ProductCanvas({ progress, isDark = false }: ProductCanvasProps) {
  const state = getProductState(progress);

  // Deep luxury keynote studio stage backdrop (Apple/DJI Product Reveal Studio)
  const bgColor = isDark ? "#060913" : "#E8EEF6";
  const gridColor = isDark ? "#1E293B" : "#CBD5E1";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      {/* Studio Radial Backdrop Glow (Apple Keynote Style) */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0, 184, 255, 0.08) 0%, rgba(6, 9, 19, 0.95) 70%, #03050a 100%)"
            : "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255, 255, 255, 0.9) 0%, rgba(232, 238, 246, 0.8) 70%, #d8e2ee 100%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0.35, 2.7], fov: 33 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isDark ? 1.35 : 1.45,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Deep Keynote Stage Volumetric Fog */}
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 6, 20]} />

        {/* Floating Studio Dust Particles */}
        <DustParticles count={100} isDark={isDark} />

        {/* Studio Procedural Environment Map for PBR Clearcoat Glints (Zero Network Requests) */}
        <Suspense fallback={null}>
          <Environment resolution={256} environmentIntensity={isDark ? 1.1 : 1.5}>
            {/* Key Softbox Panel */}
            <Lightformer
              form="rect"
              intensity={4}
              position={[5, 6, 4]}
              scale={[10, 5, 1]}
              target={[0, 0, 0]}
              color="#FFF5EA"
            />
            {/* Cool Fill Strip */}
            <Lightformer
              form="rect"
              intensity={2.5}
              position={[-6, 4, 3]}
              scale={[8, 3, 1]}
              target={[0, 0, 0]}
              color="#38BDF8"
            />
            {/* Emerald Rim Accent */}
            <Lightformer
              form="ring"
              intensity={3.5}
              position={[-4, 5, -5]}
              scale={5}
              target={[0, 0, 0]}
              color="#00E7B3"
            />
            {/* Top Soft Overhead Studio Glare */}
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[0, 8, 0]}
              scale={[12, 12, 1]}
              rotation={[-Math.PI / 2, 0, 0]}
              color="#FFFFFF"
            />
            {/* Subtle Floor Bounce Accent */}
            <Lightformer
              form="rect"
              intensity={1.2}
              position={[0, -4, 2]}
              scale={[6, 6, 1]}
              rotation={[Math.PI / 2, 0, 0]}
              color="#1E293B"
            />
          </Environment>
        </Suspense>

        {/* ========================================================================= */}
        {/* THREE-POINT AEROSPACE STUDIO LIGHTING RIG (WARM KEY, COOL FILL, MINT RIM) */}
        {/* ========================================================================= */}
        {/* 1. Ambient Baseline */}
        <ambientLight intensity={isDark ? 0.9 : 1.3} />

        {/* 2. Key Light: Warm Studio Softbox (Golden Warmth on Body Curves) */}
        <directionalLight
          position={[5.5, 8.5, 5.0]}
          intensity={isDark ? 4.5 : 4.8}
          color="#FFF2E2"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* 3. Fill Light: Cool Sky Blue (Illuminates Shadows with High-Tech Contrast) */}
        <directionalLight
          position={[-6.0, 4.0, 3.5]}
          intensity={isDark ? 2.6 : 2.8}
          color="#38BDF8"
        />

        {/* 4. Rim Light: Sharp Emerald / Mint (Carves Crisp Aerospace Silhouette) */}
        <directionalLight
          position={[-4.5, 4.5, -5.5]}
          intensity={isDark ? 4.2 : 3.6}
          color="#00E7B3"
        />

        {/* 5. Undercarriage Floor Bounce (Highlights Gimbal & Spray Tank Bottom) */}
        <directionalLight
          position={[0, -4, 2.5]}
          intensity={isDark ? 1.4 : 1.2}
          color="#1E293B"
        />

        {/* Minimal Studio Floor with Blurred Contact Shadows & Blueprint Rings */}
        <group position={[0, -0.68, 0]}>
          <ContactShadows
            opacity={isDark ? 0.8 : 0.55}
            scale={10}
            blur={2.4}
            far={4}
            resolution={1024}
            color={isDark ? "#000000" : "#1E293B"}
          />
          {/* Blueprint Turntable Subtle Floor Rings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <ringGeometry args={[1.4, 1.412, 64]} />
            <meshBasicMaterial color={gridColor} transparent opacity={0.45} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <ringGeometry args={[2.4, 2.412, 64]} />
            <meshBasicMaterial color={gridColor} transparent opacity={0.25} />
          </mesh>
        </group>

        {/* Cinematographer Camera Rig with Bezier Easing and Pauses */}
        <CameraRig
          targetPos={state.cameraPos}
          targetLookAt={state.lookAt}
        />

        {/* 3D Apple-Style Engineering Leader Lines */}
        <EngineeringLines
          chapterId={state.chapter.id}
          batterySlide={state.batterySlide}
          flightComputerElevate={state.flightComputerElevate}
          isDark={isDark}
        />

        {/* Centered Hero Drone */}
        <group
          position={[state.dronePos.x, state.dronePos.y, state.dronePos.z]}
          rotation={[state.droneRot.x, state.droneRot.y, state.droneRot.z]}
        >
          <DroneMaster
            activeChapterId={state.chapter.id}
            tiltAngle={state.tiltAngle}
            rotorSpeed={state.rotorSpeed}
            batterySlide={state.batterySlide}
            flightComputerElevate={state.flightComputerElevate}
            cameraPitch={state.cameraPitch}
            lidarSpin={state.lidarSpin}
            tankTransparency={state.tankTransparency}
            sprayActive={state.sprayActive}
            explodedProgress={state.explodedProgress}
            powerFlowActive={state.powerFlowActive}
            hologramActive={state.hologramActive}
            dimensionLinesActive={state.dimensionLinesActive}
            wingsFolded={state.wingsFolded}
            isDark={isDark}
          />
        </group>
      </Canvas>
    </div>
  );
}
