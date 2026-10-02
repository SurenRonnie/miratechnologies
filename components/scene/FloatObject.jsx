"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { prefersReducedMotion } from "@/lib/motion";

/*
  A photoreal 3D object (transparent Higgsfield render) that floats in its section.
  Three layers so the motions never fight:
    outer  -> scroll parallax + scroll-scrubbed spin
    tilt   -> pointer parallax with a slight 3D tilt
    bob    -> idle floating (slow sine)
*/
export default function FloatObject({
  src,
  className = "",
  depth = 0.4,
  spin = 18,
  amp = 14,
  sizes = "(min-width: 768px) 30vw, 60vw",
  trigger,
}) {
  const outer = useRef(null);
  const tilt = useRef(null);
  const bob = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = outer.current;
    const section = trigger ? document.querySelector(trigger) : el.closest("section, footer") || el.parentElement;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: depth * 70, rotate: -spin / 2 },
        {
          yPercent: -depth * 70,
          rotate: spin / 2,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
      gsap.to(bob.current, {
        y: -amp,
        rotation: 3,
        duration: 3.2 + Math.random() * 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    const tick = () => {
      const p = sceneState.pointerSmooth;
      const t = tilt.current;
      if (!t) return;
      t.style.transform = `translate3d(${p.x * depth * 40}px, ${p.y * depth * 30}px, 0) rotateY(${p.x * depth * 14}deg) rotateX(${-p.y * depth * 10}deg)`;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [depth, spin, amp, trigger]);

  return (
    <div ref={outer} className={`float-obj absolute ${className}`} aria-hidden="true" style={{ perspective: 900 }}>
      <div ref={tilt} className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        <div ref={bob} className="will-change-transform">
          <Image src={src} alt="" width={1100} height={1100} sizes={sizes} className="h-auto w-full" draggable={false} />
        </div>
      </div>
    </div>
  );
}
