"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { prefersReducedMotion } from "@/lib/motion";
import { stack } from "@/data/site";
import SectionLabel from "@/components/ui/SectionLabel";
import FloatObject from "@/components/scene/FloatObject";

function Row({ items, rowRef, outline }) {
  const content = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div ref={rowRef} className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {content.map((t, i) => (
              <span
                key={`${copy}-${i}`}
                className={`t-display px-[2.4vw] text-[clamp(2.2rem,7.5vw,7.5rem)] leading-none ${outline ? "t-outline" : "text-ink"}`}
              >
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Infinite marquee whose speed follows scroll velocity and flips with scroll direction.
export default function Stack() {
  const a = useRef(null);
  const b = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let x = 0;
    let dir = 1;
    const tick = (_, delta) => {
      const v = sceneState.velocity;
      if (Math.abs(v) > 0.5) dir = Math.sign(v);
      const speed = (0.6 + Math.min(Math.abs(v) * 0.6, 14)) * dir * (delta / 16.7);
      x -= speed;
      const w = a.current.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      a.current.style.transform = `translate3d(${x}px,0,0)`;
      b.current.style.transform = `translate3d(${-w - x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const half = Math.ceil(stack.length / 2);

  return (
    <section id="stack" data-phase="DECLINING" className="relative z-10 overflow-hidden py-28 md:py-40">
      <FloatObject
        src="/objects/code.webp"
        className="left-[40vw] top-[2vh] w-[18vw] min-w-[120px] max-w-[280px]"
        depth={0.9}
        spin={-12}
      />
      <div className="mb-10 flex items-end justify-between px-[var(--gutter)] md:mb-14">
        <SectionLabel index="05">Stack</SectionLabel>
        <p className="max-w-xs text-right text-[14px] leading-relaxed text-muted">The tools we reach for. We pick per product, not per habit.</p>
      </div>
      <Row items={stack.slice(0, half)} rowRef={a} />
      <Row items={stack.slice(half)} rowRef={b} outline />
    </section>
  );
}
