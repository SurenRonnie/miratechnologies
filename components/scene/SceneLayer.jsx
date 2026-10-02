"use client";

/*
  SceneLayer: the persistent, fixed backdrop of 4K Higgsfield plates.

  How to edit:
  - `keys` is an ordered list of keyframes. Each key has an `at` anchor and a partial `state`.
    Anything a key leaves out is carried forward from the previous key.
  - Anchors: { id, p }.
      p = number 0..1  -> progress through the section's scroll range (top at viewport top
                          until bottom at viewport bottom; for sticky sections that is the pinned range)
      p = "enter"      -> the section's top touches the bottom of the viewport
  - Units: x in vw, y in vh, s = scale multiplier on the "cover" size, r = degrees, o = opacity.
  - Plates are screen-blended on #000, so the black in each image contributes nothing.
*/

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { clamp, lerp, prefersReducedMotion, smooth } from "@/lib/motion";
import { onReady } from "@/components/ui/Preloader";

const BASE = {
  planet: { o: 0, s: 1, x: 0, y: 0 },
  star: { o: 0, s: 1, x: 0, y: 0, r: 0 },
  starMax: { o: 0 },
  tail: { o: 0, x: 0, y: 0 },
  surface: { o: 0, s: 1, y: 0 },
  pulse: 0.85,
};

// Pointer parallax depth per plate (vw per unit of pointer offset)
const DEPTH = { planet: 0.6, star: 1.2, tail: 1.8, surface: 0.9 };

function flatten(state, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(state)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function buildStates(keys) {
  let prev = flatten(BASE);
  return keys.map((k) => {
    const next = { ...prev, ...flatten(k.state || {}) };
    prev = next;
    return next;
  });
}

function resolveAnchor({ id, p }) {
  const el = document.getElementById(id);
  if (!el) return null;
  const vh = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - vh;
  const top = el.getBoundingClientRect().top + window.scrollY;
  if (p === "enter") return Math.min(Math.max(0, top - vh), maxScroll);
  const range = Math.max(el.offsetHeight - vh, 1);
  return Math.min(Math.max(0, top + p * range), maxScroll);
}

function HeroPlanet() {
  const common = { alt: "", sizes: "100vw", quality: 90 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, width: 3840, height: 2160, src: "/space/hero-planet.4k.webp" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, width: 2160, height: 3840, src: "/space/hero-planet-mobile.4k.webp" });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} fetchPriority="high" style={{ objectPosition: "50% 100%" }} />
    </picture>
  );
}

function Plate({ src, sizes = "100vw" }) {
  const { props } = getImageProps({ src, alt: "", width: 2560, height: 2560, sizes, quality: 75 });
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} loading="eager" fetchPriority="low" decoding="async" />;
}

export default function SceneLayer({ keys, intro = false }) {
  const planetRef = useRef(null);
  const starRef = useRef(null);
  const starMinRef = useRef(null);
  const starMaxRef = useRef(null);
  const tailRef = useRef(null);
  const surfaceRef = useRef(null);

  useEffect(() => {
    const refs = { planet: planetRef, star: starRef, starMin: starMinRef, starMax: starMaxRef, tail: tailRef, surface: surfaceRef };
    const reduce = prefersReducedMotion();
    const states = buildStates(keys);
    const names = Object.keys(states[0]);
    let positions = [];
    const current = { ...states[0] };
    const introState = { y: intro && !reduce ? 14 : 0, o: intro && !reduce ? 0 : 1 };
    let first = true;

    const measure = () => {
      const raw = keys.map((k) => resolveAnchor(k.at));
      // keep anchors strictly increasing so every segment has length
      let last = -Infinity;
      positions = raw.map((v) => {
        const val = v == null ? last + 1 : Math.max(v, last + 1);
        last = val;
        return val;
      });
    };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("resize", measure);

    const stopIntro = onReady(() => {
      if (!intro || reduce) return;
      gsap.to(introState, { y: 0, o: 1, duration: 2.4, ease: "expo.out", delay: 0.1 });
    });

    const target = {};
    const tick = () => {
      const y = window.scrollY;
      let i = 0;
      while (i < positions.length - 2 && y >= positions[i + 1]) i++;
      const a = states[i];
      const b = states[Math.min(i + 1, states.length - 1)];
      const span = positions[i + 1] - positions[i] || 1;
      const t = smooth(clamp((y - positions[i]) / span));
      for (const n of names) target[n] = lerp(a[n], b[n], t);

      const k = first || reduce ? 1 : 0.14;
      for (const n of names) current[n] += (target[n] - current[n]) * k;
      first = false;

      const px = reduce ? 0 : sceneState.pointerSmooth.x;
      const py = reduce ? 0 : sceneState.pointerSmooth.y;
      const c = current;

      const set = (ref, transform, opacity) => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = transform;
        el.style.opacity = opacity.toFixed(3);
        el.style.visibility = opacity < 0.003 ? "hidden" : "visible";
      };

      set(
        refs.planet,
        `translate3d(${c["planet.x"] - px * DEPTH.planet}vw, ${c["planet.y"] + introState.y - py * 0.4}vh, 0) scale(${c["planet.s"]})`,
        c["planet.o"] * introState.o
      );

      const starTransform = `translate3d(calc(-50% + ${c["star.x"] - px * DEPTH.star}vw), calc(-50% + ${c["star.y"] - py * 0.8}vh), 0) scale(${c["star.s"]}) rotate(${c["star.r"]}deg)`;
      if (refs.star.current) refs.star.current.style.transform = starTransform;
      set(refs.starMin, "none", c["star.o"]);
      set(refs.starMax, "none", c["starMax.o"]);
      if (refs.star.current) {
        refs.star.current.style.visibility =
          c["star.o"] < 0.003 && c["starMax.o"] < 0.003 ? "hidden" : "visible";
      }

      set(refs.tail, `translate3d(${c["tail.x"] - px * DEPTH.tail}vw, ${c["tail.y"]}vh, 0)`, c["tail.o"]);
      set(
        refs.surface,
        `translate3d(${-px * DEPTH.surface}vw, ${c["surface.y"]}vh, 0) scale(${c["surface.s"]})`,
        c["surface.o"]
      );

      sceneState.pulse = c.pulse;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      stopIntro();
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
    };
    // keys are static per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-space" aria-hidden="true">
      {/* gas tail: wider than the viewport so it can stream past */}
      <div ref={tailRef} className="plate left-0 top-[8vh] h-[84vh] w-[160vw]" style={{ opacity: 0 }}>
        <Plate src="/space/mira-tail.4k.webp" sizes="160vw" />
      </div>

      {/* the star: min and max share one transform so they crossfade exactly */}
      <div
        ref={starRef}
        className="absolute left-1/2 top-1/2 h-[100vmax] w-[100vmax] will-change-transform"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <div ref={starMinRef} className="plate inset-0" style={{ opacity: 0 }}>
          <Plate src="/space/mira-star-min.4k.webp" sizes="100vmax" />
        </div>
        <div ref={starMaxRef} className="plate inset-0" style={{ opacity: 0 }}>
          <Plate src="/space/mira-star-max.4k.webp" sizes="100vmax" />
        </div>
      </div>

      <div ref={surfaceRef} className="plate inset-0 origin-bottom" style={{ opacity: 0 }}>
        <Plate src="/space/surface-closeup.4k.webp" />
      </div>

      <div ref={planetRef} data-hero-plate className="plate inset-0 origin-bottom" style={{ opacity: 0 }}>
        <HeroPlanet />
      </div>
    </div>
  );
}
