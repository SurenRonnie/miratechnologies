"use client";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const smooth = (t) => t * t * (3 - 2 * t);

// Scroll to a target with Lenis when it is running, native otherwise.
export function scrollToTarget(target, options = {}) {
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...options });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth" });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
}
