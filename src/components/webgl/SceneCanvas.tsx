"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";
import { SceneTransition } from "./SceneTransition";

interface Props {
  images: string[];
  progressRef: React.RefObject<number>;
}

export function SceneCanvas({ images, progressRef }: Props) {
  const { dpr } = useDeviceCapabilities();
  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneTransition images={images} progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
