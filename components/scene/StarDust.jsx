"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uStretch;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aEmber;
  varying float vEmber;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // slow drift + scroll parallax, wrapped inside the box so dust never runs out
    float depth = (p.z + 6.0) / 12.0;              // 0 far .. 1 near
    p.y += uScroll * (0.4 + depth * 1.6) + uTime * 0.02;
    p.y = mod(p.y + 6.0, 12.0) - 6.0;
    p.x += uPointer.x * depth * 0.35;
    p.y += uPointer.y * depth * 0.25;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (1.0 + uStretch * depth * 2.0);
    vEmber = aEmber;
    vAlpha = 0.2 + depth * 0.25;
  }
`;

const fragment = /* glsl */ `
  uniform float uStretch;
  varying float vEmber;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv.x *= 1.0 + uStretch * 3.0;                  // squash into a streak when scrolling fast
    float d = length(uv);
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    vec3 ink = vec3(0.957, 0.945, 0.925);
    vec3 ember = vec3(1.0, 0.357, 0.18);
    gl_FragColor = vec4(mix(ink, ember, vEmber), a);
  }
`;

// Deterministic PRNG so the dust field is a pure function of its count.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Dust({ count }) {
  const mat = useRef(null);
  const scroll = useRef(0);

  const geometry = useMemo(() => {
    const rand = mulberry32(1337);
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const ember = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 16;
      pos[i * 3 + 1] = (rand() - 0.5) * 12;
      pos[i * 3 + 2] = (rand() - 0.5) * 12;
      size[i] = 1 + rand() * 1.6;
      ember[i] = rand() < 0.03 ? 1 : 0;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aEmber", new THREE.BufferAttribute(ember, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uStretch: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    scroll.current += (window.scrollY / window.innerHeight - scroll.current) * 0.1;
    u.uScroll.value = scroll.current;
    const v = Math.min(Math.abs(sceneState.velocity) / 60, 1);
    u.uStretch.value += (v - u.uStretch.value) * 0.08;
    u.uPointer.value.set(sceneState.pointerSmooth.x, -sceneState.pointerSmooth.y);
    u.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Fixed full-screen canvas sitting above the plates and below the content.
export default function StarDust() {
  const [tier, setTier] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = window.innerWidth;
    const mem = navigator.deviceMemory || 8;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTier(w < 768 || mem <= 4 ? { count: 500, dpr: 1 } : w < 1400 ? { count: 1500, dpr: [1, 1.5] } : { count: 3000, dpr: [1, 1.75] });
  }, []);

  if (!tier) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
      <Canvas
        dpr={tier.dpr}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Dust count={tier.count} />
      </Canvas>
    </div>
  );
}
