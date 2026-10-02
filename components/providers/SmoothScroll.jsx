"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { prefersReducedMotion } from "@/lib/motion";

// Lenis smooth scroll synced to the GSAP ticker, plus a shared smoothed pointer.
export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.085,
      smoothWheel: !reduce,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });
    window.__lenis = lenis;

    lenis.on("scroll", (e) => {
      sceneState.velocity = e.velocity;
      ScrollTrigger.update();
    });

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onMove = (e) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const smoothPointer = () => {
      const p = sceneState.pointer;
      const s = sceneState.pointerSmooth;
      s.x += (p.x - s.x) * 0.06;
      s.y += (p.y - s.y) * 0.06;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    gsap.ticker.add(smoothPointer);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.remove(smoothPointer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", refresh);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // New route: start at the top (or at the hash), then re-measure triggers.
  useEffect(() => {
    const lenis = window.__lenis;
    const hash = window.location.hash;
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash && document.querySelector(hash)) {
        lenis ? lenis.scrollTo(hash, { duration: 1.6 }) : document.querySelector(hash).scrollIntoView();
      }
    }, 120);
    return () => clearTimeout(id);
  }, [pathname]);

  return children;
}
