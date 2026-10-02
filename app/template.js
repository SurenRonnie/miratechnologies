"use client";

import { useRef } from "react";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { gsap } from "@/lib/gsap";

let firstMount = true;

// Route change: a black curtain lifts off the new page. Skipped on first load (the preloader owns that).
export default function Template({ children }) {
  const curtain = useRef(null);

  useIsoLayoutEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    gsap.fromTo(
      curtain.current,
      { clipPath: "inset(0 0 0% 0)", display: "block" },
      { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut", delay: 0.05, onComplete: () => gsap.set(curtain.current, { display: "none" }) }
    );
  }, []);

  return (
    <>
      <div ref={curtain} className="pointer-events-none fixed inset-0 z-[85] hidden bg-space" aria-hidden="true" />
      {children}
    </>
  );
}
