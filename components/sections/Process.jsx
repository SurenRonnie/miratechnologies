"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import FloatObject from "@/components/scene/FloatObject";

const STEPS = [
  { title: "Discover", text: "Workshops, audits and user interviews. We find the real problem and the number that proves it is solved." },
  { title: "Design", text: "Flows, prototypes and a visual system, tested with real users before a line of production code." },
  { title: "Build", text: "Senior engineers ship in weekly increments with staging links you can click, not status reports." },
  { title: "Scale", text: "Launch, measure, grow. Performance, SEO and campaigns keep the product brightening after release." },
];

/*
  Maximum. The star swells to fill the screen (scene layer) and a circle of warm paper
  floods out from it. The steps advance with scroll. On the way out the circle shrinks back.
*/
export default function Process() {
  const root = useRef(null);
  const paper = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const q = gsap.utils.selector(root);
    const steps = q("[data-step]");

    if (reduce) {
      gsap.set(paper.current, { clipPath: "circle(150% at 50% 50%)" });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.fromTo(paper.current, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(150% at 50% 50%)", duration: 0.16 })
        .fromTo(content.current, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.12)
        .fromTo(q("[data-process-title] [data-line]"), { yPercent: 110 }, { yPercent: 0, stagger: 0.02, duration: 0.06 }, 0.13);

      steps.forEach((step, i) => {
        const at = 0.2 + i * 0.15;
        tl.fromTo(step, { opacity: 0.18 }, { opacity: 1, duration: 0.05 }, at);
        tl.fromTo(step.querySelector("[data-step-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.12 }, at);
        if (i < steps.length - 1) tl.to(step, { opacity: 0.35, duration: 0.05 }, at + 0.15);
      });

      tl.to(content.current, { opacity: 0, duration: 0.04 }, 0.84).to(
        paper.current,
        { clipPath: "circle(0% at 50% 50%)", duration: 0.12 },
        0.86
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={root} data-phase="MAXIMUM" className="relative z-10 h-[460vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={paper} className="absolute inset-0 bg-paper" style={{ clipPath: "circle(0% at 50% 50%)" }} />
        <div ref={content} className="relative flex h-full flex-col px-[var(--gutter)] pt-24 text-paper-ink md:pt-28" style={{ opacity: 0 }}>
          <FloatObject
            src="/objects/layers.webp"
            className="right-[5vw] top-[9vh] w-[32vw] min-w-[180px] max-w-[500px]"
            depth={0.5}
            spin={8}
            trigger="#process"
          />
          <div className="relative flex items-start justify-between gap-6">
            <h2 data-process-title className="t-display t-section">
              <span className="mask-line"><span data-line>HOW A PRODUCT</span></span>
              <span className="mask-line"><span data-line>REACHES MAXIMUM</span></span>
            </h2>
          </div>
          <SectionLabel index="04" className="relative mt-4 !text-paper-ink/50">
            Process
          </SectionLabel>

          <ol className="relative mt-auto grid gap-6 pb-12 md:grid-cols-4 md:gap-8 md:pb-16">
            {STEPS.map((s, i) => (
              <li key={s.title} data-step className="opacity-20">
                <span className="block h-px w-full bg-paper-ink/15">
                  <span data-step-bar className="block h-px w-full origin-left bg-paper-ink" />
                </span>
                <p className="t-label mt-4 text-paper-ink/55">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-display mt-2 text-[clamp(1.1rem,1.8vw,1.7rem)]">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-paper-ink/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
