"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { planeVertexShader } from "@/shaders/vertex/plane.vert";
import { displacementFragmentShader } from "@/shaders/fragment/displacement.frag";
import { mapProgress } from "./progress";

interface Props {
  images: string[];
  progressRef: React.RefObject<number>;
}

export function SceneTransition({ images, progressRef }: Props) {
  const textures = useTexture(images) as THREE.Texture[];
  const { viewport, size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTexture0: { value: textures[0] ?? null },
      uTexture1: { value: textures[1] ?? textures[0] ?? null },
      uProgress: { value: 0 },
      uDisplacement: { value: 0.12 },
      uRgbShift: { value: 0.01 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTex0Size: { value: new THREE.Vector2(1, 1) },
      uTex1Size: { value: new THREE.Vector2(1, 1) },
    }),
    // solo al montar; las texturas se asignan en useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const sizeOf = (t: THREE.Texture | undefined): [number, number] => {
    const img = t?.image as { width?: number; height?: number } | undefined;
    return [img?.width ?? 1, img?.height ?? 1];
  };

  useFrame(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const { from, to, t } = mapProgress(progressRef.current ?? 0, textures.length);
    const tex0 = textures[from];
    const tex1 = textures[to];
    mat.uniforms.uTexture0.value = tex0 ?? null;
    mat.uniforms.uTexture1.value = tex1 ?? tex0 ?? null;
    const [w0, h0] = sizeOf(tex0);
    const [w1, h1] = sizeOf(tex1);
    mat.uniforms.uTex0Size.value.set(w0, h0);
    mat.uniforms.uTex1Size.value.set(w1, h1);
    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uProgress.value = t;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={planeVertexShader}
        fragmentShader={displacementFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
