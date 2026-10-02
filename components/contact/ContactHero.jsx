"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, scrollToTarget } from "@/lib/motion";
import { onReady } from "@/components/ui/Preloader";
import Arrow from "@/components/ui/Arrow";
import FloatObject from "@/components/scene/FloatObject";

// Same banner language as the home hero: centred wide type over the planet limb.
export default function ContactHero() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.set(q("[data-line]"), { yPercent: 115 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 14 });
    }, root);
    const stop = onReady(() =>
      ctx.add(() => {
        gsap
          .timeline({ delay: 0.3 })
          .to(q("[data-line]"), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" })
          .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, "-=0.8");
        gsap.to(q("[data-hero-content]"), {
          yPercent: -35,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: 1 },
        });
      })
    );
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section id="contact-hero" ref={root} data-phase="MINIMUM" className="relative z-10 flex h-[100svh] min-h-[600px] flex-col items-center overflow-hidden px-[var(--gutter)]">
      <FloatObject
        src="/objects/plane.webp"
        className="right-[5vw] top-[16vh] hidden w-[19vw] max-w-[290px] md:block"
        depth={0.6}
        spin={10}
        sizes="(min-width: 768px) 15vw, 30vw"
      />
      <div data-hero-content className="mt-[17vh] flex flex-col items-center text-center md:mt-[15vh]">
        <h1 className="t-display t-hero text-ink">
          <span className="mask-line"><span data-line>LET’S TALK</span></span>
          <span className="mask-line"><span data-line>ABOUT ORBIT</span></span>
        </h1>
        <p data-fade className="mt-6 max-w-[36ch] text-[13px] leading-relaxed text-ink/85 md:text-sm">
          New product, rescue mission or a growth problem. Tell us where you are in the cycle.
        </p>
        <button type="button" data-fade onClick={() => scrollToTarget("#contact-form")} className="pill mt-6">
          <span className="roll">
            <span>Write to us</span>
            <span aria-hidden="true">Write to us</span>
          </span>
          <Arrow dir="down" size={12} />
        </button>
      </div>
    </section>
  );
}
