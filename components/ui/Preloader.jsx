"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";

export function markReady() {
  sceneState.ready = true;
  window.dispatchEvent(new Event("mira:ready"));
}

// Run fn once the preloader has finished (or immediately if it already has).
export function onReady(fn) {
  if (sceneState.ready) {
    fn();
    return () => {};
  }
  window.addEventListener("mira:ready", fn, { once: true });
  return () => window.removeEventListener("mira:ready", fn);
}

function waitForHero() {
  const img = document.querySelector("[data-hero-plate] img");
  const imgReady = img
    ? img.complete
      ? Promise.resolve()
      : new Promise((r) => {
          img.addEventListener("load", r, { once: true });
          img.addEventListener("error", r, { once: true });
        })
    : Promise.resolve();
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise((r) => setTimeout(r, 4000));
  return Promise.race([Promise.all([imgReady, fonts]), timeout]);
}

// Counter and wipe, under ~2.5s. Shown once per session.
export default function Preloader() {
  const root = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("mira-loaded") === "1";
    } catch {}

    if (seen) {
      markReady();
      const id = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(id);
    }

    const lenis = window.__lenis;
    lenis?.stop();
    const progress = { v: 0 };
    const render = () => {
      count.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
      bar.current.style.transform = `scaleX(${progress.v / 100})`;
    };

    const fill = gsap.to(progress, { v: 82, duration: 1.3, ease: "power2.out", onUpdate: render });
    let tl;
    waitForHero().then(() => {
      fill.kill();
      tl = gsap
        .timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem("mira-loaded", "1");
            } catch {}
            lenis?.start();
            setDone(true);
          },
        })
        .to(progress, { v: 100, duration: 0.45, ease: "power2.inOut", onUpdate: render })
        .to("[data-pre-fade]", { opacity: 0, duration: 0.35 }, "+=0.05")
        .add(markReady, "-=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: "expo.inOut" }, "<");
    });

    return () => {
      fill.kill();
      tl?.kill();
      lenis?.start();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[95] flex flex-col justify-between bg-space px-[var(--gutter)] py-7"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden="true"
    >
      <span data-pre-fade className="t-display text-[13px] tracking-[0.18em]">
        MIRA
      </span>
      <div data-pre-fade className="flex items-end justify-between gap-6">
        <span className="t-label max-w-[14rem] text-dim">Phase / Minimum. Brightness rising.</span>
        <div className="flex flex-col items-end gap-3">
          <span ref={count} className="t-display text-[clamp(3rem,10vw,9rem)] leading-none">
            000
          </span>
          <span className="block h-px w-40 bg-hairline">
            <span ref={bar} className="block h-px w-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
