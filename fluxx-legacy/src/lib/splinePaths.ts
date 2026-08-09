import * as THREE from "three";

export interface TrajectoryPoint {
  progress: number;
  cameraPos: THREE.Vector3;
  cameraLookAt: THREE.Vector3;
  dronePos: THREE.Vector3;
  droneRot: THREE.Euler;
  tiltAngle: number; // 0 = forward cruise, PI/2 = vertical hover
  rotorSpeed: number; // 0 to 1
  explodedProgress: number; // 0 to 1 (active in scene 9)
  sprayActive: boolean;
  scanActive: boolean;
}

// Master waypoints for the 17 scenes
export const KEY_WAYPOINTS: {
  progress: number;
  camera: [number, number, number];
  lookAt: [number, number, number];
  drone: [number, number, number];
  rot: [number, number, number]; // pitch, yaw, roll in radians
  tilt: number;
  rotorSpeed: number;
  exploded: number;
  spray: boolean;
  scan: boolean;
}[] = [
  // 01: Loading
  {
    progress: 0.0,
    camera: [0, 1.2, 5.5],
    lookAt: [0, 0.5, 0],
    drone: [0, 0.4, 0],
    rot: [0, 0, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 02: Hangar Intro
  {
    progress: 0.06,
    camera: [3.8, 1.6, 4.2],
    lookAt: [0, 0.6, 0],
    drone: [0, 0.4, 0],
    rot: [0, -0.3, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.1,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 03: Drone Startup
  {
    progress: 0.12,
    camera: [-2.8, 1.2, 3.5],
    lookAt: [0, 0.7, 0],
    drone: [0, 0.5, 0],
    rot: [0, 0.2, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.6,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 04: Takeoff
  {
    progress: 0.18,
    camera: [0, -1.0, 4.5],
    lookAt: [0, 4.5, 0],
    drone: [0, 4.2, 0],
    rot: [-0.05, 0, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 1.0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 05: Transition Out
  {
    progress: 0.24,
    camera: [0, 5.5, -12],
    lookAt: [0, 6.0, 15],
    drone: [0, 6.0, 8],
    rot: [0.1, Math.PI, 0],
    tilt: Math.PI / 3,
    rotorSpeed: 1.0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 06: Open World
  {
    progress: 0.30,
    camera: [-6, 12, 28],
    lookAt: [0, 10, 50],
    drone: [0, 11, 45],
    rot: [0.05, 0, -0.15],
    tilt: 0.2,
    rotorSpeed: 1.0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 07: Problem
  {
    progress: 0.36,
    camera: [5, 9, 70],
    lookAt: [0, 5, 90],
    drone: [0, 7, 85],
    rot: [0.15, 0, 0.1],
    tilt: 0.6,
    rotorSpeed: 0.8,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 08: Factory
  {
    progress: 0.42,
    camera: [-4, 6, 120],
    lookAt: [0, 5, 135],
    drone: [0, 5, 132],
    rot: [0, 0.4, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.5,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 09: Exploded Drone View
  {
    progress: 0.50,
    camera: [0, 6, 168],
    lookAt: [0, 5, 175],
    drone: [0, 5, 175],
    rot: [0.1, 0.5, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.1,
    exploded: 1.0,
    spray: false,
    scan: false,
  },
  // 10: Mission Cruise
  {
    progress: 0.57,
    camera: [4, 9, 210],
    lookAt: [0, 8, 240],
    drone: [0, 8, 235],
    rot: [0.08, 0, -0.2],
    tilt: 0,
    rotorSpeed: 1.0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 11: AI Scan
  {
    progress: 0.64,
    camera: [0, 7.5, 275],
    lookAt: [0, 3, 295],
    drone: [0, 6, 290],
    rot: [0.2, 0, 0],
    tilt: 0.4,
    rotorSpeed: 0.9,
    exploded: 0,
    spray: false,
    scan: true,
  },
  // 12: Precision Spray
  {
    progress: 0.71,
    camera: [-5, 4.5, 330],
    lookAt: [0, 3.5, 350],
    drone: [0, 3.5, 345],
    rot: [-0.05, 0, 0.05],
    tilt: 0.5,
    rotorSpeed: 0.95,
    exploded: 0,
    spray: true,
    scan: false,
  },
  // 13: Analytics
  {
    progress: 0.78,
    camera: [0, 10, 385],
    lookAt: [0, 8, 400],
    drone: [0, 8, 400],
    rot: [0, -0.4, 0],
    tilt: 0.3,
    rotorSpeed: 0.8,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 14: Earth Global Vision
  {
    progress: 0.84,
    camera: [0, 30, 460],
    lookAt: [0, 20, 520],
    drone: [0, 22, 500],
    rot: [-0.2, 0, 0],
    tilt: 0,
    rotorSpeed: 1.0,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 15: Roadmap
  {
    progress: 0.90,
    camera: [-8, 14, 570],
    lookAt: [0, 12, 600],
    drone: [0, 12, 595],
    rot: [0.05, 0.2, 0],
    tilt: 0.4,
    rotorSpeed: 0.7,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 16: Team Command Center
  {
    progress: 0.95,
    camera: [6, 7, 640],
    lookAt: [0, 5, 660],
    drone: [0, 4.5, 658],
    rot: [0, -0.3, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.4,
    exploded: 0,
    spray: false,
    scan: false,
  },
  // 17: Sunset Landing
  {
    progress: 1.0,
    camera: [0, 2.5, 700],
    lookAt: [0, 1.2, 715],
    drone: [0, 0.8, 715],
    rot: [0, 0, 0],
    tilt: Math.PI / 2,
    rotorSpeed: 0.05,
    exploded: 0,
    spray: false,
    scan: false,
  },
];

export function getInterpolatedTrajectory(p: number): TrajectoryPoint {
  const clamped = Math.max(0, Math.min(1, p));

  // Find waypoint segment
  let idx = 0;
  for (let i = 0; i < KEY_WAYPOINTS.length - 1; i++) {
    if (clamped >= KEY_WAYPOINTS[i].progress && clamped <= KEY_WAYPOINTS[i + 1].progress) {
      idx = i;
      break;
    }
  }

  const p0 = KEY_WAYPOINTS[idx];
  const p1 = KEY_WAYPOINTS[Math.min(idx + 1, KEY_WAYPOINTS.length - 1)];

  const segmentRange = p1.progress - p0.progress;
  const tRaw = segmentRange > 0 ? (clamped - p0.progress) / segmentRange : 0;
  // Smoothstep easing for cinematic motion
  const t = tRaw * tRaw * (3 - 2 * tRaw);

  const cameraPos = new THREE.Vector3(
    THREE.MathUtils.lerp(p0.camera[0], p1.camera[0], t),
    THREE.MathUtils.lerp(p0.camera[1], p1.camera[1], t),
    THREE.MathUtils.lerp(p0.camera[2], p1.camera[2], t)
  );

  const cameraLookAt = new THREE.Vector3(
    THREE.MathUtils.lerp(p0.lookAt[0], p1.lookAt[0], t),
    THREE.MathUtils.lerp(p0.lookAt[1], p1.lookAt[1], t),
    THREE.MathUtils.lerp(p0.lookAt[2], p1.lookAt[2], t)
  );

  const dronePos = new THREE.Vector3(
    THREE.MathUtils.lerp(p0.drone[0], p1.drone[0], t),
    THREE.MathUtils.lerp(p0.drone[1], p1.drone[1], t),
    THREE.MathUtils.lerp(p0.drone[2], p1.drone[2], t)
  );

  const droneRot = new THREE.Euler(
    THREE.MathUtils.lerp(p0.rot[0], p1.rot[0], t),
    THREE.MathUtils.lerp(p0.rot[1], p1.rot[1], t),
    THREE.MathUtils.lerp(p0.rot[2], p1.rot[2], t)
  );

  const tiltAngle = THREE.MathUtils.lerp(p0.tilt, p1.tilt, t);
  const rotorSpeed = THREE.MathUtils.lerp(p0.rotorSpeed, p1.rotorSpeed, t);
  const explodedProgress = THREE.MathUtils.lerp(p0.exploded, p1.exploded, t);
  const sprayActive = t > 0.5 ? p1.spray : p0.spray;
  const scanActive = t > 0.5 ? p1.scan : p0.scan;

  return {
    progress: clamped,
    cameraPos,
    cameraLookAt,
    dronePos,
    droneRot,
    tiltAngle,
    rotorSpeed,
    explodedProgress,
    sprayActive,
    scanActive,
  };
}
