"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { onReady } from "@/components/ui/Preloader";
import Button from "@/components/ui/Button";
import FloatObject from "@/components/scene/FloatObject";

const LINES = ["MIRA — BUILT", "TO BRIGHTEN"];

export default function Hero() {
  const root = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(q("[data-line]"), { yPercent: 115 });
        gsap.set(q("[data-hero-fade]"), { opacity: 0, y: 14 });
      }
    }, root);

    const stop = onReady(() => {
      if (reduce) return;
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.35 })
          .to(q("[data-line]"), { yPercent: 0, duration: 1.4, stagger: 0.12, ease: "expo.out" })
          .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, "-=0.9");

        // dolly into the atmosphere: the headline splits and exits upward as we scroll
        gsap.to(content.current, {
          yPercent: -38,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: 1 },
        });
      });
    });

    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      data-phase="MINIMUM"
      className="relative z-10 flex h-[100svh] min-h-[600px] flex-col items-center overflow-hidden px-[var(--gutter)]"
    >
      {/* what we build, floating above the limb: mobile apps and trading platforms */}
      <FloatObject
        src="/objects/phone.webp"
        className="left-[5vw] top-[14vh] w-[17vw] min-w-[90px] max-w-[240px]"
        depth={0.5}
        spin={10}
        sizes="(min-width: 768px) 17vw, 25vw"
      />
      <FloatObject
        src="/objects/chart.webp"
        className="right-[3vw] top-[18vh] hidden w-[20vw] max-w-[300px] md:block"
        depth={0.8}
        spin={-8}
        sizes="20vw"
      />

      <div ref={content} className="relative mt-[17vh] flex flex-col items-center text-center md:mt-[15vh]">
        <h1 className="t-display t-hero text-ink">
          {LINES.map((line) => (
            <span key={line} className="mask-line">
              <span data-line>{line}</span>
            </span>
          ))}
        </h1>
        <p data-hero-fade className="mt-6 max-w-[34ch] text-[13px] leading-relaxed text-ink/85 md:text-sm">
          A product studio for web platforms, trading systems and mobile apps.
        </p>
        <div data-hero-fade className="mt-6">
          <Button href="/contact-us">Start a project</Button>
        </div>
      </div>

    </section>
  );
}
