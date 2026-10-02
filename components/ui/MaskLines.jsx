"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/*
  Heading split into explicit lines. Each line rises inside an overflow-hidden mask.
  mode="scroll": scrubbed to scroll as the heading enters.
  mode="manual": parent animates [data-line] itself (hero intro).
*/
export default function MaskLines({ lines, as: Tag = "h2", className = "", mode = "scroll", start = "top 92%", end = "top 55%" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (mode !== "scroll" || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll("[data-line]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start, end, scrub: 0.8 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [mode, start, end]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span data-line>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
