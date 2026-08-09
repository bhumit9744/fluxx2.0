"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function EarthGlobe() {
  const globeGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const satellitesRef = useRef<THREE.Group>(null);

  // Flight Network Connecting Arcs
  const networkArcs = useMemo(() => {
    const curves = [];
    // Key agricultural coordinates on sphere surface (Radius = 16)
    const hubs: [number, number, number][] = [
      [14, 4, 6], // Asia (India/China)
      [6, 12, 8], // Europe / Middle East
      [4, 2, 15], // Africa
      [-12, 6, 8], // North America
      [-10, -8, 10], // South America
      [12, -8, 6], // Australia
    ];

    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const v1 = new THREE.Vector3(...hubs[i]);
        const v2 = new THREE.Vector3(...hubs[j]);
        // Midpoint raised above sphere for realistic orbital arc
        const mid = v1.clone().add(v2).multiplyScalar(0.65);
        const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
        curves.push(curve.getPoints(30));
      }
    }
    return curves;
  }, []);

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.12;
    }
    if (satellitesRef.current) {
      satellitesRef.current.rotation.x += delta * 0.15;
      satellitesRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={[0, 16, 520]}>
      <group ref={globeGroupRef}>
        {/* 1. PLANETARY CRUST / OCEANS */}
        <mesh>
          <sphereGeometry args={[16, 48, 48]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* 2. CONTINENTS (Procedural Landmass Wire/Relief) */}
        <mesh>
          <sphereGeometry args={[16.08, 36, 36]} />
          <meshStandardMaterial
            color="#10B981"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* 3. ATMOSPHERIC CLOUD LAYER */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[16.3, 32, 32]} />
          <meshStandardMaterial
            color="#E2E8F0"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 4. GLOBAL FLIGHT NETWORK ARCS */}
        {networkArcs.map((pts, idx) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(pts);
          return (
            <primitive
              key={idx}
              object={
                new THREE.Line(
                  geometry,
                  new THREE.LineBasicMaterial({
                    color: "#00F0FF",
                    transparent: true,
                    opacity: 0.65,
                  })
                )
              }
            />
          );
        })}
      </group>

      {/* 5. ORBITING RTK & SENSOR SATELLITES */}
      <group ref={satellitesRef}>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <group key={i} position={[Math.cos(ang) * 22, Math.sin(ang) * 12, Math.sin(ang) * 22]}>
            {/* Satellite Body */}
            <mesh>
              <boxGeometry args={[0.6, 0.4, 0.4]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
            </mesh>
            {/* Solar Panels */}
            <mesh position={[1.0, 0, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.5]} />
              <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-1.0, 0, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.5]} />
              <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. ATMOSPHERIC RIM GLOW LIGHT */}
      <pointLight color="#00F0FF" intensity={12} distance={50} />
    </group>
  );
}
