import * as THREE from "three";

export interface ProductChapter {
  id: number;
  key: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  scrollRange: [number, number];
  specs?: { label: string; value: string; unit?: string }[];
  badge?: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  dronePos: [number, number, number];
  droneRot: [number, number, number];
  tiltAngle: number; // 0 is vertical hover, Math.PI/2 is forward cruise
  rotorSpeed: number;
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
}

export const PRODUCT_CHAPTERS: ProductChapter[] = [
  // 01. Hero
  {
    id: 1,
    key: "hero",
    tagline: "THE FUTURE OF AUTONOMOUS AEROSPACE",
    headline: "FLUXX",
    subheadline: "Autonomous VTOL Platform",
    description: "An uncompromising fusion of aerospace precision, AI edge computing, and electrostatic bio-agronomy.",
    scrollRange: [0.0, 0.07],
    cameraPos: [0, 0.35, 2.7],
    lookAt: [0, 0, 0],
    dronePos: [0, 0, 0],
    droneRot: [0.1, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0.4,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.2,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 02. Carbon Fiber Airframe (Highlight: White)
  {
    id: 2,
    key: "airframe",
    tagline: "01. CARBON FIBER AIRFRAME",
    headline: "T1000 Monocoque Shell",
    subheadline: "Reinforced frame & aerodynamic design.",
    description: "Autoclave-cured carbon shell delivers 400% higher torsional rigidity than aluminum while preserving a transparent chassis glow.",
    scrollRange: [0.07, 0.14],
    specs: [
      { label: "Tensile Strength", value: "4,900", unit: "MPa" },
      { label: "Airframe Weight", value: "8.4", unit: "kg" },
      { label: "Impact Factor", value: "12", unit: "G" },
    ],
    cameraPos: [-1.2, 0.5, 3.2],
    lookAt: [-0.1, 0.05, 0],
    dronePos: [0.1, 0, 0],
    droneRot: [0.2, -0.5, 0.1],
    tiltAngle: 0,
    rotorSpeed: 0.3,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.3,
    tankTransparency: 0.5, // Shell reveals internal chassis
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 03. Propulsion System (Highlight: Emerald Green)
  {
    id: 3,
    key: "motors",
    tagline: "02. PROPULSION SYSTEM",
    headline: "4× Vector Brushless Motors",
    subheadline: "Carbon fiber propellers & ESC active cooling.",
    description: "Custom neodymium motors with sine-wave ESC cooling produce immediate static thrust and whisper-quiet flight acoustics.",
    scrollRange: [0.14, 0.21],
    specs: [
      { label: "Peak Power", value: "8,800", unit: "W" },
      { label: "Max Static Thrust", value: "96", unit: "kg" },
      { label: "ESC Response", value: "12", unit: "μs" },
    ],
    cameraPos: [1.9, 0.6, 2.4],
    lookAt: [1.0, 0.1, 0],
    dronePos: [-0.4, 0, 0],
    droneRot: [-0.1, 0.6, 0],
    tiltAngle: 0.3,
    rotorSpeed: 0.95, // Propellers accelerate
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.4,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 04. Power System (Highlight: Electric Blue)
  {
    id: 4,
    key: "battery",
    tagline: "03. POWER SYSTEM",
    headline: "96V Graphene Battery Pack",
    subheadline: "Smart BMS & Power Distribution Board.",
    description: "Solid-state graphene cell chemistry with 60-second hot-swap capability and active thermal dissipation loops.",
    scrollRange: [0.21, 0.28],
    specs: [
      { label: "Voltage", value: "96.4", unit: "V" },
      { label: "Energy Density", value: "340", unit: "Wh/kg" },
      { label: "Swap Duration", value: "45", unit: "sec" },
    ],
    cameraPos: [0, 1.4, 3.2],
    lookAt: [0, 0.2, 0.2],
    dronePos: [0, -0.1, 0],
    droneRot: [0.4, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0.2,
    batterySlide: 1.0, // Battery slides out & blue energy flows
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.2,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 05. VTOL Flight Controller (Highlight: Purple)
  {
    id: 5,
    key: "flight_controller",
    tagline: "04. VTOL FLIGHT CONTROLLER",
    headline: "Triple-Redundant Flight Computer",
    subheadline: "Dual IMU & fail-safe stabilization core.",
    description: "PCB elevates to project high-speed digital circuit data pulses, maintaining continuous flight envelope integrity.",
    scrollRange: [0.28, 0.35],
    specs: [
      { label: "AI Compute", value: "275", unit: "TOPS" },
      { label: "Sampling Rate", value: "2,000", unit: "Hz" },
      { label: "IMU Layers", value: "3×", unit: "isolated" },
    ],
    cameraPos: [0, 1.6, 2.6],
    lookAt: [0, 0.3, 0],
    dronePos: [0, -0.2, 0],
    droneRot: [0.45, 0.2, 0],
    tiltAngle: 0,
    rotorSpeed: 0.25,
    batterySlide: 0,
    flightComputerElevate: 1.0, // PCB Rises & circuit pulses
    cameraPitch: 0,
    lidarSpin: 0.3,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: true,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 06. Navigation Suite (Highlight: Cyan)
  {
    id: 6,
    key: "navigation",
    tagline: "05. NAVIGATION SUITE",
    headline: "RTK GNSS & Dual Compass",
    subheadline: "Centimeter-level positioning & barometer locking.",
    description: "Multiband satellite tracking locks position to ±1.2 cm accuracy across harsh electromagnetic environments.",
    scrollRange: [0.35, 0.42],
    specs: [
      { label: "RTK Accuracy", value: "±1.2", unit: "cm" },
      { label: "Sat Constellations", value: "4", unit: "GPS/GAL" },
      { label: "Fix Latency", value: "< 100", unit: "ms" },
    ],
    cameraPos: [0.8, 1.3, 2.6],
    lookAt: [0, 0.4, 0.2],
    dronePos: [0, -0.1, 0],
    droneRot: [0.3, -0.4, 0],
    tiltAngle: 0,
    rotorSpeed: 0.35,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 1.5,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 07. AI Vision System (Highlight: Orange)
  {
    id: 7,
    key: "ai_vision",
    tagline: "06. AI VISION SYSTEM",
    headline: "Multispectral 4K Vision Gimbal",
    subheadline: "RGB, Thermal FLIR & NDVI leaf scanning.",
    description: "Quad-band optical sensors switch dynamically between RGB, Thermal, and NDVI spectrums to pinpoint crop stress.",
    scrollRange: [0.42, 0.49],
    specs: [
      { label: "Sensor Resolution", value: "48", unit: "MP" },
      { label: "Spectral Channels", value: "5", unit: "Bands" },
      { label: "Gimbal Precision", value: "±0.005", unit: "deg" },
    ],
    cameraPos: [0, -0.2, 2.4],
    lookAt: [0, -0.2, 0.8],
    dronePos: [0, 0.2, 0],
    droneRot: [-0.3, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0.3,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: -0.6,
    lidarSpin: 0.3,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 08. LiDAR Module (Highlight: Neon Blue)
  {
    id: 8,
    key: "lidar",
    tagline: "07. LIDAR MODULE",
    headline: "360° Solid-State LiDAR",
    subheadline: "Obstacle detection & 3D terrain mapping.",
    description: "Emits 480,000 laser pulses per second to generate real-time wireframe point clouds and avoid power lines or trees.",
    scrollRange: [0.49, 0.56],
    specs: [
      { label: "Pulse Frequency", value: "480k", unit: "pts/s" },
      { label: "Scanning Range", value: "300", unit: "m" },
      { label: "FOV Coverage", value: "360°×90°", unit: "" },
    ],
    cameraPos: [0.7, 1.2, 2.8],
    lookAt: [0, 0.3, 0],
    dronePos: [0, -0.1, 0],
    droneRot: [0.25, -0.5, 0],
    tiltAngle: 0,
    rotorSpeed: 0.35,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 2.8, // Laser scan & point cloud
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 09. Spray Module (Highlight: Green)
  {
    id: 9,
    key: "spray_system",
    tagline: "08. SPRAY MODULE",
    headline: "Nano-Urea Liquid Spray System",
    subheadline: "Pressurized tank & electrostatic nozzles.",
    description: "Translucent baffled tank feeds micro-atomizers that electrostatically charge 30μm droplets to wrap foliage surfaces.",
    scrollRange: [0.56, 0.63],
    specs: [
      { label: "Tank Volume", value: "12.0", unit: "L" },
      { label: "Droplet Size", value: "30", unit: "μm" },
      { label: "Coverage Speed", value: "18", unit: "ha/hr" },
    ],
    cameraPos: [0, -0.7, 3.0],
    lookAt: [0, -0.3, 0],
    dronePos: [0, 0.3, 0],
    droneRot: [-0.2, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0.65,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.2,
    tankTransparency: 0.95, // Translucent tank & fluid movement
    sprayActive: true, // Fine mist particles
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 10. Communication System (Highlight: Sky Blue)
  {
    id: 10,
    key: "communication",
    tagline: "09. COMMUNICATION SYSTEM",
    headline: "5G & LoRa Swarm Telemetry",
    subheadline: "Ground station link & encrypted cloud sync.",
    description: "Ultra-low latency dual-link radio maintains 15 km direct line-of-sight command streams and instant cloud analytics.",
    scrollRange: [0.63, 0.70],
    specs: [
      { label: "Radio Range", value: "15", unit: "km" },
      { label: "Data Rate", value: "1.2", unit: "Gbps" },
      { label: "Encryption", value: "AES-256", unit: "" },
    ],
    cameraPos: [1.4, 1.2, 3.8],
    lookAt: [0, 0.1, 0],
    dronePos: [0, 0, 0],
    droneRot: [0.15, 0.5, 0],
    tiltAngle: 0,
    rotorSpeed: 0.4,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.3,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: true,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 11. Autonomous AI System (Highlight: Violet)
  {
    id: 11,
    key: "autonomous_ai",
    tagline: "10. AUTONOMOUS AI",
    headline: "Swarm Mission Intelligence",
    subheadline: "Path optimization & real-time crop detection.",
    description: "Projected holographic mission disk maps target crops and dynamically recalculates flight paths to eliminate skip zones.",
    scrollRange: [0.70, 0.77],
    specs: [
      { label: "Autonomy Level", value: "Level 5", unit: "full" },
      { label: "Target Detection", value: "99.4", unit: "%" },
      { label: "Yield Uplift", value: "+28", unit: "%" },
    ],
    cameraPos: [0, 1.8, 4.8],
    lookAt: [0, -0.4, 0],
    dronePos: [0, 0.4, 0],
    droneRot: [0.25, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0.6,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: -0.5,
    lidarSpin: 0.8,
    tankTransparency: 0.2,
    sprayActive: true,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: true, // Projected hologram mission disk
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 12. Engineering Specifications (Highlight: White)
  {
    id: 12,
    key: "specifications",
    tagline: "11. ENGINEERING SPECIFICATIONS",
    headline: "Architectural Measurement Overlays",
    subheadline: "Wingspan, MTOW, Payload & Endurance metrics.",
    description: "Apple-style caliper dimension lines measure physical geometry to sub-millimeter industrial tolerances.",
    scrollRange: [0.77, 0.84],
    specs: [
      { label: "Wingspan", value: "3,400", unit: "mm" },
      { label: "Fuselage Length", value: "2,150", unit: "mm" },
      { label: "Max Takeoff Weight", value: "72", unit: "kg" },
      { label: "Flight Time", value: "180", unit: "min" },
    ],
    cameraPos: [0, 2.4, 4.4],
    lookAt: [0, 0, 0],
    dronePos: [0, 0, 0],
    droneRot: [0.4, 0.2, 0],
    tiltAngle: 0,
    rotorSpeed: 0.2,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0.2,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: true, // 3D Caliper lines
    wingsFolded: 0,
  },
  // 13. Complete Exploded View (Highlight: Mixed Accent Colors - Climax Reveal ⭐)
  {
    id: 13,
    key: "exploded",
    tagline: "12. COMPLETE EXPLODED VIEW ⭐",
    headline: "Master Component Disassembly",
    subheadline: "Frame, Motors, Props, Battery, Avionics, Sensors & Spray.",
    description: "The grand engineering reveal: every module snaps apart along calibrated kinematic axes with glowing leader lines.",
    scrollRange: [0.84, 0.93],
    specs: [
      { label: "Total Parts", value: "482", unit: "pcs" },
      { label: "Modular Systems", value: "12", unit: "subsystems" },
      { label: "Field Service", value: "< 5", unit: "min" },
    ],
    cameraPos: [0, 1.8, 5.2],
    lookAt: [0, 0, 0],
    dronePos: [0, 0, 0],
    droneRot: [0.35, 0.45, -0.1],
    tiltAngle: 0.2,
    rotorSpeed: 0.2,
    batterySlide: 0.8,
    flightComputerElevate: 0.9,
    cameraPitch: -0.4,
    lidarSpin: 0.5,
    tankTransparency: 0.6,
    sprayActive: false,
    explodedProgress: 1.0, // Complete exploded view climax!
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 0,
  },
  // 14. CTA & Deployment
  {
    id: 14,
    key: "cta",
    tagline: "RAPID FLEET DEPLOYMENT",
    headline: "Build The Future With FLUXX",
    subheadline: "Request commercial fleet access & pilot deployment.",
    description: "Compact folding rotor arms enable rapid transport. Deploy autonomous sovereign VTOL fleets in under 120 seconds.",
    scrollRange: [0.93, 1.0],
    specs: [
      { label: "Folded Footprint", value: "1.1 × 0.8", unit: "m" },
      { label: "Deployment Time", value: "120", unit: "sec" },
      { label: "Fleet Availability", value: "Q3 2026", unit: "" },
    ],
    cameraPos: [0, 0.6, 4.2],
    lookAt: [0, 0, 0],
    dronePos: [0, 0, 0],
    droneRot: [0.1, 0, 0],
    tiltAngle: 0,
    rotorSpeed: 0,
    batterySlide: 0,
    flightComputerElevate: 0,
    cameraPitch: 0,
    lidarSpin: 0,
    tankTransparency: 0,
    sprayActive: false,
    explodedProgress: 0,
    powerFlowActive: false,
    hologramActive: false,
    dimensionLinesActive: false,
    wingsFolded: 1.0,
  },
];

// Smooth Cosine Easing
function easeInOut(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t));
}

// Lerp helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Vector3 Lerp helper
function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function getProductState(progress: number): {
  chapter: ProductChapter;
  nextChapter: ProductChapter;
  blend: number;
  cameraPos: THREE.Vector3;
  lookAt: THREE.Vector3;
  dronePos: THREE.Vector3;
  droneRot: THREE.Euler;
  tiltAngle: number;
  rotorSpeed: number;
  batterySlide: number;
  flightComputerElevate: number;
  cameraPitch: number;
  lidarSpin: number;
  tankTransparency: number;
  sprayActive: boolean;
  explodedProgress: number;
  powerFlowActive: boolean;
  hologramActive: boolean;
  dimensionLinesActive: boolean;
  wingsFolded: number;
} {
  const clampedProgress = Math.max(0, Math.min(0.9999, progress));

  // Find active keyframe index
  let idx = 0;
  for (let i = 0; i < PRODUCT_CHAPTERS.length - 1; i++) {
    const ch = PRODUCT_CHAPTERS[i];
    const nextCh = PRODUCT_CHAPTERS[i + 1];
    if (clampedProgress >= ch.scrollRange[0] && clampedProgress < nextCh.scrollRange[0]) {
      idx = i;
      break;
    }
    if (i === PRODUCT_CHAPTERS.length - 2) {
      idx = i;
    }
  }

  const curr = PRODUCT_CHAPTERS[idx];
  const next = PRODUCT_CHAPTERS[Math.min(PRODUCT_CHAPTERS.length - 1, idx + 1)];

  const rangeSpan = next.scrollRange[0] - curr.scrollRange[0] || 0.05;
  const rawT = (clampedProgress - curr.scrollRange[0]) / rangeSpan;
  const t = easeInOut(Math.max(0, Math.min(1, rawT)));

  const camPos = lerpVec3(curr.cameraPos, next.cameraPos, t);
  const look = lerpVec3(curr.lookAt, next.lookAt, t);
  const dPos = lerpVec3(curr.dronePos, next.dronePos, t);
  const dRot = lerpVec3(curr.droneRot, next.droneRot, t);

  return {
    chapter: curr,
    nextChapter: next,
    blend: t,
    cameraPos: new THREE.Vector3(camPos[0], camPos[1], camPos[2]),
    lookAt: new THREE.Vector3(look[0], look[1], look[2]),
    dronePos: new THREE.Vector3(dPos[0], dPos[1], dPos[2]),
    droneRot: new THREE.Euler(dRot[0], dRot[1], dRot[2]),
    tiltAngle: lerp(curr.tiltAngle, next.tiltAngle, t),
    rotorSpeed: lerp(curr.rotorSpeed, next.rotorSpeed, t),
    batterySlide: lerp(curr.batterySlide, next.batterySlide, t),
    flightComputerElevate: lerp(curr.flightComputerElevate, next.flightComputerElevate, t),
    cameraPitch: lerp(curr.cameraPitch, next.cameraPitch, t),
    lidarSpin: lerp(curr.lidarSpin, next.lidarSpin, t),
    tankTransparency: lerp(curr.tankTransparency, next.tankTransparency, t),
    sprayActive: t > 0.5 ? next.sprayActive : curr.sprayActive,
    explodedProgress: lerp(curr.explodedProgress, next.explodedProgress, t),
    powerFlowActive: t > 0.3 ? next.powerFlowActive : curr.powerFlowActive,
    hologramActive: t > 0.5 ? next.hologramActive : curr.hologramActive,
    dimensionLinesActive: t > 0.3 ? next.dimensionLinesActive : curr.dimensionLinesActive,
    wingsFolded: lerp(curr.wingsFolded, next.wingsFolded, t),
  };
}
