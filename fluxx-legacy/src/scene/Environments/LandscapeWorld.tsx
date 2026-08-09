"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LandscapeWorldProps {
  isDark?: boolean;
}

export function LandscapeWorld({ isDark = false }: LandscapeWorldProps) {
  const turbineRotor1 = useRef<THREE.Group>(null);
  const turbineRotor2 = useRef<THREE.Group>(null);
  const turbineRotor3 = useRef<THREE.Group>(null);
  const riverRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  // Animate wind turbine rotors and subtle river flow
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (turbineRotor1.current) turbineRotor1.current.rotation.z += delta * 1.5;
    if (turbineRotor2.current) turbineRotor2.current.rotation.z += delta * 1.8;
    if (turbineRotor3.current) turbineRotor3.current.rotation.z += delta * 1.3;

    // Slow drifting clouds
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(t * 0.05) * 8;
    }
  });

  // 1. Procedural Contoured Terrain Heightmap Mesh
  const { terrainGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(320, 780, 80, 160);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // This corresponds to Z in world space before rotation

      // Compute natural rolling landscape elevation
      const hillNoise1 = Math.sin(x * 0.02) * Math.cos(y * 0.015) * 5.5;
      const hillNoise2 = Math.sin(x * 0.06 + y * 0.04) * 2.0;
      const mountainSide = Math.abs(x) > 50 ? Math.pow((Math.abs(x) - 50) * 0.15, 1.8) : 0;

      // River depression carving
      const riverCenterX = Math.sin(y * 0.02) * 16 - 10;
      const distToRiver = Math.abs(x - riverCenterX);
      const riverDepth = distToRiver < 18 ? -Math.cos((distToRiver / 18) * (Math.PI / 2)) * 3.5 : 0;

      const zHeight = hillNoise1 + hillNoise2 + mountainSide + riverDepth;
      pos.setZ(i, zHeight);
    }
    geo.computeVertexNormals();
    return { terrainGeometry: geo };
  }, []);

  // 2. Procedural Realistic Trees (Pines & Deciduous)
  const trees = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      scale: number;
      type: "pine" | "deciduous";
      rot: number;
    }> = [];

    // Scatter trees along hillsides, forest clusters, and field boundaries
    for (let i = 0; i < 140; i++) {
      const x = (Math.sin(i * 99) * 130);
      const z = 25 + ((i * 17) % 320);

      // Avoid blocking factory area & main runway corridor
      if (Math.abs(x) < 10 && z < 170) continue;
      if (Math.abs(x) < 16 && z > 110 && z < 160) continue;

      const y = Math.sin(x * 0.02) * Math.cos(z * 0.015) * 4.5 + (Math.abs(x) > 50 ? 4 : 0);
      const scale = 0.7 + (Math.sin(i * 33) * 0.3 + 0.3);
      const type = i % 3 === 0 ? "deciduous" : "pine";
      list.push({ pos: [x, Math.max(0, y), z], scale, type, rot: (i * 45 * Math.PI) / 180 });
    }
    return list;
  }, []);

  // 3. Realistic Agricultural Crop Fields with Furrows
  const cropFields = useMemo(() => {
    const fields = [];
    const colorsLight = [
      "#15803D", // Lush Emerald Grass
      "#16A34A", // Vibrant Crop Green
      "#22C55E", // Bright Fresh Shoots
      "#EAB308", // Golden Ripe Wheat
      "#CA8A04", // Amber Harvest
      "#65A30D", // Lime Rice Terrace
    ];
    const colorsDark = ["#044327", "#064E3B", "#022C22", "#065F46", "#047857"];
    const palette = isDark ? colorsDark : colorsLight;

    for (let x = -65; x <= 65; x += 22) {
      for (let z = 24; z <= 260; z += 26) {
        if (Math.abs(x) < 14 && z < 165) continue;
        const color = palette[Math.floor(Math.abs(Math.sin(x * 12 + z * 7)) * palette.length)];
        const elev = Math.sin(x * 0.02) * Math.cos(z * 0.015) * 4.2 + 0.2;
        fields.push({
          pos: [x, Math.max(0.1, elev), z] as [number, number, number],
          size: [19, 0.25, 23] as [number, number, number],
          color,
          furrowCount: 6,
        });
      }
    }
    return fields;
  }, [isDark]);

  // 4. Volumetric Cumulus Clouds
  const clouds = useMemo(() => {
    const cloudClusters = [];
    for (let i = 0; i < 14; i++) {
      const x = Math.sin(i * 47) * 140;
      const z = 40 + i * 22;
      const y = 35 + Math.cos(i * 19) * 8;
      const scale = 1.2 + (i % 3) * 0.5;
      cloudClusters.push({ pos: [x, y, z] as [number, number, number], scale });
    }
    return cloudClusters;
  }, []);

  // Theme palettes
  const groundBaseColor = isDark ? "#061A12" : "#86EFAC";
  const terrainMaterialColor = isDark ? "#082319" : "#4ADE80";
  const riverColor = isDark ? "#0369A1" : "#0284C7";
  const mountainPeakColor = isDark ? "#1E293B" : "#CBD5E1";
  const snowCapColor = "#FFFFFF";
  const turbineColor = isDark ? "#E2E8F0" : "#FFFFFF";
  const treeFoliagePine = isDark ? "#064E3B" : "#14532D";
  const treeFoliageDeciduous = isDark ? "#047857" : "#15803D";
  const treeTrunkColor = "#78350F";

  return (
    <group>
      {/* 1. PHOTOREALISTIC CONTOURED HEIGHTMAP TERRAIN */}
      <mesh
        geometry={terrainGeometry}
        position={[0, 0, 360]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={terrainMaterialColor}
          roughness={0.8}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>

      {/* 2. BASE EXTENDED HORIZON BED */}
      <mesh position={[0, -1.5, 360]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[700, 1100]} />
        <meshStandardMaterial color={groundBaseColor} roughness={0.9} />
      </mesh>

      {/* 3. VIBRANT AGRICULTURAL CROP FIELDS WITH 3D FURROWS */}
      <group>
        {cropFields.map((field, i) => (
          <group key={i} position={field.pos}>
            {/* Field Plot Surface */}
            <mesh receiveShadow castShadow>
              <boxGeometry args={field.size} />
              <meshStandardMaterial color={field.color} roughness={0.7} />
            </mesh>
            {/* 3D Furrows / Crop Rows */}
            {[-6, -3, 0, 3, 6].map((offset, rowIdx) => (
              <mesh key={rowIdx} position={[offset, 0.18, 0]}>
                <boxGeometry args={[1.2, 0.15, field.size[2] * 0.92]} />
                <meshStandardMaterial
                  color={isDark ? "#022C22" : "#166534"}
                  roughness={0.6}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 4. REALISTIC WINDING RIVER WITH DEPTH & SPECULAR SHINE */}
      <mesh
        ref={riverRef}
        position={[-8, -0.4, 150]}
        rotation={[-Math.PI / 2, 0, 0.07]}
        receiveShadow
      >
        <planeGeometry args={[18, 300]} />
        <meshStandardMaterial
          color={riverColor}
          roughness={0.1}
          metalness={0.85}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 5. PROCEDURAL 3D TREE GROVES */}
      <group>
        {trees.map((tree, i) => (
          <group
            key={i}
            position={tree.pos}
            scale={[tree.scale, tree.scale, tree.scale]}
            rotation={[0, tree.rot, 0]}
          >
            {/* Trunk */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.35, 2.4, 8]} />
              <meshStandardMaterial color={treeTrunkColor} roughness={0.9} />
            </mesh>

            {tree.type === "pine" ? (
              /* Layered Pine Canopy */
              <group position={[0, 2.2, 0]}>
                <mesh position={[0, 0, 0]} castShadow>
                  <coneGeometry args={[1.6, 2.2, 7]} />
                  <meshStandardMaterial color={treeFoliagePine} roughness={0.7} />
                </mesh>
                <mesh position={[0, 1.2, 0]} castShadow>
                  <coneGeometry args={[1.3, 1.8, 7]} />
                  <meshStandardMaterial color={treeFoliagePine} roughness={0.7} />
                </mesh>
                <mesh position={[0, 2.2, 0]} castShadow>
                  <coneGeometry args={[0.9, 1.4, 7]} />
                  <meshStandardMaterial color={treeFoliagePine} roughness={0.7} />
                </mesh>
              </group>
            ) : (
              /* Deciduous Leafy Canopy Cloud */
              <group position={[0, 2.8, 0]}>
                <mesh position={[0, 0, 0]} castShadow>
                  <sphereGeometry args={[1.4, 8, 8]} />
                  <meshStandardMaterial color={treeFoliageDeciduous} roughness={0.6} />
                </mesh>
                <mesh position={[0.6, 0.4, 0.4]} castShadow>
                  <sphereGeometry args={[0.9, 8, 8]} />
                  <meshStandardMaterial color={treeFoliageDeciduous} roughness={0.6} />
                </mesh>
                <mesh position={[-0.5, 0.3, -0.4]} castShadow>
                  <sphereGeometry args={[1.0, 8, 8]} />
                  <meshStandardMaterial color={treeFoliageDeciduous} roughness={0.6} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* 6. RURAL FARMSTEAD ARCHITECTURE & GRAIN SILOS */}
      {/* Farmstead 1 (Left Valley) */}
      <group position={[-36, 1.2, 75]}>
        {/* Red Barn Main Body */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 5, 10]} />
          <meshStandardMaterial color="#B91C1C" roughness={0.6} />
        </mesh>
        {/* Barn Gambrel Roof */}
        <mesh position={[0, 5.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[5.4, 5.4, 10.4]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
        </mesh>
        {/* Metal Grain Silo */}
        <group position={[5.5, 0, 2]}>
          <mesh position={[0, 4.5, 0]} castShadow>
            <cylinderGeometry args={[1.4, 1.4, 9, 16]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 9.4, 0]} castShadow>
            <sphereGeometry args={[1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Farmstead 2 (Right Ridge) */}
      <group position={[48, 2.5, 140]}>
        {/* Modern Agricultural Depot */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 4, 8]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Solar Panel Rooftop Array */}
        <mesh position={[0, 4.1, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[11.2, 0.1, 7.2]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* 7. HIGH-PRECISION WIND TURBINES */}
      {/* Turbine 1 */}
      <group position={[-42, 2.5, 60]}>
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.8, 24, 16]} />
          <meshStandardMaterial color={turbineColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[0, 24, 0]}>
          <mesh position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color={turbineColor} metalness={0.8} />
          </mesh>
          <group ref={turbineRotor1} position={[0, 0, 0.8]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
              <mesh key={i} rotation={[0, 0, ang]} position={[0, 4.5, 0]} castShadow>
                <boxGeometry args={[0.4, 9.2, 0.06]} />
                <meshStandardMaterial color={turbineColor} metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Turbine 2 */}
      <group position={[52, 4.0, 110]}>
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.8, 24, 16]} />
          <meshStandardMaterial color={turbineColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[0, 24, 0]}>
          <mesh position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color={turbineColor} metalness={0.8} />
          </mesh>
          <group ref={turbineRotor2} position={[0, 0, 0.8]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
              <mesh key={i} rotation={[0, 0, ang]} position={[0, 4.5, 0]} castShadow>
                <boxGeometry args={[0.4, 9.2, 0.06]} />
                <meshStandardMaterial color={turbineColor} metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Turbine 3 */}
      <group position={[-55, 3.0, 210]}>
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.8, 24, 16]} />
          <meshStandardMaterial color={turbineColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <group position={[0, 24, 0]}>
          <mesh position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color={turbineColor} metalness={0.8} />
          </mesh>
          <group ref={turbineRotor3} position={[0, 0, 0.8]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
              <mesh key={i} rotation={[0, 0, ang]} position={[0, 4.5, 0]} castShadow>
                <boxGeometry args={[0.4, 9.2, 0.06]} />
                <meshStandardMaterial color={turbineColor} metalness={0.7} roughness={0.2} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* 8. MAJESTIC MOUNTAIN RANGE WITH REALISTIC SNOW PEAKS */}
      <group position={[0, 0, 310]}>
        {[-130, -75, 0, 75, 130].map((x, i) => {
          const height = 48 + Math.abs(Math.sin(i * 13)) * 26;
          const radius = 38 + Math.abs(Math.cos(i * 7)) * 18;
          return (
            <group key={i} position={[x, height / 2 - 2, 0]}>
              {/* Mountain Base */}
              <mesh receiveShadow>
                <coneGeometry args={[radius, height, 7]} />
                <meshStandardMaterial
                  color={mountainPeakColor}
                  roughness={0.85}
                  flatShading
                />
              </mesh>
              {/* Snow Peak Cap */}
              <mesh position={[0, height * 0.32, 0]}>
                <coneGeometry args={[radius * 0.36, height * 0.36, 7]} />
                <meshStandardMaterial
                  color={snowCapColor}
                  roughness={0.3}
                  metalness={0.2}
                  flatShading
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 9. VOLUMETRIC CUMULUS CLOUDS */}
      <group ref={cloudsRef}>
        {clouds.map((c, i) => (
          <group key={i} position={c.pos} scale={[c.scale, c.scale, c.scale]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[4.5, 8, 8]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.88}
                roughness={1}
              />
            </mesh>
            <mesh position={[2.8, -0.4, 0]}>
              <sphereGeometry args={[3.2, 8, 8]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
            <mesh position={[-2.6, -0.3, 0.4]}>
              <sphereGeometry args={[3.0, 8, 8]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
            </mesh>
            <mesh position={[0.5, 1.4, -0.3]}>
              <sphereGeometry args={[2.8, 8, 8]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
