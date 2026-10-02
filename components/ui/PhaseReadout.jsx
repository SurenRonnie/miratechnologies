"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";

// Bottom-left readout of where we are in the Mira brightness cycle.
// Sections declare their phase with data-phase. MAG follows the scene pulse.
export default function PhaseReadout() {
  const word = useRef(null);
  const mag = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    let currentPhase = "MINIMUM";
    const setPhase = (next) => {
      if (!next || next === currentPhase) return;
      currentPhase = next;
      const el = word.current;
      gsap
        .timeline()
        .to(el, { yPercent: -110, duration: 0.35, ease: "power3.in" })
        .add(() => (el.textContent = next))
        .fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" });
    };

    const triggers = [...document.querySelectorAll("[data-phase]")].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setPhase(el.dataset.phase),
      })
    );

    let lastMag = "";
    const tick = () => {
      // pulse 0.7 (calm) .. 1.6 (maximum) -> magnitude 9.0 .. 3.5
      const t = Math.min(Math.max((sceneState.pulse - 0.7) / 0.9, 0), 1);
      const m = (9 - t * 5.5).toFixed(1);
      if (m !== lastMag && mag.current) mag.current.textContent = m;
      lastMag = m;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    gsap.ticker.add(tick);

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-[var(--gutter)] z-[60] hidden text-ink mix-blend-difference md:block"
      aria-hidden="true"
    >
      <div className="t-label flex items-center gap-2 text-[10px]">
        <span className="opacity-60">Phase</span>
        <span className="opacity-40">/</span>
        <span className="mask-line inline-block">
          <span ref={word} className="block">
            MINIMUM
          </span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="block h-px w-20 bg-white/20">
          <span ref={bar} className="block h-px w-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
        </span>
        <span className="t-label text-[10px] opacity-60">
          MAG <span ref={mag}>9.0</span>
        </span>
      </div>
    </div>
  );
}
