export interface SceneMetadata {
  id: number;
  key: string;
  title: string;
  tagline: string;
  description: string;
  category: "STARTUP" | "TRANSITION" | "INNOVATION" | "MISSION" | "FUTURE";
  scrollRange: [number, number]; // normalized [start, end] from 0 to 1
  hud: {
    altitudeM: number;
    speedKmh: number;
    batteryPct: number;
    windKmh: number;
    mode: "STANDBY" | "TAKEOFF" | "CRUISE" | "AI_SURVEY" | "SPRAY_ACTIVE" | "ORBITAL" | "LANDING";
    ndviLevel?: "NORMAL" | "WARNING" | "CRITICAL";
  };
  audioCue?: string;
  highlightStats?: { label: string; value: string; unit?: string }[];
}

export const SCENES: SceneMetadata[] = [
  {
    id: 1,
    key: "loading",
    title: "INITIATION",
    tagline: "Autonomous VTOL Ecosystem",
    description: "Initializing quantum neural flight compute, telemetry diagnostics, and optical payload arrays.",
    category: "STARTUP",
    scrollRange: [0.0, 0.04],
    hud: { altitudeM: 0, speedKmh: 0, batteryPct: 100, windKmh: 0, mode: "STANDBY" },
  },
  {
    id: 2,
    key: "hangar",
    title: "FLUXX",
    tagline: "Engineering Tomorrow's Agriculture",
    description: "Inside the sovereign manufacturing facility. A full-stack autonomous heavy-lift VTOL platform engineered for extreme endurance.",
    category: "STARTUP",
    scrollRange: [0.04, 0.09],
    hud: { altitudeM: 0, speedKmh: 0, batteryPct: 100, windKmh: 2, mode: "STANDBY" },
    highlightStats: [
      { label: "Wingspan", value: "3.4", unit: "m" },
      { label: "Payload Capacity", value: "50", unit: "kg" },
      { label: "Flight Endurance", value: "180", unit: "min" },
    ],
  },
  {
    id: 3,
    key: "startup",
    title: "SYSTEMS ONLINE",
    tagline: "Quad-Tilt Rotor Spin-Up",
    description: "Flight computer verifies brushless ESC telemetry. High-torque coaxial tilt-rotors spool to idle. Hangar blast doors depressurize.",
    category: "STARTUP",
    scrollRange: [0.09, 0.15],
    hud: { altitudeM: 0.2, speedKmh: 0, batteryPct: 99, windKmh: 4, mode: "TAKEOFF" },
    highlightStats: [
      { label: "Motor RPM", value: "4,200", unit: "rpm" },
      { label: "Bus Voltage", value: "96.4", unit: "V" },
      { label: "IMU Convergence", value: "100", unit: "%" },
    ],
  },
  {
    id: 4,
    key: "takeoff",
    title: "VERTICAL ASCENT",
    tagline: "Zero-Runway Capability",
    description: "Downward aerodynamic thrust elevates the carbon monocoque airframe. Ground vortex particles swirl as hangar floodlights yield to dawn.",
    category: "STARTUP",
    scrollRange: [0.15, 0.21],
    hud: { altitudeM: 12, speedKmh: 18, batteryPct: 98, windKmh: 8, mode: "TAKEOFF" },
  },
  {
    id: 5,
    key: "transition-out",
    title: "PERIMETER EXIT",
    tagline: "Breaking into Open Airspace",
    description: "Clearing hangar portal. Sensor fusion locks onto GPS-RTK constellation. The vast agricultural horizon unfurls without seams.",
    category: "TRANSITION",
    scrollRange: [0.21, 0.27],
    hud: { altitudeM: 45, speedKmh: 64, batteryPct: 97, windKmh: 14, mode: "CRUISE" },
  },
  {
    id: 6,
    key: "open-world",
    title: "SMALL FARMS, GLOBAL IMPACT",
    tagline: "Empowering 500 Million Growers",
    description: "Autonomous grid navigation over fragmented agricultural landscapes, terraced rice valleys, rivers, and mountain micro-climates.",
    category: "MISSION",
    scrollRange: [0.27, 0.33],
    hud: { altitudeM: 80, speedKmh: 95, batteryPct: 95, windKmh: 16, mode: "CRUISE" },
    highlightStats: [
      { label: "Field Mapping Rate", value: "120", unit: "ha/hr" },
      { label: "RTK Precision", value: "±1.2", unit: "cm" },
    ],
  },
  {
    id: 7,
    key: "problem",
    title: "THE PARADOX",
    tagline: "Degraded Soils & Chemical Runoff",
    description: "Conventional broadcast spraying wastes 70% of nitrogen into aquifers while pest outbreaks decimate yield across parched acreage.",
    category: "INNOVATION",
    scrollRange: [0.33, 0.39],
    hud: { altitudeM: 65, speedKmh: 50, batteryPct: 93, windKmh: 12, mode: "AI_SURVEY", ndviLevel: "CRITICAL" },
    highlightStats: [
      { label: "Fertilizer Waste", value: "70", unit: "%" },
      { label: "Soil Acidification", value: "+45", unit: "%" },
      { label: "Groundwater Nitrate", value: "CRITICAL" },
    ],
  },
  {
    id: 8,
    key: "factory",
    title: "CIRCULAR BIOMASS REFINERY",
    tagline: "Rice Husk to Green Hydrogen & Nano-Urea",
    description: "Agricultural waste transformed via high-temperature plasma gasification into green hydrogen and bio-chelated nano-nutrients.",
    category: "INNOVATION",
    scrollRange: [0.39, 0.46],
    hud: { altitudeM: 30, speedKmh: 20, batteryPct: 91, windKmh: 5, mode: "AI_SURVEY" },
    highlightStats: [
      { label: "Carbon Negative", value: "-1.8", unit: "tCO₂e/ha" },
      { label: "H₂ Synthesis Purity", value: "99.99", unit: "%" },
      { label: "Nano-Chelation", value: "15", unit: "nm" },
    ],
  },
  {
    id: 9,
    key: "exploded",
    title: "ANATOMY OF PRECISION",
    tagline: "Exploded Modular Architecture",
    description: "Inspect the sub-systems: High-torque brushless tilt-pods, dual GNSS-RTK, solid-state LiDAR, AI neural camera, and smart atomizers.",
    category: "INNOVATION",
    scrollRange: [0.46, 0.54],
    hud: { altitudeM: 25, speedKmh: 0, batteryPct: 89, windKmh: 4, mode: "STANDBY" },
  },
  {
    id: 10,
    key: "mission-cruise",
    title: "MISSION DEPLOYMENT",
    tagline: "Fixed-Wing High Efficiency Cruise",
    description: "Tilt-rotors pivot horizontally to 0° angle of attack. Aerodynamic lift takes over for rapid transit to distressed crop coordinates.",
    category: "MISSION",
    scrollRange: [0.54, 0.60],
    hud: { altitudeM: 70, speedKmh: 110, batteryPct: 86, windKmh: 18, mode: "CRUISE" },
  },
  {
    id: 11,
    key: "ai-scan",
    title: "AI MULTISPECTRAL SCAN",
    tagline: "Sub-Centimeter NDVI Leaf Analytics",
    description: "Edge neural network processes 4K multispectral imagery in real-time, segmenting healthy foliage, nitrogen chlorosis, and moisture stress.",
    category: "MISSION",
    scrollRange: [0.60, 0.67],
    hud: { altitudeM: 35, speedKmh: 45, batteryPct: 83, windKmh: 10, mode: "AI_SURVEY", ndviLevel: "WARNING" },
    highlightStats: [
      { label: "Resolution", value: "0.8", unit: "cm/px" },
      { label: "Inference Latency", value: "14", unit: "ms" },
      { label: "Canopy Index", value: "0.68", unit: "NDVI" },
    ],
  },
  {
    id: 12,
    key: "spray",
    title: "TARGETED NANO-SPRAYING",
    tagline: "Micro-Droplet Electrostatic Delivery",
    description: "High-frequency ultrasonic nozzles deliver charged 30-micron nano-urea droplets directly to leaf stomata with zero overspray drift.",
    category: "MISSION",
    scrollRange: [0.67, 0.74],
    hud: { altitudeM: 15, speedKmh: 28, batteryPct: 78, windKmh: 8, mode: "SPRAY_ACTIVE", ndviLevel: "NORMAL" },
    highlightStats: [
      { label: "Active Flow", value: "3.2", unit: "L/min" },
      { label: "Droplet Size", value: "30", unit: "μm" },
      { label: "Drift Reduction", value: "98.5", unit: "%" },
    ],
  },
  {
    id: 13,
    key: "analytics",
    title: "LIVE MISSION TELEMETRY",
    tagline: "Autonomous Field Validation",
    description: "Real-time verification metrics computed across treated farm sector. Soil microbiome safeguarded and fertilizer expenditures slashed.",
    category: "MISSION",
    scrollRange: [0.74, 0.81],
    hud: { altitudeM: 90, speedKmh: 75, batteryPct: 74, windKmh: 12, mode: "CRUISE" },
    highlightStats: [
      { label: "Chemical Reduction", value: "85", unit: "%" },
      { label: "Yield Increase", value: "+28", unit: "%" },
      { label: "Water Conserved", value: "90", unit: "%" },
      { label: "Carbon Offset", value: "14.2", unit: "kg" },
    ],
  },
  {
    id: 14,
    key: "earth",
    title: "GLOBAL FLEET VISION",
    tagline: "Planetary Agricultural Grid",
    description: "Ascending into orbital view. Decentralized drone swarms coordinate across 45 countries, ensuring resilient global food sovereignty.",
    category: "FUTURE",
    scrollRange: [0.81, 0.87],
    hud: { altitudeM: 1400, speedKmh: 280, batteryPct: 70, windKmh: 0, mode: "ORBITAL" },
    highlightStats: [
      { label: "Active Fleets", value: "1,250+", unit: "drones" },
      { label: "Global Coverage", value: "4.2M", unit: "hectares" },
      { label: "Nations Deployed", value: "45", unit: "countries" },
    ],
  },
  {
    id: 15,
    key: "roadmap",
    title: "TECHNOLOGY ROADMAP",
    tagline: "Decade of Scaled Disruption",
    description: "From sovereign prototype to fully autonomous planetary farm management fleets.",
    category: "FUTURE",
    scrollRange: [0.87, 0.92],
    hud: { altitudeM: 200, speedKmh: 60, batteryPct: 67, windKmh: 6, mode: "CRUISE" },
  },
  {
    id: 16,
    key: "team",
    title: "COMMAND & ENGINEERING",
    tagline: "Pioneering VTOL & Deep-Agri Robotics",
    description: "Meet the aerospace engineers, roboticists, and biochemists building FLUXX.",
    category: "FUTURE",
    scrollRange: [0.92, 0.96],
    hud: { altitudeM: 40, speedKmh: 20, batteryPct: 65, windKmh: 4, mode: "LANDING" },
  },
  {
    id: 17,
    key: "contact",
    title: "JOIN THE MISSION",
    tagline: "Let's Build The Future Together",
    description: "Partner with FLUXX for commercial fleet deployment, government agrarian defense, or venture co-development.",
    category: "FUTURE",
    scrollRange: [0.96, 1.0],
    hud: { altitudeM: 0, speedKmh: 0, batteryPct: 64, windKmh: 2, mode: "STANDBY" },
  },
];

