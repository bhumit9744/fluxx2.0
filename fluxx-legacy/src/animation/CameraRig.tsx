"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  targetPos: THREE.Vector3;
  targetLookAt: THREE.Vector3;
}

export function CameraRig({ targetPos, targetLookAt }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0.35, 2.7));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth pointer smoothing for buttery parallax
    smoothPointer.current.x += (pointer.x - smoothPointer.current.x) * Math.min(1, delta * 3.5);
    smoothPointer.current.y += (pointer.y - smoothPointer.current.y) * Math.min(1, delta * 3.5);

    // Cinematographer camera interpolation rate (feels like heavy motorized robotic crane)
    const factor = 1 - Math.exp(-delta * 3.8);

    // Subtle cinematic orbit & breathing motion (Apple / DJI Product Launch Film Feel)
    // Tiny subtle orbital pan + slow push-pull breath
    const orbitAngle = t * 0.45;
    const orbitX = Math.sin(orbitAngle) * 0.035;
    const orbitY = Math.cos(orbitAngle * 0.8) * 0.025;
    const breathZ = Math.sin(t * 0.3) * 0.02;

    // Mouse parallax reaction
    const parallaxX = smoothPointer.current.x * 0.18;
    const parallaxY = smoothPointer.current.y * 0.12;

    const desiredX = targetPos.x + parallaxX + orbitX;
    const desiredY = targetPos.y + parallaxY + orbitY;
    const desiredZ = targetPos.z + breathZ;

    // Smooth position interpolation with ease
    currentPos.current.x += (desiredX - currentPos.current.x) * factor;
    currentPos.current.y += (desiredY - currentPos.current.y) * factor;
    currentPos.current.z += (desiredZ - currentPos.current.z) * factor;
    camera.position.copy(currentPos.current);

    // Smooth lookAt target tracking
    const lookFactor = 1 - Math.exp(-delta * 4.2);
    const lookX = targetLookAt.x + parallaxX * 0.3;
    const lookY = targetLookAt.y + parallaxY * 0.3;
    const lookZ = targetLookAt.z;

    currentLookAt.current.x += (lookX - currentLookAt.current.x) * lookFactor;
    currentLookAt.current.y += (lookY - currentLookAt.current.y) * lookFactor;
    currentLookAt.current.z += (lookZ - currentLookAt.current.z) * lookFactor;
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
