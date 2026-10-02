"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
}

export const EASE_FILM = "cubic-bezier(0.76, 0, 0.24, 1)";

export { gsap, ScrollTrigger };