export const EXPLODED_COMPONENTS = [
  {
    id: "rotor",
    name: "Coaxial Tilt-Rotor Pods",
    spec: "4x 12kW Brushless + Vectoring Servos",
    description: "Independent 110° tilt vectoring allowing instant transition between VTOL vertical hover and high-efficiency fixed-wing cruise.",
    offset: [0, 1.8, 0],
  },
  {
    id: "battery",
    name: "Solid-State Graphene Battery",
    spec: "96V 45Ah / 600 Wh/kg Energy Density",
    description: "Next-generation thermal-managed solid-state cells providing 180 minutes of continuous autonomous heavy-spray operation.",
    offset: [0, -1.4, 0],
  },
  {
    id: "flight_computer",
    name: "Quantum Neural Flight Computer",
    spec: "Dual Triple-Redundant IMU + RTK GNSS",
    description: "250 TOPS AI processing at 15W. Real-time path optimization, obstacle evasion, and dynamic swarm collision avoidance.",
    offset: [0, 1.2, 1.2],
  },
  {
    id: "lidar",
    name: "Solid-State 3D LiDAR",
    spec: "300m Range / 1.5M pts/sec",
    description: "Micro-terrain canopy contour tracking ensuring exact 1.5m constant flight altitude above undulating crop surfaces.",
    offset: [0, -0.9, 1.8],
  },
  {
    id: "ai_cam",
    name: "Multispectral 8-Band Optical Gimbal",
    spec: "4K RGB + 8 Narrow-Band Infrared Sensor",
    description: "NDVI, NDRE, and chlorophyll fluorometer camera delivering sub-centimeter leaf health segmentation at 120 km/h cruise.",
    offset: [0, -1.2, 0.9],
  },
  {
    id: "spray_tank",
    name: "Pressurized Nano-Urea Tank",
    spec: "50L Carbon-Kevlar Composite Bladder",
    description: "Bio-chelated nutrient reservoir with electro-magnetic fluid mixing and anti-slosh baffles.",
    offset: [0, 0, -1.5],
  },
  {
    id: "nozzles",
    name: "Electrostatic Ultrasonic Atomizers",
    spec: "4x Smart Variable-Rate Nozzles (20-50μm)",
    description: "Positively charges fertilizer micro-droplets for instantaneous wrap-around leaf adhesion with zero soil leaching.",
    offset: [0, -1.6, -1.2],
  },
  {
    id: "airframe",
    name: "Aerospace Toray T1100 Carbon Monocoque",
    spec: "High-Modulus Carbon Fiber + Kevlar",
    description: "Ultra-lightweight structural monocoque built to withstand 6G dynamic aerodynamic loading in adverse wind conditions.",
    offset: [0, 0, 0],
  },
];

