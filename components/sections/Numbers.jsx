"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { numbers } from "@/data/site";
import SectionLabel from "@/components/ui/SectionLabel";
import MaskLines from "@/components/ui/MaskLines";
import FloatObject from "@/components/scene/FloatObject";

// Declining phase. Counters are scrubbed by scroll as the star dims behind them.
export default function Numbers() {
  const root = useRef(null);

  useEffect(() => {
    const els = root.current.querySelectorAll("[data-count]");
    if (prefersReducedMotion()) {
      els.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }
    const ctx = gsap.context(() => {
      els.forEach((el, i) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: Number(el.dataset.count),
          ease: "none",
          onUpdate: () => (el.textContent = Math.round(obj.v)),
          scrollTrigger: { trigger: root.current, start: `top ${85 - i * 5}%`, end: "center 55%", scrub: 1 },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="numbers" ref={root} data-phase="DECLINING" className="relative z-10 px-[var(--gutter)] py-28 md:py-44">
      <FloatObject
        src="/objects/growth.webp"
        className="-right-[2vw] top-[0vh] w-[28vw] min-w-[160px] max-w-[430px]"
        depth={0.6}
        spin={8}
      />
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel index="06">Numbers</SectionLabel>
          <MaskLines lines={["THE CYCLE,", "MEASURED"]} className="t-display t-section mt-6 text-ink" />
        </div>
        <p className="max-w-sm self-end text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-8">
          Brightness is a measurement, not a feeling. These are the ones we track for ourselves.
        </p>
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-24 md:grid-cols-4">
        {numbers.map((n, i) => (
          <div key={n.label} className={`border-t border-hairline pt-5 ${i % 2 === 1 ? "md:mt-20" : ""}`}>
            <dt className="t-label text-dim">{n.label}</dt>
            <dd className="t-display mt-4 text-[clamp(2.4rem,6vw,5.5rem)] leading-none text-ink">
              <span data-count={n.value}>0</span>
              <span className="text-ember">{n.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
