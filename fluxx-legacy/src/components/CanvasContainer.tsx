"use client";

import { Canvas } from "@react-three/fiber";
import { SceneManager } from "@/scene/SceneManager";

interface CanvasContainerProps {
  progress: number;
  onSelectPart?: (partId: string) => void;
  selectedPartId?: string | null;
  isDark?: boolean;
}

export function CanvasContainer({
  progress,
  onSelectPart,
  selectedPartId,
  isDark = false,
}: CanvasContainerProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneManager
          progress={progress}
          onSelectPart={onSelectPart}
          selectedPartId={selectedPartId}
          isDark={isDark}
        />
      </Canvas>
    </div>
  );
}