export const ROADMAP_MILESTONES = [
  {
    year: "2026",
    phase: "ALPHA PROTOTYPE",
    badge: "COMPLETED",
    title: "VTOL Dynamics & Biomass Conversion",
    points: [
      "Aerodynamic subscale tilt-rotor wind tunnel verification",
      "Field validation of rice-husk green hydrogen plasma reactor",
      "Autonomous RTK-guided waypoint navigation in 40 km/h gusts",
    ],
  },
  {
    year: "2027",
    phase: "PILOT DEPLOYMENT",
    badge: "ACTIVE",
    title: "10,000 Hectare Agricultural Cohorts",
    points: [
      "Commercial beta across 50 progressive farming cooperatives",
      "Integration of real-time NDVI edge segmentation payload",
      "Zero-carbon localized nano-urea distribution hubs",
    ],
  },
  {
    year: "2028",
    phase: "COMMERCIAL FLEETS",
    badge: "UPCOMING",
    title: "Sovereign Autonomous Ag Swarms",
    points: [
      "Multi-drone swarm task coordination with automated charging docks",
      "Government soil rejuvenation initiative partnerships",
      "Global pesticide elimination standard certification",
    ],
  },
  {
    year: "2030",
    phase: "PLANETARY SCALE",
    badge: "VISION",
    title: "Planetary Food Security Network",
    points: [
      "100,000 autonomous VTOL units deployed across 5 continents",
      "1.5 gigatons annual agricultural CO₂ emission reduction",
      "Global soil fertility restored to pre-industrial benchmarks",
    ],
  },
];

export const TEAM_MEMBERS = [
  {
    name: "Dr. Elena Vance",
    role: "Chief Executive Officer & Founder",
    bio: "Former Lead Propulsion Engineer at SpaceX & DARPA autonomous systems fellow. Ph.D. in Aerospace Engineering from MIT.",
    tag: "AEROSPACE & PROPULSION",
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    bio: "Ex-DJI Enterprise Autonomy Architect & Neural Perception lead. Spearheaded edge-computing computer vision for agricultural robotics.",
    tag: "AI & PERCEPTION",
  },
  {
    name: "Dr. Aarav Patel",
    role: "Head of Agronomic Science & Bio-Refining",
    bio: "Pioneered biomass-to-nano-fertilizer plasma cracking at ICAR. Author of 24 patents in bio-chelated micronutrient delivery.",
    tag: "BIOCHEMISTRY & SOIL",
  },
  {
    name: "Sophia Rostova",
    role: "VP of Autonomous Hardware",
    bio: "Previously Senior Director of Avionics at Anduril Industries. Specialized in fail-safe triple-redundant flight control systems.",
    tag: "AVIONICS & HARDWARE",
  },
];
